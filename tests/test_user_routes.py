import os

import pytest
from server.extensions import Session

from server.user.models import User


@pytest.fixture(scope="module")
def test_user():
    user1 = User(email="abc@abc.com", username="abc")
    user1.set_password("abcabc")
    with Session() as session:
        session.add(user1)
        session.commit()
        yield


def test_confirm_user(test_client, init_database):
    with Session() as session:
        user = session.query(User).filter_by(email="ff@ff.com").first()
    url = "?token=" + str(user.activation_code)
    response = test_client.post(
        "/confirmation", json={"url": url, "password": "ff"}, follow_redirects=True
    )
    assert response.status_code == 200


def test_login(test_client, init_database):
    response = test_client.post(
        "/login", json={"email": "ff@ff.com", "password": "ff"}, follow_redirects=True
    )
    assert response.status_code == 200


def test_profile(test_client, init_database):
    access_token = str(os.environ.get("TEST_ACCESS_TOKEN"))
    headers = {"Authorization": "Bearer {}".format(access_token)}
    response = test_client.get("/profile", headers=headers)
    with Session() as session:
        user = session.query(User).filter_by(email=response.json["email"]).first()
        assert response.status_code == 200
        assert session.query(User).filter_by(email="ff@ff.com").first() == user


def test_profile_changes(test_client, init_database):
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
            "email": "ff@ff.com",
        },
    )
    assert response.status_code == 200


def test_api_key_get(test_client, init_database):
    access_token = str(os.environ.get("TEST_ACCESS_TOKEN"))
    headers = {"Authorization": "Bearer {}".format(access_token)}
    response = test_client.get("/api-key", headers=headers)
    assert response.status_code == 200


def test_api_key_post(test_client, init_database):
    access_token = str(os.environ.get("TEST_ACCESS_TOKEN"))
    headers = {"Authorization": "Bearer {}".format(access_token)}
    response = test_client.post("/api-key", headers=headers)
    assert response.status_code == 200


def test_logout(test_client, init_database):
    access_token = str(os.environ.get("TEST_ACCESS_TOKEN"))
    headers = {"Authorization": "Bearer {}".format(access_token)}
    response = test_client.get("/logout", headers=headers)
    assert response.status_code == 200


def test_forgot_token(test_client, init_database):
    with Session() as session:
        user = session.query(User).filter_by(email="ff@ff.com").first()
    url = "?token=" + str(user.forgotten_password_code)
    response = test_client.post(
        "/forgot-token", json={"url": url}, follow_redirects=True
    )
    assert response.status_code == 200


def test_reset_password(test_client, init_database):
    with Session() as session:
        user = session.query(User).filter_by(email="ff@ff.com").first()
    url = "?token=" + str(user.forgotten_password_code)
    response = test_client.post(
        "/forgot-token", json={"url": url, "password": "ff"}, follow_redirects=True
    )
    assert response.status_code == 200
