"""Resolve table names to NBA IDs without making a network request."""
import re
import unicodedata
import json
from pathlib import Path
from nba_api.stats.static.players import get_players

ID_FILE = Path(__file__).with_name('player_ids.json')
SAVED_IDS = json.loads(ID_FILE.read_text(encoding='utf-8'))['players'] if ID_FILE.exists() else {}


def normalized(name):
    ascii_name = unicodedata.normalize('NFKD', name.replace('_', ' ')).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]', '', ascii_name.lower())


def base_name(name):
    return re.sub(r'(?:jr|sr|iii|ii|iv)$', '', normalized(name))


def nba_player_id(name):
    if normalized(name) in SAVED_IDS:
        return SAVED_IDS[normalized(name)]
    if normalized(name) == 'jeenathanwilliams':
        # NBA lists him as Nate Williams; another historical player shares that name.
        return 1631466
    aliases = {
        'Carlton_Carrington': 'Bub Carrington',
        'Nicolas_Claxton': 'Nic Claxton',
        'Alexandre_Sarr': 'Alex Sarr',
        'Airious_Bailey': 'Ace Bailey',
        'Hansen_Yang': 'Yang Hansen',
        "Nah'Shon_Hyland": 'Bones Hyland',
        'Jeenathan_Williams': 'Nate Williams',
        'David_Jones': 'David Jones Garcia',
    }
    name = aliases.get(name, name)
    players = get_players()
    exact = [p for p in players if normalized(p['full_name']) == normalized(name)]
    if len(exact) == 1:
        return exact[0]['id']
    candidates = [p for p in players if base_name(p['full_name']) == base_name(name)]
    active = [p for p in candidates if p['is_active']]
    if len(active) == 1:
        return active[0]['id']
    if len(candidates) == 1:
        return candidates[0]['id']
    return None
