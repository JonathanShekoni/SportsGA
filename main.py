from flask import Flask, redirect, url_for
from nba_api.stats.endpoints import playercareerstats
import psycopg2 as pg
import pandas
import numpy

#Database Testing
try:
    conn = pg.connect(
        host = 'localhost',
        database = 'PlayerStats',
        port =  5432,
        user = 'postgres',
        password = 'Lekan228899'

    )
except Exception as err:
    print("Something went wrong")
    print(err)



#Nba api testing(Shai)
career = playercareerstats.PlayerCareerStats(player_id='1628983')

#pandas data frames
shaiStats1 = career.season_totals_regular_season.get_data_frame()

#Create csv file from dataframe
shaiStats1.to_csv('shaiStats.csv')

#Configure filepath and table name for later access
csv_file_path = 'shaiStats.csv'
table_name = 'shaivonte'

print(shaiStats1)

#Creates table for data storage
cur = conn.cursor()
cur.execute("""
            CREATE TABLE Shaivonte(
            row_index VARCHAR(1),
            PLAYER_ID VARCHAR(10),
            SEASON_ID VARCHAR(10),
            LEAGUE_ID CHAR(10),
            TEAM_ID VARCHAR(20),
            TEAM_ABBREVIATION CHAR(20),
            PLAYER_AGE NUMERIC(3,1),
            GP INTEGER,
            GS INTEGER,
            MIN INTEGER,
            FGM INTEGER,
            FGA INTEGER,
            FG_PCT NUMERIC(5,3),
            FG3M INTEGER,
            FG3A INTEGER,
            FG3_PCT NUMERIC(5,3),
            FTM INTEGER,
            FTA INTEGER,
            FT_PCT NUMERIC(5,3),
            OREB INTEGER,
            DREB INTEGER,
            REB INTEGER,
            AST INTEGER,
            STL INTEGER,
            BLK INTEGER,
            TOV INTEGER,
            PF INTEGER,
            PTS INTEGER
)
""")

#Passes table creation
conn.commit()

#COPY TABLE
copy_sql = f"""
            COPY {table_name} FROM stdin
            WITH CSV HEADER
            DELIMITER as ',' 
            """

with open(csv_file_path, 'r') as f:
    cur.copy_expert(sql=copy_sql, file=f)


conn.commit()
#Database Operations

#Insert player season stats from nba API

#Transform stats into a numpy array

#Create csv file from numpy array 

#Use csv file to create a table in players database


#Function for adding player stats to database
def insert_player(player_id,tablename):
    #Create csv file from player id
    
    pass




#End of operations
cur.close()
conn.close()




#Flask testing

"""app = Flask(__name__) # Flask constructor
#Decorator used to tell the application which URL is associated with the function
@app.route('/')

def home():
    return f"Sports Analytics API Running: {career.get_json}"


if __name__ == "__main__":
    app.run(debug=True) """