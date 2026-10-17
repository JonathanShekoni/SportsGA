from unittest.mock import MagicMock
import profile_store


def test_career_snapshot_takes_precedence_over_old_seed_table(monkeypatch):
    expected = [{'SEASON_ID': '2025-26', 'PTS': 31.1}]
    monkeypatch.setattr(profile_store, 'saved_component', lambda *args: expected)
    engine = MagicMock()
    assert profile_store.saved_career(engine, 1628983) == expected
    engine.connect.assert_not_called()


def test_career_uses_existing_seed_history_with_bound_player_id(monkeypatch):
    monkeypatch.setattr(profile_store, 'saved_component', lambda *args: None)
    engine = MagicMock()
    conn = engine.connect.return_value.__enter__.return_value
    conn.execute.return_value.scalar.return_value = 'ml_data.player_seasons'
    expected = [{'SEASON_ID': '2025-26', 'PTS': 26.5}]
    conn.execute.return_value.mappings.return_value.all.return_value = expected
    assert profile_store.saved_career(engine, 201939) == expected
    assert conn.execute.call_args.args[1] == {'id': 201939}


def test_empty_award_snapshot_is_valid_not_missing():
    engine = MagicMock()
    conn = engine.connect.return_value.__enter__.return_value
    conn.execute.return_value.scalar.side_effect = ['sportsga_cache.player_details', []]
    assert profile_store.saved_component(engine, 2544, 'awards') == []
