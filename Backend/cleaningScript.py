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
    

engine = create_engine(os.getenv('DATABASE_URL'))

query = """
    SELECT player_seasons 
    FROM information_schema.tables 
    WHERE table_schema = 'NBA_2025-2026_Season'
"""