from flask import Flask, redirect, url_for
from nba_api.stats.endpoints import playercareerstats
import psycopg2 as pg
import pandas
import numpy

#Connect to the DB
try:
    conn = pg.connect(
        host = 'localhost',
        database = 'PlayerStats',
        port =  5432,
        user = 'postgres',
        password = 'Lekan228899',
    )


except Exception as err:
    print("Something went wrong")
    print(err)


#Cursor
curr = conn.cursor()

curr.execute('SELECT * FROM "NBA_2025-2026_Season"."Amen_Thompson"') #Replace my_table with desired player
row = curr.fetchall()
print(row[0][0])

#Selects all data from player table on Postgres
def load_player_data(player):
    curr.execute(f'SELECT * FROM "NBA_2025-2026_Season"."{player}"')


#Compares players stats
def comparePlayers(player1,player2):
    score1 = 0
    score2 = 0

    load_player_data(player1)
    row = curr.fetchall()
    points1 = row[0][0]
    rebounds1 = row[0][11]
    assists1 = row[0][1]

    load_player_data(player2)
    row = curr.fetchall()
    points2 = row[0][0]
    rebounds2 = row[0][11]
    assists2 = row[0][1]
    
    if (points1 > points2) or (rebounds1 > rebounds2) or (assists1 > assists2):
        score1 += 1
    elif (points1 == points2) or (rebounds1 == rebounds2) or (assists1 == assists2):
        score1 += 1
        score2 += 1
    else:
        score2 += 1

    if score1 > score2 :
        print(f"{player1} is overall better than {player2}")
    elif score1 < score2:
        print(f"{player2} is overall better than {player1}")
    else:
        print(f"{player1} and {player2} are statistically equal")


comparePlayers("Alex_Caruso","Ajay_Mitchell")

conn.close()
#Flask testing

"""app = Flask(__name__) # Flask constructor
#Decorator used to tell the application which URL is associated with the function
@app.route('/')

def home():
    return f"Sports Analytics API Running: {career.get_json}"


if __name__ == "__main__":
    app.run(debug=True) """