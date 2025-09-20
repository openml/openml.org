import os

import pytest

from server.user.models import User


@pytest.fixture(scope="function", autouse=True)
def setup(session, valid_user, unconfirmed_user):
    session.add(valid_user)
    session.add(unconfirmed_user)
    session.commit()
    yield

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
        session_hash="0000",
        forgotten_password_code="1234",
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
        session_hash="0000",
        activation_code="0000",
        forgotten_password_code="5678",
        active=0
    )
    user.set_password("ff")
    
    return user


def login(test_client, email, password):
    response = test_client.post(
        "/login", json={"email": email, "password": password}, follow_redirects=True
    )
    return response


def test_signup(test_client, session):
    registration_data = {
        "email": "new@user.com",
        "password": "newpassword",
        "first_name": "Ana",
        "last_name": "Brown"
    }

    user_before_signup = session.query(User).filter_by(email=registration_data["email"]).first()

    response = test_client.post(
        "/signup",
        json={
            "email": registration_data["email"],
            "password": registration_data["password"],
            "first_name": registration_data["first_name"],
            "last_name": registration_data["last_name"]
        }
    )

    registered_user = session.query(User).filter_by(email=registration_data["email"]).first()

    assert user_before_signup == None
    assert registered_user.check_password(registration_data["password"])
    assert registered_user.first_name == registration_data["first_name"]
    assert registered_user.last_name == registration_data["last_name"]
    assert response.status_code == 200

    session.delete(registered_user)
    session.commit()


def test_confirm_user(test_client, unconfirmed_user):
    url = "?token=" + str(unconfirmed_user.activation_code)
    response = test_client.post(
        "/confirmation", json={"url": url, "password": "ff"}, follow_redirects=True
    )

    assert response.status_code == 200


def test_login(test_client, valid_user):
    response = login(test_client, valid_user.email, "abcabc")

    assert response.json["access_token"]
    assert response.status_code == 200


def test_login_wrong_password(test_client, valid_user):
    response = login(test_client, valid_user.email, "wrongpassword")

    assert response.json["msg"] == "WrongPassword"
    assert response.status_code == 200


def test_login_user_not_existent(test_client):
    response = login(test_client, "fake@user.com", "wrongpassword")

    assert response.json["msg"] == "WrongUsernameOrPassword"
    assert response.status_code == 200


def test_login_user_not_confirmed(test_client, unconfirmed_user):
    response = login(test_client, unconfirmed_user.email, "ff")

    assert response.json["msg"] == "UserNotConfirmed"
    assert response.status_code == 200


def test_get_profile(test_client, valid_user):
    login(test_client, valid_user.email, "abcabc")

    access_token = str(os.environ.get("TEST_ACCESS_TOKEN"))
    headers = {"Authorization": "Bearer {}".format(access_token)}
    response = test_client.get("/profile", headers=headers)
    
    retrieved_profile = response.json

    profile = {
        "username": valid_user.username,
        "bio": valid_user.bio,
        "first_name": valid_user.first_name,
        "last_name": valid_user.last_name,
        "email": valid_user.email,
        "image": valid_user.image,
        "id": valid_user.id
    }

    assert response.status_code == 200
    assert retrieved_profile == profile


def test_profile_changes(test_client, session, valid_user):
    login(test_client, valid_user.email, "abcabc")

    access_token = str(os.environ.get("TEST_ACCESS_TOKEN"))
    headers = {"Authorization": "Bearer {}".format(access_token)}

    changes = {
        "bio": "newbio",
        "first_name": "newfirstname",
        "last_name": "newlastname",
        "image": "newimage",
        "email": valid_user.email,
    }

    response = test_client.post("/profile", headers=headers, json=changes)
    session.refresh(valid_user)

    assert valid_user.bio == changes["bio"]
    assert valid_user.first_name == changes["first_name"]
    assert valid_user.last_name == changes["last_name"]
    # note/todo: currently not testing image. image update functionality
    # not implemented yet in views.py::profile
    assert valid_user.email == changes["email"]
    assert response.json["msg"] == "User information changed"
    assert response.status_code == 200


def test_api_key_get(test_client, valid_user):
    login(test_client, valid_user.email, "abcabc")

    access_token = str(os.environ.get("TEST_ACCESS_TOKEN"))
    headers = {"Authorization": "Bearer {}".format(access_token)}
    response = test_client.get("/api-key", headers=headers)

    assert response.json["apikey"] == valid_user.session_hash
    assert response.status_code == 200


def test_api_key_post(test_client, session, valid_user):
    login(test_client, valid_user.email, "abcabc")

    old_session_hash = valid_user.session_hash

    access_token = str(os.environ.get("TEST_ACCESS_TOKEN"))
    headers = {"Authorization": "Bearer {}".format(access_token)}
    response = test_client.post("/api-key", headers=headers)

    session.refresh(valid_user)

    # confirm session hash has been updated
    assert valid_user.session_hash != old_session_hash
    assert response.json["apikey"] == valid_user.session_hash
    assert response.json["msg"] == "API Key updated"
    assert response.status_code == 200


def test_logout(test_client, valid_user):
    login(test_client, valid_user.email, "abcabc")

    access_token = str(os.environ.get("TEST_ACCESS_TOKEN"))
    headers = {"Authorization": "Bearer {}".format(access_token)}
    response = test_client.get("/logout", headers=headers)

    assert response.status_code == 200


def test_forgot_token(test_client, valid_user):
    login(test_client, valid_user.email, "abcabc")

    url = "?token=" + str(valid_user.forgotten_password_code)
    response = test_client.post(
        "/forgot-token", json={"url": url}, follow_redirects=True
    )

    assert response.json["msg"] == "Token confirmed"
    assert response.status_code == 200


def test_forgot_token_invalid_token(test_client, valid_user):
    login(test_client, valid_user.email, "abcabc")

    url = "?token=faketoken"
    response = test_client.post(
        "/forgot-token", json={"url": url}, follow_redirects=True
    )

    assert response.json["msg"] == "Error"
    assert response.status_code == 401


def test_reset_password(test_client, session, valid_user):
    login(test_client, valid_user.email, "abcabc")

    new_password = "newpassword"

    url = "?token=" + str(valid_user.forgotten_password_code)
    response = test_client.post(
        "/resetpassword", json={"url": url, "password": new_password}, follow_redirects=True
    )

    session.refresh(valid_user)

    assert valid_user.check_password(new_password)
    assert response.json["msg"] == "Password changed"
    assert response.status_code == 200
