import os
import sys

import pytest

from autoapp import create_app
from server.extensions import db

myPath = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, myPath + '/../')


@pytest.fixture(scope='module')
def test_client():
    flask_app = create_app()

    # Flask provides a way to test your application by exposing the Werkzeug test Client
    # and handling the context locals for you.
    testing_client = flask_app.test_client()
    flask_app.secret_key = 'abvs'

    # Establish an application context before running the tests.
    ctx = flask_app.app_context()
    ctx.push()

    yield testing_client  # this is where the testing happens!

    ctx.pop()


@pytest.fixture(scope='module')
def init_database():
    # Create the database and the database table

    # Insert user data

    yield db  # this is where the testing happens!
