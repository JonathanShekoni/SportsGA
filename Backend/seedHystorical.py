from nba_api.stats.endpoints import playercareerstats
from sqlalchemy import create_engine,text
import pandas as pd
from dotenv import load_dotenv
import time

import os
load_dotenv()

def query_db(query):
    
    try:
        #Use pd.read_sql to execute the query and load results into a DataFrame
        df = pd.read_sql(query,engine)
        print("Query completed Succesfully!")
        return df
    
    except Exception as e:
        print(f"REAL ERROR: {e}")
        return None
    

class Player:

    def __init__(self,name):
        self.name = name
        self.points = 0
        self.rebounds = 0
        self.assists = 0


    def get_id(self):
        query = f'SELECT * FROM "NBA_2025-2026_Season"."{self.name}"'
        df = query_db(query)
        print(df.columns.tolist())
        self.id = int(df['player_id'][0])

    def get_stats(self): 
        query = f'SELECT * FROM "NBA_2025-2026_Season"."{self.name}"'
        df = query_db(query)
        print(df.columns.tolist())  # prints all column names
        print(df.head())            # prints first row
        
        self.points = float(df['pts'][0])
        self.rebounds = float(df['reb'][0])
        self.assists = float(df['ast'][0])
        self.id = int(df['player_id'][0])
        self.fg_pct = float(df['fg_pct'][0])
        self.fg3_pct = float(df['fg3_pct'][0])
        self.ft_pct = float(df['ft_pct'][0])
        self.to = float(df['turnover'][0])
        self.stl = float(df['stl'][0])
        self.blk = float(df['blk'][0])


#Link to database
engine = create_engine(os.getenv('DATABASE_URL'))


query = """
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'ml_data'
"""



df = query_db(query)
player_names = df['table_name'].tolist()
players = []

#Fill player table
for name in player_names:
    try:
        player = Player(name)
        player.get_id()
        players.append(player)
    except Exception as e:
        print(f"Skipping {name}: {e}")
        continue


#Create ml schema
with engine.connect() as conn:
    conn.execute(text("CREATE SCHEMA IF NOT EXISTS ml_data"))
    conn.commit()

with engine.connect() as conn:
    conn.execute(text("DROP TABLE IF EXISTS ml_data.player_seasons"))
    conn.commit()

#Get player stats
for player in players:
    print(f"Processing {player.name}")
    success = False
    attempts = 0
    while not success and attempts < 3:
        try:
            career = playercareerstats.PlayerCareerStats(
                player_id = player.id,
                per_mode36 = 'PerGame'
            )

            df = career.season_totals_regular_season.get_data_frame()
            df['PLAYER_NAME'] = player.name

            stats = df[['PLAYER_NAME','PLAYER_ID','SEASON_ID','PLAYER_AGE','GP','MIN','PTS', 'REB', 'AST', 'FG_PCT',"FG3_PCT","FT_PCT"]]
            stats.to_sql(
                name = 'player_seasons',
                con=engine,
                if_exists='append',
                index=False,
                schema='ml_data'
            )
            success = True
        except Exception as e:
            print(f"Error on {player.name}: {e}. Retrying...")
            attempts += 1
            time.sleep(5)

    time.sleep(3)

df = query_db("SELECT * FROM ml_data.player_seasons LIMIT 20")
print(df)