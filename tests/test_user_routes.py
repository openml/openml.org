from server.user.models import User
import pytest
from server.extensions import db
import os

@pytest.fixture(scope='module')
def test_user():
    user1 = User(email='abc@abc.com', username='abc')
    user1.set_password('abcabc')
    db.session.add(user1)
    db.session.commit()
    yield db


def test_login(test_client, init_database):
    response = test_client.post('/login', json={'email': 'ss', 'password':'ss'},
                                follow_redirects=True)
    assert response.status_code == 200


def test_profile(test_client, init_database):
    access_token = str(os.environ.get('TEST_ACCESS_TOKEN'))
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    response = test_client.get('/profile', headers=headers)
    print(response.json)
    user = User.query.filter_by(email=response.json['email']).first()
    assert response.status_code == 200
    assert User.query.filter_by(email='ss').first() == user


def test_logout(test_client, init_database):
    access_token = str(os.environ.get('TEST_ACCESS_TOKEN'))
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    response = test_client.get('/logout', headers=headers)
    assert response.status_code == 200


def test_forgot_token(test_client, init_database):
    user = User.query.filter_by(email='ss').first()
    url = '?token='+str(user.forgotten_password_code)
    response = test_client.post('/forgot-token', json={'url':url},
                                follow_redirects=True)
    assert response.status_code == 200

def test_reset_password(test_client, init_database):
    user = User.query.filter_by(email='ss').first()
    url = '?token=' + str(user.forgotten_password_code)
    response = test_client.post('/forgot-token', json={'url':url, 'password':'ss'},
                                follow_redirects=True)
    assert response.status_code == 200

#TODO Tests: Profile changes, confirm user, 