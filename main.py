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

curr = conn.cursor()

curr.execute("SELECT * FROM NBA 2025-2026 Season.my_table") #Replace my_table with desired player


PPG = None #Points per game
APG = None #Assists per game
RPG = None #Rebounds per game


#Compares players stats
def comparePlayers(player1,player2):
    
    pass



#Flask testing

"""app = Flask(__name__) # Flask constructor
#Decorator used to tell the application which URL is associated with the function
@app.route('/')

def home():
    return f"Sports Analytics API Running: {career.get_json}"


if __name__ == "__main__":
    app.run(debug=True) """