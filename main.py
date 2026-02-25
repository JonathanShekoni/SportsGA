from flask import Flask, redirect, url_for
from nba_api.stats.endpoints import playercareerstats
app = Flask(__name__) # Flask constructor

#Nba api testing
career = playercareerstats.PlayerCareerStats(player_id='203999')

#pandas data frames
career.season_totals_regular_season.get_data_frame()

#json
career.get_json

#dictionary
career.get_dict


print(career.get_dict)

#Flask testing
#Decorator used to tell the application which URL is associated with the function
@app.route('/')

def home():
    return f"Sports Analytics API Running: {career.get_json}"


if __name__ == "__main__":
    app.run(debug=True)