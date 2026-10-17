from player_identity import nba_player_id


def test_names_resolve_to_nba_ids_without_using_old_provider_ids():
    assert nba_player_id('LeBron_James') == 2544
    assert nba_player_id('Stephen_Curry') == 201939
    assert nba_player_id('Shai_Gilgeous-Alexander') == 1628983
    assert nba_player_id('Nikola_Jokic') == 203999
    assert nba_player_id('Unknown_Player') is None
