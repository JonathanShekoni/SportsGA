import pandas as pd

import main
from conftest import FAKE_TABLE_NAMES

FAKE_STATS = {
    "LeBron_James": dict(
        points=25.5, rebounds=7.5, assists=8.0, id=2544,
        fg_pct=0.52, fg3_pct=0.38, ft_pct=0.73, to=3.5, stl=1.2, blk=0.6,
    ),
    "Stephen_Curry": dict(
        points=27.0, rebounds=4.5, assists=6.0, id=201939,
        fg_pct=0.49, fg3_pct=0.42, ft_pct=0.91, to=2.8, stl=1.0, blk=0.2,
    ),
}


class FakePlayer:
    """Stand-in for main.Player that skips the real DB query."""

    def __init__(self, name):
        if name not in FAKE_STATS:
            raise ValueError(f"Unknown test player: {name}")
        self.name = name
        self.points = 0
        self.rebounds = 0
        self.assists = 0

    def get_stats(self):
        for key, value in FAKE_STATS[self.name].items():
            setattr(self, key, value)

    def get_id(self):
        self.id = FAKE_STATS[self.name]["id"]


# ---------- /players ----------

def test_get_players_returns_formatted_table_names(client):
    response = client.get("/players")

    assert response.status_code == 200
    assert response.get_json() == [name.replace("_", " ") for name in FAKE_TABLE_NAMES]


# ---------- /player ----------

def test_get_player_stats_success(client, monkeypatch):
    monkeypatch.setattr(main, "Player", FakePlayer)

    info_df = pd.DataFrame([{
        "POSITION": "Forward",
        "TEAM_NAME": "Los Angeles Lakers",
        "DRAFT_YEAR": "2003",
        "HEIGHT": "6-9",
        "COUNTRY": "USA",
        "SCHOOL": "St. Vincent-St. Mary HS (OH)",
        "WEIGHT": "250",
        "BIRTHDATE": "1984-12-30T00:00:00",
    }])
    awards_df = pd.DataFrame({"DESCRIPTION": ["NBA Most Valuable Player", "NBA All-Star"]})
    monkeypatch.setattr(main, 'saved_component', lambda engine, player_id, component:
        info_df.iloc[0].to_dict() if component == 'biography' else awards_df['DESCRIPTION'].tolist())

    response = client.get("/player", query_string={"name": "LeBron James"})

    assert response.status_code == 200
    data = response.get_json()
    assert data["points"] == FAKE_STATS["LeBron_James"]["points"]
    assert data["awards"]["MVP"] == 1
    assert data["awards"]["All_Star"] == 1
    assert data["team"] == "Los Angeles Lakers"
    assert data["position"] == "Forward"


def test_profile_keeps_database_stats_without_saved_details(client, monkeypatch):
    monkeypatch.setattr(main, 'Player', FakePlayer)
    response = client.get('/player', query_string={'name': 'LeBron James'})
    assert response.status_code == 200
    data = response.get_json()
    assert data['points'] == 25.5
    assert data['availability'] == {'biography': False, 'awards': False}
    assert data['awards']['MVP'] is None


def test_saved_career_is_returned_without_nba_request(client, monkeypatch):
    monkeypatch.setattr(main, 'Player', FakePlayer)
    expected = [dict(SEASON_ID='2025-26', PTS=20.9, REB=6.1, AST=7.2, FG_PCT=0.515)]
    monkeypatch.setattr(main, 'saved_career', lambda engine, player_id: expected)
    assert client.get('/player/career?name=LeBron%20James').get_json() == expected


def test_missing_career_can_recover_after_refresh(client, monkeypatch):
    monkeypatch.setattr(main, 'Player', FakePlayer)
    assert client.get('/player/career?name=LeBron%20James').get_json() == []
    expected = [dict(SEASON_ID='2025-26', PTS=20.9, REB=6.1, AST=7.2, FG_PCT=0.515)]
    monkeypatch.setattr(main, 'saved_career', lambda engine, player_id: expected)
    assert client.get('/player/career?name=LeBron%20James').get_json() == expected


def test_get_player_stats_not_found(client, monkeypatch):
    monkeypatch.setattr(main, "Player", FakePlayer)

    response = client.get("/player", query_string={"name": "Unknown Player"})

    assert response.status_code == 404
    assert response.get_json() == {"error": "Player not found. Please try again."}


def test_get_player_stats_missing_name_param(client, monkeypatch):
    monkeypatch.setattr(main, "Player", FakePlayer)

    response = client.get("/player")

    assert response.status_code == 404


# ---------- /compare ----------

def test_compare_returns_winner(client, monkeypatch):
    monkeypatch.setattr(main, "Player", FakePlayer)

    response = client.get("/compare", query_string={
        "player1": "LeBron James",
        "player2": "Stephen Curry",
    })

    assert response.status_code == 200
    data = response.get_json()
    assert data["player1_name"] == "LeBron_James"
    assert data["player2_name"] == "Stephen_Curry"
    assert data["points"] == "Stephen_Curry"
    assert data["winner"] in {"LeBron_James", "Stephen_Curry", "Tie"}


def test_compare_unknown_player_returns_404(client, monkeypatch):
    monkeypatch.setattr(main, "Player", FakePlayer)

    response = client.get("/compare", query_string={
        "player1": "LeBron James",
        "player2": "Nobody",
    })

    assert response.status_code == 404
    assert response.get_json() == {"error": "Player not found. Please try again."}


def test_compare_missing_query_param_returns_404(client, monkeypatch):
    monkeypatch.setattr(main, "Player", FakePlayer)

    response = client.get("/compare", query_string={"player1": "LeBron James"})

    assert response.status_code == 404
