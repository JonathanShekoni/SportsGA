import requests
import time
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv('BALLDONTLIE_API_KEY')

engine = create_engine(
    'postgresql+psycopg2://postgres:Lekan228899@localhost:5432/PlayerStats',
    pool_size=20,
    max_overflow=10,
    pool_timeout=60
)

session = requests.Session()
session.headers.update({
    'Authorization': API_KEY
})

def get_all_players():
    players = []
    cursor = 0

    while True:
        response = session.get(
            'https://api.balldontlie.io/v1/players/active',
            params={'cursor': cursor, 'per_page': 100}
        )

        if response.status_code == 429:
            print("Rate limited, waiting 60 seconds...")
            time.sleep(60)
            continue

        data = response.json()
        players.extend(data['data'])

        next_cursor = data['meta'].get('next_cursor')
        if not next_cursor:
            break

        cursor = next_cursor
        time.sleep(1)

    return players

def get_player_stats(player_id):
    response = session.get(
        'https://api.balldontlie.io/v1/season_averages',
        params={
            'player_id': player_id,
            'season': 2024
        }
    )

    if response.status_code == 429:
        print("Rate limited, waiting 60 seconds...")
        time.sleep(60)
        return get_player_stats(player_id)

    if not response.text.strip():
        return pd.DataFrame()

    try:
        data = response.json()
    except Exception:
        return pd.DataFrame()

    if 'data' not in data:
        return pd.DataFrame()

    return pd.DataFrame(data['data'])

players = get_all_players()
print(f"Found {len(players)} players")

for player in players:
    try:
        stats = get_player_stats(player['id'])

        if stats.empty:
            print(f"No stats for {player['first_name']} {player['last_name']}, skipping")
            continue

        stats.to_sql(
            name=f"{player['first_name']}_{player['last_name']}",
            con=engine,
            if_exists='replace',
            index=False,
            schema='public'
        )
        print(f"Inserted {player['first_name']} {player['last_name']}")
        time.sleep(1)

    except Exception as e:
        print(f"Failed on {player['first_name']} {player['last_name']}: {e}")
        time.sleep(2)
        continue