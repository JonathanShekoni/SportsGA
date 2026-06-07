from nba_api.stats.static import players
from sqlalchemy import create_engine, inspect, text
from dotenv import load_dotenv
import os

load_dotenv()

engine = create_engine(
    f'{os.getenv('DATABASE_URL')}',
    pool_size=20,
    max_overflow=10,
    pool_timeout=60
)

#Inspect the Database Schema
inspector = inspect(engine)

all_table_names = inspector.get_table_names(schema='NBA_2025-2026_Season')

formatted_all_table_names = [name.replace('_', ' ') for name in all_table_names]


all_players = players.get_players()

#Player:Id pair
mappedPlayers = {}

for player in all_players:
    mappedPlayers[f'{player['full_name']}'] = player['id']
    
#Handle players with special characters in name
name_fixes = {
    "Luka Doncic": "Luka Dončić",
    "Nikola Jokic": "Nikola Jokić",
    "Jaren Jackson Jr.": "Jaren Jackson",
    "Jimmy Butler": "Jimmy Butler III",
}

for player in formatted_all_table_names:
    try:
        lookup_name = name_fixes.get(player, player)
        nba_id = mappedPlayers[lookup_name]
 
        with engine.connect() as conn:
            conn.execute(text(f'UPDATE "NBA_2025-2026_Season"."{player.replace(' ','_')}" SET player_id = {nba_id}'))
            conn.commit()
            print(f"Updated {player} with ID {nba_id}")
    except Exception as e:
        print(f"{player} not found in dictionary")




print(f"Alex Caruso Id: {mappedPlayers['Alex Caruso']}")