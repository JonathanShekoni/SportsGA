from unittest.mock import MagicMock, patch

import pytest

import main

# Table names create_app() would normally read from the live DB schema.
FAKE_TABLE_NAMES = ["LeBron_James", "Stephen_Curry"]


@pytest.fixture
def app():
    """Flask app built with the DB inspection step mocked out."""
    with patch("main.inspect") as mock_inspect:
        mock_inspector = MagicMock()
        mock_inspector.get_table_names.return_value = FAKE_TABLE_NAMES
        mock_inspect.return_value = mock_inspector

        flask_app = main.create_app()
        flask_app.config.update(TESTING=True)
        yield flask_app


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture(autouse=True)
def clear_caches():
    """main.py caches results in module-level dicts; keep tests isolated."""
    main.player_info_cache.clear()
    main.player_awards_cache.clear()
    main.player_career_cache.clear()
    yield
