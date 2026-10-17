"""Read persistent NBA snapshots; visitor requests never need to refresh them."""
from sqlalchemy import text

COMPONENTS = {'biography', 'awards', 'career'}


def saved_component(engine, player_id, component):
    if component not in COMPONENTS:
        raise ValueError('Unknown profile component')
    with engine.connect() as conn:
        if conn.execute(text("SELECT to_regclass('sportsga_cache.player_details')")).scalar() is None:
            return None
        return conn.execute(text(
            f'SELECT {component} FROM sportsga_cache.player_details WHERE player_id = :id'
        ), {'id': int(player_id)}).scalar()


def saved_career(engine, player_id):
    snapshot = saved_component(engine, player_id, 'career')
    if snapshot is not None:
        return snapshot
    with engine.connect() as conn:
        if conn.execute(text("SELECT to_regclass('ml_data.player_seasons')")).scalar() is None:
            return None
        # A traded player's all-teams row has the most games. Prefer it to
        # individual team rows, and collapse repeat runs of the old seed script.
        rows = conn.execute(text('''
            SELECT DISTINCT ON ("SEASON_ID") "SEASON_ID", "PTS", "REB", "AST", "FG_PCT"
            FROM ml_data.player_seasons WHERE "PLAYER_ID" = :id
            ORDER BY "SEASON_ID", "GP" DESC
        '''), {'id': int(player_id)}).mappings().all()
        return [dict(row) for row in rows] or None
