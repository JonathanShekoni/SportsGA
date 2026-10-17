from unittest.mock import MagicMock

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
    mock_info = MagicMock()
    mock_info.get_data_frames.return_value = [info_df]
    monkeypatch.setattr(main.commonplayerinfo, "CommonPlayerInfo", lambda player_id, timeout: mock_info)

    awards_df = pd.DataFrame({"DESCRIPTION": ["NBA Most Valuable Player", "NBA All-Star"]})
    mock_awards = MagicMock()
    mock_awards.get_data_frames.return_value = [awards_df]
    monkeypatch.setattr(main.playerawards, "PlayerAwards", lambda player_id, timeout: mock_awards)

    response = client.get("/player", query_string={"name": "LeBron James"})

    assert response.status_code == 200
    data = response.get_json()
    assert data["points"] == FAKE_STATS["LeBron_James"]["points"]
    assert data["awards"]["MVP"] == 1
    assert data["awards"]["All_Star"] == 1
    assert data["team"] == "Los Angeles Lakers"
    assert data["position"] == "Forward"


def test_profile_keeps_database_stats_when_nba_times_out(client, monkeypatch):
    from requests.exceptions import ReadTimeout

    monkeypatch.setattr(main, "Player", FakePlayer)
    def unavailable(*args, **kwargs):
        assert kwargs['timeout'] == 5
        raise ReadTimeout('NBA unavailable')
    monkeypatch.setattr(main.commonplayerinfo, 'CommonPlayerInfo', unavailable)
    monkeypatch.setattr(main.playerawards, 'PlayerAwards', unavailable)

    response = client.get('/player', query_string={'name': 'LeBron James'})
    assert response.status_code == 200
    data = response.get_json()
    assert data['points'] == 25.5
    assert data['id'] == 2544
    assert data['availability'] == {'biography': False, 'awards': False}
    assert data['team'] is None
    assert data['birth_date'] is None
    assert data['awards']['MVP'] is None
    assert not main.player_info_cache
    assert not main.player_awards_cache


def test_career_timeout_can_recover_on_next_request(client, monkeypatch):
    from requests.exceptions import ReadTimeout

    monkeypatch.setattr(main, 'Player', FakePlayer)
    endpoint = MagicMock(side_effect=ReadTimeout('NBA unavailable'))
    monkeypatch.setattr(main.playercareerstats, 'PlayerCareerStats', endpoint)
    response = client.get('/player/career', query_string={'name': 'LeBron James'})
    assert response.status_code == 200
    assert response.get_json() == []
    assert not main.player_career_cache
    assert endpoint.call_args.kwargs['timeout'] == 5

    endpoint.side_effect = None
    endpoint.return_value.season_totals_regular_season.get_data_frame.return_value = pd.DataFrame([
        dict(SEASON_ID='2025-26', PTS=20.9, REB=6.1, AST=7.2, FG_PCT=0.515)
    ])
    response = client.get('/player/career', query_string={'name': 'LeBron James'})
    assert response.status_code == 200
    assert response.get_json()[0]['PTS'] == 20.9


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
