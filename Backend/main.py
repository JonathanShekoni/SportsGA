from flask import Flask, request, jsonify
from nba_api.stats.endpoints import commonplayerinfo
from nba_api.stats.endpoints import playerawards
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine,inspect,text
import pandas as pd
from dotenv import load_dotenv
import os

db = SQLAlchemy()  # Created without app first
load_dotenv()

engine = create_engine(
    f"{os.getenv('DATABASE_URL')}",
    pool_size=20,
    max_overflow=10,
    pool_timeout=60
)





player_info_cache = {}
player_awards_cache = {}


def create_app():
    
    app = Flask(__name__, instance_relative_config=True)

    inspector = inspect(engine)

    all_table_names = inspector.get_table_names(schema='NBA_2025-2026_Season')
    
    global formatted_all_table_names
    formatted_all_table_names = [
        name.replace('_', ' ')
        for name in all_table_names
    ]
    CORS(app)

    app.config["SQLALCHEMY_DATABASE_URI"] = f'{os.getenv('DATABASE_URL')}'
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
        
    @app.route('/players')

    def get_players():
        print("GET_PLAYERS ROUTE HIT")
        try:
            return jsonify(formatted_all_table_names)
        except Exception as e:
            return jsonify({"error": "Player names could not be fetched. Please try again."}), 404
    

    @app.route('/player')
    def get_player_stats():
        print("GET_PLAYER_STATS ROUTE HIT")
        try:
            player_name =  request.args.get("name").replace(" ", "_")
            print(f"Looking up: {player_name}")
            player = Player(player_name,0,0,0)
            
            player.get_stats()

            stats = {
                "points": player.points,
                "rebounds": player.rebounds,
                "assists": player.assists,
                "id":player.id,
                "fg_pct": player.fg_pct,
                "fg3_pct": player.fg3_pct,
                "ft_pct": player.ft_pct,
                "to": player.to,
                "stl": player.stl,
                "blk": player.blk,
                "awards": {'MVP': 0,                
                'Finals_MVP': 0,
                'All_NBA': 0,
                'All_Star': 0,
                'Defensive_Player_of_the_Year': 0,
                'Rookie_of_the_Year': 0,
                'CPOY':0,
                'WFMVP':0,
                'EFMVP':0,
                },
                
            }

            
            
            
            if player_name not in player_info_cache:
                info = commonplayerinfo.CommonPlayerInfo(player_id=player.id)
                df = info.get_data_frames()[0]
                row = df.iloc[0]
                player_info_cache[player_name] = {


                    'POSITION': row['POSITION'],
                    'TEAM_NAME': row['TEAM_NAME'],
                    'DRAFT_YEAR': str(row['DRAFT_YEAR']),
                    'HEIGHT': row['HEIGHT'],
                    'COUNTRY': row['COUNTRY'],
                    'SCHOOL': row['SCHOOL'],
                    'WEIGHT': str(row['WEIGHT']),
                    'BIRTHDATE': str(row['BIRTHDATE'])[:10]
                }
            

            if player_name not in player_awards_cache:
                awards = playerawards.PlayerAwards(player_id=player.id)
                df = awards.get_data_frames()[0]
                awards_list = df['DESCRIPTION'].tolist()
                player_awards_cache[player_name] = awards_list


            for award in player_awards_cache[player_name]:
                if award == "NBA Most Valuable Player":
                    stats['awards']['MVP'] += 1
                elif award == "NBA Finals Most Valuable Player":
                    stats['awards']['Finals_MVP'] += 1
                elif award == "All-NBA":
                    stats['awards']['All_NBA'] += 1
                elif award == "NBA All-Star":
                    stats['awards']['All_Star'] += 1
                elif award == "NBA Defensive Player of the Year":
                    stats['awards']['Defensive_Player_of_the_Year'] += 1
                elif award == "NBA Rookie of the Year":
                    stats['awards']['Rookie_of_the_Year'] += 1
                elif award == "NBA Clutch Player of the Year":
                    stats['awards']['CPOY'] += 1
                elif award == "Eastern Conference Finals Most Valuable Player":
                    stats['awards']['EFMVP'] += 1
                elif award == "Western Conference Finals Most Valuable Player":
                    stats['awards']['WFMVP'] += 1

            info_data = player_info_cache[player_name]
            
            stats['position'] = info_data['POSITION']
            stats['team'] = info_data['TEAM_NAME']
            stats['draft_year'] = info_data['DRAFT_YEAR']
            stats['height'] = info_data['HEIGHT']
            stats['country'] = info_data['COUNTRY']
            stats['school'] = info_data['SCHOOL']   
            stats['weight'] = info_data['WEIGHT']
            stats['birth_date'] = info_data['BIRTHDATE'][:10] # Extract just the date part

            
            return jsonify(stats)

        except Exception as e:
            print(f"PLAYER ROUTE ERROR: {e}")
            return jsonify({"error": "Player not found. Please try again."}), 404
    return app

