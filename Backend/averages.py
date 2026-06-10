from nba_api.stats.endpoints import leaguedashplayerstats

stats = leaguedashplayerstats.LeagueDashPlayerStats(
    season='2025-26',
    per_mode_detailed='PerGame'
)
df = stats.get_data_frames()[0]


print(df.columns)
league_avg_points = df['PTS'].mean()
league_avg_rebounds = df['REB'].mean()
league_avg_assists = df['AST'].mean()

print(f"League Average Points: {league_avg_points}")
print(f"League Average Rebounds: {league_avg_rebounds}")
print(f"League Average Assists: {league_avg_assists}")