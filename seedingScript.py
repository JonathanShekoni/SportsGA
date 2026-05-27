import requests
import time
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()
API_KEY = os.getenv('BALLDONTLIE_API_KEY')

# Temporary debug lines
print(f"API KEY LOADED: {API_KEY}")
print(f"Response status: {response.status_code if 'response' in dir() else 'no response yet'}")


# Database connection
engine = create_engine(
    'postgresql+psycopg2://postgres:Lekan228899@localhost:5432/PlayerStats',
    pool_size=20,
    max_overflow=10,
    pool_timeout=60
)

# Session with API key header
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

        print(f"Status code: {response.status_code}")
        print(f"Raw response: {response.text}")

        if response.status_code == 429:
            print("Rate limited, waiting 60 seconds...")
            time.sleep(60)
            continue

            
        data = response.json()
        players.extend(data['data'])

        # If there is no next cursor, we've gotten every player
        next_cursor = data['meta'].get('next_cursor')
        if not next_cursor:
            break

        cursor = next_cursor
        time.sleep(1)

    return players

def get_player_stats(player_id):
    all_stats = []
    cursor = 0

    while True:
        response = session.get(
            'https://api.balldontlie.io/v1/season_averages',
            params={
                'player_ids[]': player_id,
                'cursor': cursor,
                'per_page': 100
            }
        )
        data = response.json()
        all_stats.extend(data['data'])

        next_cursor = data['meta'].get('next_cursor')
        if not next_cursor:
            break

        cursor = next_cursor
        time.sleep(1)

    return pd.DataFrame(all_stats)

# Fetch and insert all players
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