#Connect to the DB



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
        self.fg_pct = float(df['fg_pct'][0])
        self.fg3_pct = float(df['fg3_pct'][0])
        self.ft_pct = float(df['ft_pct'][0])
        self.to = float(df['turnover'][0])
        self.stl = float(df['stl'][0])
        self.blk = float(df['blk'][0])




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
        "fg_pct": None,
        "fg3_pct": None,
        "ft_pct": None,
        "to": None,
        "stl": None,
        "blk": None,
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
        "player1_fg_pct":player1.fg_pct,
        "player2_fg_pct":player2.fg_pct,
        "player1_fg3_pct":player1.fg3_pct,
        "player2_fg3_pct":player2.fg3_pct,
        "player1_ft_pct":player1.ft_pct,
        "player2_ft_pct":player2.ft_pct,
        "player1_to":player1.to,
        "player2_to":player2.to,
        "player1_stl":player1.stl,
        "player2_stl":player2.stl,
        "player1_blk":player1.blk,
        "player2_blk":player2.blk,
        "league_avg_points": 9.16,
        "league_avg_rebounds": 3.58,
        "league_avg_assists": 2.14,
        "league_avg_fg_pct": 0.46,
        "league_avg_fg3_pct": 0.31,
        "league_avg_ft_pct": 0.74,
        "league_avg_to": 1.1,
        "league_avg_stl": 0.7,
        "league_avg_blk": 0.40
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

    if (player1.fg_pct > player2.fg_pct):
        score1 += 1
        comparisons["fg_pct"] = player1.name
    elif (player1.fg_pct == player2.fg_pct):
        score1 += 1
        score2 += 1
        comparisons["fg_pct"] = "tie"
    else:
        score2 += 1
        comparisons["fg_pct"] = player2.name

    if (player1.fg3_pct > player2.fg3_pct):
        score1 += 1
        comparisons["fg3_pct"] = player1.name
    elif (player1.fg3_pct == player2.fg3_pct):
        score1 += 1
        score2 += 1
        comparisons["fg3_pct"] = "tie"
    else:
        score2 += 1
        comparisons["fg3_pct"] = player2.name

    if (player1.ft_pct > player2.ft_pct):
        score1 += 1
        comparisons["ft_pct"] = player1.name
    elif (player1.ft_pct == player2.ft_pct):
        score1 += 1
        score2 += 1
        comparisons["ft_pct"] = "tie"
    else:
        score2 += 1
        comparisons["ft_pct"] = player2.name

    if (player1.to > player2.to):
        score2 += 1
        comparisons["to"] = player2.name
    elif (player1.to == player2.to):
        score1 += 1
        score2 += 1
        comparisons["to"] = "tie"
    else:
        score1 += 1
        comparisons["to"] = player1.name

    if (player1.stl > player2.stl):
        score1 += 1
        comparisons["stl"] = player1.name
    elif (player1.stl == player2.stl):
        score1 += 1
        score2 += 1
        comparisons["stl"] = "tie"
    else:
        score2 += 1
        comparisons["stl"] = player2.name

    if (player1.blk > player2.blk):
        score1 += 1
        comparisons["blk"] = player1.name
    elif (player1.blk == player2.blk):
        score1 += 1
        score2 += 1
        comparisons["blk"] = "tie"
    else:
        score2 += 1
        comparisons["blk"] = player2.name


    if score1 > score2 :    
        comparisons["winner"] = player1.name
    elif score1 < score2:
        comparisons["winner"] = player2.name
    else:
        comparisons["winner"] = "Tie"

    return comparisons

#Flask testing

if __name__ == "__main__":
    app = create_app()

    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0',port=port, debug=True)

