import pytest
import logging
from server.user.models import User
from autoapp import app


@pytest.fixture(scope='module')
def new_user():
    user = User(username='test_user', email='patkennedy79@gmail.com')
    return user


@pytest.fixture(scope='module')
def test_client():
    _app = app
    _app.logger.setLevel(logging.CRITICAL)
    ctx = _app.test_request_context()
    ctx.push()

    yield _app
