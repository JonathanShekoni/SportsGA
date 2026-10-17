# Profile lookups

Visitor requests read biographies and awards from
`sportsga_cache.player_details` in the database configured by `DATABASE_URL`.
Career stats use the same snapshot when present, otherwise the existing
`ml_data.player_seasons` history. The server does not call stats.nba.com during
a profile lookup. An unavailable component remains unavailable rather than
being reported as zero awards.

## Refresh from your computer

Use the same PostgreSQL database as Render. Set `DATABASE_URL` in your local
environment, `Backend/.env`, or the repository's root `.env`. Never commit it.
From `Backend`, run:

```text
python refresh_profiles.py --missing-only
```

This creates the cache schema/table if necessary and fills missing components
for players in the season schema. Existing career history counts as available.
Successful components are written in their own transactions. A failure never
overwrites good data; rerun the command to retry. Unresolved player names are
printed and skipped to avoid assigning another player's awards.

To refresh all three components for one player, including already saved data:

```text
python refresh_profiles.py --player-id 2544
```

Omit `--missing-only` to update all recognized roster players. Update snapshots
after new awards or completed seasons. Existing history is a snapshot, not a
live source; missing-only mode does not update old records.

On managed Windows networks, if Python reports certificate verification errors,
install `truststore` in your local Python environment. The refresh command uses
it when installed to trust the Windows certificate store while retaining HTTPS
verification. Do not disable certificate checks.

No Render or Vercel environment-variable changes are needed. Deploy both code
changes after populating the cache. For another database, run the refresh there
before deployment. Successful cache reads take precedence over in-memory data,
so refreshes do not require restarting the backend.

## Verification

Backend: `python -m pytest`

Frontend request-race regressions: `node --test tests/profileRequests.test.mjs`

Frontend production build: `npm run build`

For local profile testing only, set `VITE_API_URL` to your local backend URL
before starting Vite. Production defaults to the existing Render URL.

The frontend cancels superseded lookups and ignores late responses even if the
request cannot be cancelled. Season stats and career stats load independently.
The displayed name is checked before rendering so old stats cannot appear
under a new player's heading. HTTP errors and invalid JSON end in an error
message instead of an endless spinner.
