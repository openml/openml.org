import os

import pytest
from server.extensions import Session

from server.user.models import User


@pytest.fixture
def db_session(test_client, valid_user, unconfirmed_user):
    # setup
    session = Session()
    session.add(valid_user)
    session.add(unconfirmed_user)
    session.commit()
    
    try:
        # test
        yield session
    finally:
        # cleanup
        session.delete(valid_user)
        session.delete(unconfirmed_user)
        session.commit()


@pytest.fixture(scope="function")
def valid_user():
    user = User(
        email="abc@abc.com",
        username="abc",
        ip_address="1.2.3.4",
        created_on="0000",
        company="0000",
        country="0000",
        bio="No Bio",
        active=1
    )
    user.set_password("abcabc")
    
    return user


@pytest.fixture(scope="function")
def unconfirmed_user():
    user = User(
        email="ff@ff.com",
        username="ff",
        ip_address="1.2.3.4",
        created_on="0000",
        company="0000",
        country="0000",
        bio="No Bio",
        active=0
    )
    user.set_password("ff")
    
    return user


def login(test_client, email, password):
    response = test_client.post(
        "/login", json={"email": email, "password": password}, follow_redirects=True
    )
    return response


def test_confirm_user(test_client, init_database, unconfirmed_user):
    url = "?token=" + str(unconfirmed_user.activation_code)
    response = test_client.post(
        "/confirmation", json={"url": url, "password": "ff"}, follow_redirects=True
    )
    assert response.status_code == 200


def test_login(test_client, init_database, db_session, valid_user):
    response = login(test_client, valid_user.email, "abcabc")

    user = db_session.query(User).filter_by(email=valid_user.email).first()

    assert response.json["access_token"]
    assert response.status_code == 200


def test_login_wrong_password(test_client, init_database, db_session, valid_user):
    response = login(test_client, valid_user.email, "wrongpassword")

    user = db_session.query(User).filter_by(email=valid_user.email).first()

    assert response.json["msg"] == "WrongPassword"
    assert response.status_code == 200


def test_login_user_not_existent(test_client, init_database, db_session, valid_user):
    response = login(test_client, "fake@user.com", "wrongpassword")

    user = db_session.query(User).filter_by(email=valid_user.email).first()

    assert response.json["msg"] == "WrongUsernameOrPassword"
    assert response.status_code == 200


def test_login_user_not_confirmed(test_client, init_database, db_session, unconfirmed_user):
    response = login(test_client, unconfirmed_user.email, "ff")

    user = db_session.query(User).filter_by(email=unconfirmed_user.email).first()

    assert response.json["msg"] == "UserNotConfirmed"
    assert response.status_code == 200


def test_profile(test_client, init_database, valid_user):
    login(test_client, valid_user.email, "abcabc")

    access_token = str(os.environ.get("TEST_ACCESS_TOKEN"))
    headers = {"Authorization": "Bearer {}".format(access_token)}
    response = test_client.get("/profile", headers=headers)
    with Session() as session:
        user = session.query(User).filter_by(email=response.json["email"]).first()
        assert response.status_code == 200
        assert session.query(User).filter_by(email="ff@ff.com").first() == user


def test_profile_changes(test_client, init_database, valid_user):
    login(test_client, valid_user.email, "abcabc")

    access_token = str(os.environ.get("TEST_ACCESS_TOKEN"))
    headers = {"Authorization": "Bearer {}".format(access_token)}
    response = test_client.post(
        "/profile",
        headers=headers,
        json={
            "bio": "ss bio",
            "first_name": "ssd",
            "last_name": "sds",
            "image": "",
            "email": valid_user.email,
        },
    )

    assert response.status_code == 200


def test_api_key_get(test_client, init_database, valid_user):
    login(test_client, valid_user.email, "abcabc")

    access_token = str(os.environ.get("TEST_ACCESS_TOKEN"))
    headers = {"Authorization": "Bearer {}".format(access_token)}
    response = test_client.get("/api-key", headers=headers)

    assert response.status_code == 200


def test_api_key_post(test_client, init_database, valid_user):
    login(test_client, valid_user.email, "abcabc")

    access_token = str(os.environ.get("TEST_ACCESS_TOKEN"))
    headers = {"Authorization": "Bearer {}".format(access_token)}
    response = test_client.post("/api-key", headers=headers)

    assert response.status_code == 200


def test_logout(test_client, init_database, valid_user):
    login(test_client, valid_user.email, "abcabc")

    access_token = str(os.environ.get("TEST_ACCESS_TOKEN"))
    headers = {"Authorization": "Bearer {}".format(access_token)}
    response = test_client.get("/logout", headers=headers)

    assert response.status_code == 200


def test_forgot_token(test_client, init_database, valid_user):
    login(test_client, valid_user.email, "abcabc")

    url = "?token=" + str(valid_user.forgotten_password_code)
    response = test_client.post(
        "/forgot-token", json={"url": url}, follow_redirects=True
    )

    assert response.status_code == 200


def test_reset_password(test_client, init_databas, valid_user):
    login(test_client, valid_user.email, "abcabc")

    url = "?token=" + str(valid_user.forgotten_password_code)
    response = test_client.post(
        "/forgot-token", json={"url": url, "password": "abcabc"}, follow_redirects=True
    )

    assert response.status_code == 200
