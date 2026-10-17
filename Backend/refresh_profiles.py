"""Run locally to refresh persistent profile data, away from Render's NBA timeouts.

python refresh_profiles.py --player-id 2544
python refresh_profiles.py --missing-only
"""
from concurrent.futures import ThreadPoolExecutor
import argparse
import json
import os
import time
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, text

SCHEMA = 'NBA_2025-2026_Season'


def refresh(engine, player_ids, missing_only=False, workers=1):
    from nba_api.stats.endpoints import commonplayerinfo, playerawards, playercareerstats
    from profile_store import saved_career, saved_component

    with engine.begin() as conn:
        conn.execute(text('CREATE SCHEMA IF NOT EXISTS sportsga_cache'))
        conn.execute(text('''CREATE TABLE IF NOT EXISTS sportsga_cache.player_details (
            player_id bigint PRIMARY KEY,
            biography jsonb, awards jsonb, career jsonb,
            biography_updated_at timestamptz, awards_updated_at timestamptz,
            career_updated_at timestamptz
        )'''))
    def refresh_player(player_id):
        failures = 0
        for component in ('biography', 'awards', 'career'):
            existing = (saved_career(engine, player_id) if component == 'career'
                        else saved_component(engine, player_id, component))
            if missing_only and existing is not None:
                continue
            try:
                if component == 'biography':
                    row = commonplayerinfo.CommonPlayerInfo(player_id=player_id, timeout=8).get_data_frames()[0].iloc[0]
                    value = {key: str(row[key]) for key in (
                        'POSITION', 'TEAM_NAME', 'DRAFT_YEAR', 'HEIGHT', 'COUNTRY', 'SCHOOL', 'WEIGHT', 'BIRTHDATE'
                    )}
                    value['BIRTHDATE'] = value['BIRTHDATE'][:10]
                elif component == 'awards':
                    value = playerawards.PlayerAwards(player_id=player_id, timeout=8).get_data_frames()[0]['DESCRIPTION'].tolist()
                else:
                    frame = playercareerstats.PlayerCareerStats(player_id=player_id, per_mode36='PerGame', timeout=8).season_totals_regular_season.get_data_frame()
                    # Keep all-teams totals for traded seasons; one point per season.
                    frame = frame.sort_values('GP', ascending=False).drop_duplicates('SEASON_ID').sort_values('SEASON_ID')
                    value = json.loads(frame[['SEASON_ID', 'PTS', 'REB', 'AST', 'FG_PCT']].to_json(orient='records'))
                with engine.begin() as conn:
                    conn.execute(text(f'''INSERT INTO sportsga_cache.player_details
                        (player_id, {component}, {component}_updated_at)
                        VALUES (:id, CAST(:data AS jsonb), now())
                        ON CONFLICT (player_id) DO UPDATE SET
                        {component} = EXCLUDED.{component}, {component}_updated_at = now()'''),
                        {'id': player_id, 'data': json.dumps(value, allow_nan=False)})
                print(f'{player_id}: saved {component}', flush=True)
            except Exception as exc:
                failures += 1
                # A failed refresh never overwrites an existing successful snapshot.
                print(f'{player_id}: {component} failed ({type(exc).__name__})', flush=True)
            time.sleep(0.6)
        return failures

    with ThreadPoolExecutor(max_workers=workers) as executor:
        return sum(executor.map(refresh_player, player_ids))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--player-id', type=int, action='append')
    parser.add_argument('--missing-only', action='store_true')
    parser.add_argument('--workers', type=int, choices=(1, 2), default=1)
    parser.add_argument('--env-file', type=Path, help='Optional local environment file')
    args = parser.parse_args()
    # Windows trust roots handle managed networks without disabling HTTPS checks.
    try:
        import truststore
        truststore.inject_into_ssl()
    except ImportError:
        pass
    if args.env_file:
        load_dotenv(args.env_file)
    load_dotenv(Path(__file__).with_name('.env'))
    load_dotenv(Path(__file__).parent.parent / '.env')
    engine = create_engine(os.environ['DATABASE_URL'], pool_pre_ping=True, connect_args={'connect_timeout': 8})
    ids = args.player_id
    if not ids:
        from player_identity import nba_player_id
        with engine.connect() as conn:
            names = conn.execute(text('''SELECT table_name FROM information_schema.columns
                WHERE table_schema = :schema AND column_name = 'player_id' '''), {'schema': SCHEMA}).scalars().all()
            ids = set()
            for name in names:
                player_id = nba_player_id(name)
                if player_id is None:
                    print(f'Unmapped player: {name}; skipped rather than using an uncertain ID.', flush=True)
                else:
                    ids.add(player_id)
            ids = sorted(ids)
    if not ids:
        raise SystemExit('No players found; check DATABASE_URL and the season schema.')
    failures = refresh(engine, ids, args.missing_only, args.workers)
    print(f'Finished {len(ids)} players; {failures} component refresh failures.', flush=True)
    return bool(failures)


if __name__ == '__main__':
    raise SystemExit(main())
