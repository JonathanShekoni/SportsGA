from nba_api.stats.endpoints import leaguedashplayerstats
from nba_api.stats.endpoints import commonplayerinfo
from nba_api.stats.endpoints import playerawards
import pandas as pd

stats = leaguedashplayerstats.LeagueDashPlayerStats(
    season='2025-26',
    per_mode_detailed='PerGame'
)
df = stats.get_data_frames()[0]


print(df.columns)
league_avg_points = df['PTS'].mean()
league_avg_rebounds = df['REB'].mean()
league_avg_assists = df['AST'].mean()
league_avg_fg_pct = df['FG_PCT'].mean()
league_avg_fg3_pct = df['FG3_PCT'].mean()
league_avg_ft_pct = df['FT_PCT'].mean()
league_avg_to = df['TOV'].mean()
league_avg_stl = df['STL'].mean()
league_avg_blk = df['BLK'].mean()


print(f"League Average Points: {league_avg_points}")
print(f"League Average Rebounds: {league_avg_rebounds}")
print(f"League Average Assists: {league_avg_assists}")
print(f"League Average FG%: {league_avg_fg_pct}")
print(f"League Average 3P%: {league_avg_fg3_pct}")
print(f"League Average FT%: {league_avg_ft_pct}")
print(f"League Average Turnovers: {league_avg_to}")
print(f"League Average Steals: {league_avg_stl}")
print(f"League Average Blocks: {league_avg_blk}")



info = commonplayerinfo.CommonPlayerInfo(player_id=1628983)

print("/n/n/n/n")
awards = playerawards.PlayerAwards(player_id=1628983)


for award in awards.get_data_frames()[0]['DESCRIPTION']:
    print(award)

awards_dict = {'All-NBA': 0, 'All-NBA Second Team': 0, 'All-NBA Third Team': 0, 'NBA Most Valuable Player': 0, 'NBA Finals Most Valuable Player': 0, 'NBA Defensive Player of the Year': 0, 'NBA Rookie of the Year': 0}

for award in awards.get_data_frames()[0]['DESCRIPTION']:
    if award in awards_dict:
        awards_dict[award] += 1

print(awards_dict)

info = playerawards.PlayerAwards(player_id=1628983)
df = info.get_data_frames()[0]
if 'NBA Most Valuable Player' in df['DESCRIPTION'].values:
    print("Player has won MVP")