import os
import sys

import pytest

from autoapp import app
from server.extensions import Session, engine, Base
from server.user.models import User

myPath = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, myPath + "/../")


# Currently disable email in testing
@pytest.fixture(scope="module", autouse=True)
def disable_email_send():
    os.environ['SEND_EMAIL'] = "False"
    yield


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


# Note:
# DB reset between tests currently needed with existing
# implementation (standard transactions weren't possible)
@pytest.fixture(scope="function", autouse=True)
def session(test_user):
    # Start w/ clean db. Drop and recreate the tables.
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    session = Session()

    # Add initial data
    session.add(test_user)
    session.commit()

    yield session # run tests


@pytest.fixture(scope="function")
def test_user():
    user = User(email="test@test.com", username="testuser",
                ip_address="1.2.3.4", created_on="0000",
                company="0000", country="0000",
                bio="No Bio", session_hash="0000",
                forgotten_password_code="test_user_token",
                active=1)
    user.set_password("testpassword")

    return user
