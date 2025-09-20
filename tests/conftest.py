import os
import sys

import pytest

from autoapp import app
from server.extensions import Session, engine, Base

myPath = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, myPath + "/../")


@pytest.fixture(scope="module")
def test_client():
    flask_app = app

    # Flask provides a way to test your application by exposing the Werkzeug test Client
    # and handling the context locals for you.
    testing_client = flask_app.test_client()
    flask_app.secret_key = "abvs"

    # Establish an application context before running the tests.
    ctx = flask_app.app_context()
    ctx.push()

    yield testing_client  # this is where the testing happens!

    ctx.pop()


@pytest.fixture(scope="session")
def session():
    session = Session()
    yield session


# DB reset between tests currently needed with existing
# implementation
@pytest.fixture(scope="function", autouse=True)
def reset_db():
    # Start w/ clean db. Drop and recreate the tables.
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    yield # run tests
