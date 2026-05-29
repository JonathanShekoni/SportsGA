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

#Player class
class Player:

    def __init__(self,name,points,rebounds,assists):
        self.name = name
        self.points = points
        self.rebounds = rebounds
        self.assists = assists


    def get_stats(self): 
        curr.execute(f'SELECT * FROM "NBA_2025-2026_Season"."{self.name}"')
        row = curr.fetchall()

        self.points = row[0][0]
        self.rebounds = row[0][11]
        self.assists = row[0][1]



#Compares players stats
def comparePlayers(player1,player2):
    #Tracks how many stats each player won
    score1 = 0
    score2 = 0
    
    
    #Initializes both players stats
    player1.get_stats()
    
    player2.get_stats()


    #Stores who won which individual stat
    comparisons = {
        "points": None,
        "rebounds": None,
        "assists": None,
        "winner": None,
    }
    

    if (player1.points > player2.points):
        score1 += 1
        comparisons["points"] = player1.name
    elif (player1.points == player2.points):
        score1 += 1
        score2 += 1
        comparisons["points"] = "tie"
    else:
        score2 += 1
        comparisons["points"] = player2.name
    

    if (player1.rebounds > player2.rebounds):
        score1 += 1
        comparisons["rebounds"] = player1.name
    elif (player1.rebounds == player2.rebounds):
        score1 += 1
        score2 += 1
        comparisons["rebounds"] = "tie"
    else:
        score2 += 1
        comparisons["rebounds"] = player2.name


    if (player1.assists > player2.assists):
        score1 += 1
        comparisons["assists"] = player1.name
    elif (player1.assists == player2.assists):
        score1 += 1
        score2 += 1
        comparisons["assists"] = "tie"
    else:
        score2 += 1
        comparisons["assists"] = player2.name


    if score1 > score2 :    
        print(f"{player1.name} is overall better than {player2.name}")
        comparisons["winner"] = player1.name
    elif score1 < score2:
        print(f"{player2.name} is overall better than {player1.name}")
        comparisons["winner"] = player2.name
    else:
        print(f"{player1.name} and {player2.name} are statistically equal")
        comparisons["winner"] = "tie"

    print(f"{player1.name}\nPPG:{player1.points}\nAPG:{player1.assists}\nRPG:{player1.rebounds}\n----------")
    print(f"{player2.name}\nPPG:{player2.points}\nAPG:{player2.assists}\nRPG:{player2.rebounds}\n----------")


#Test
playertest1 = Player("Alex_Caruso",0,0,0)

playertest2 = Player("Ajay_Mitchell",0,0,0)

comparePlayers(playertest1,playertest2)

conn.close()
#Flask testing

"""app = Flask(__name__) # Flask constructor
#Decorator used to tell the application which URL is associated with the function
@app.route('/')

def home():
    return f"Sports Analytics API Running: {career.get_json}"


if __name__ == "__main__":
    app.run(debug=True) """