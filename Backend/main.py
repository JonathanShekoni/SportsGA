from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
import pandas as pd

db = SQLAlchemy()  # Created without app first


def create_app():
    app = Flask(__name__, instance_relative_config=True)

    #Enables CORS for the whole app
    CORS(app)

    app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql://postgres:Lekan228899@localhost:5432/PlayerStats'
    db.init_app(app)  # Then connected to app here


    @app.route('/')
    @app.route('/home')
    def home():
        return "<h1>Flask REST API</h1>"
    
    @app.route('/compare')
    
    def compare():
        print("COMPARE ROUTE HIT")
        try:
            player1_name = request.args.get("player1").replace(" ", "_")
            player2_name = request.args.get("player2").replace(" ", "_")
            print(f"Looking up: {player1_name} and {player2_name}")

            #Create Player objects
            player1 = Player(player1_name,0,0,0)
            player2 = Player(player2_name,0,0,0)

            return jsonify(comparePlayers(player1,player2))
        except Exception as e:
            return jsonify({"error": "Player not found. Please try again."}), 404
    


    return app

#Connect to the DB
engine = create_engine(
    'postgresql+psycopg2://postgres:Lekan228899@localhost:5432/PlayerStats',
    pool_size=20,
    max_overflow=10,
    pool_timeout=60
)



def query_db(query):
    
    try:
        #Use pd.read_sql to execute the query and load results into a DataFrame
        df = pd.read_sql(query,engine)
        print("Query completed Succesfully!")
        return df
    
    except Exception as e:
        print(f"REAL ERROR: {e}")
        return jsonify({"error": str(e)}), 404

#Player class
class Player:

    def __init__(self,name,points,rebounds,assists):
        self.name = name
        self.points = points
        self.rebounds = rebounds
        self.assists = assists


    def get_stats(self): 
        query = f'SELECT * FROM "NBA_2025-2026_Season"."{self.name}"'
        df = query_db(query)
        print(df.columns.tolist())  # prints all column names
        print(df.head())            # prints first row
        
        self.points = float(df['pts'][0])
        self.rebounds = float(df['reb'][0])
        self.assists = float(df['ast'][0])
        self.id = int(df['player_id'][0])



#Compares players stats
def comparePlayers(player1,player2):
    #Tracks how many stats each player won
    score1 = 0
    score2 = 0
    
    
    #Initializes both players stats
    player1.get_stats()
    
    player2.get_stats()


    #Stores who won which individual stat and their details
    comparisons = {
        "points": None,
        "rebounds": None,
        "assists": None,
        "winner": None,
        "player1_id":player1.id,
        "player2_id":player2.id,
        "player1_name":player1.name,
        "player2_name":player2.name,
        "player1_points":player1.points,
        "player2_points":player2.points,
        "player1_rebounds":player1.rebounds,
        "player2_rebounds":player2.rebounds,
        "player1_assists":player1.assists,
        "player2_assists":player2.assists,

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
        comparisons["winner"] = player1.name
    elif score1 < score2:
        comparisons["winner"] = player2.name
    else:
        comparisons["winner"] = "tie"

    return comparisons

#Flask testing

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)

