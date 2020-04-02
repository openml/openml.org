import os

import pytest

from server.extensions import db
from server.user.models import User


@pytest.fixture(scope='module')
def test_user():
    user1 = User(email='abc@abc.com', username='abc')
    user1.set_password('abcabc')
    db.session.add(user1)
    db.session.commit()
    yield db


def test_confirm_user(test_client, init_database):
    user = User.query.filter_by(email='ff@ff.com').first()
    url = '?token=' + str(user.activation_code)
    response = test_client.post('/confirmation', json={'url': url, 'password': 'ff'},
                                follow_redirects=True)
    assert response.status_code == 200


def test_login(test_client, init_database):
    response = test_client.post('/login', json={'email': 'ff@ff.com', 'password': 'ff'},
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
    assert User.query.filter_by(email='ff@ff.com').first() == user


def test_profile_changes(test_client, init_database):
    access_token = str(os.environ.get('TEST_ACCESS_TOKEN'))
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    response = test_client.post('/profile', headers=headers, json={'bio': 'ss bio',
                                                                   'first_name': 'ssd',
                                                                   'last_name': 'sds',
                                                                   'image': '',
                                                                   'email': 'ff@ff.com'}
                                )
    assert response.status_code == 200


def test_api_key_get(test_client, init_database):
    access_token = str(os.environ.get('TEST_ACCESS_TOKEN'))
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    response = test_client.get('/api-key', headers=headers)
    assert response.status_code == 200


def test_api_key_post(test_client, init_database):
    access_token = str(os.environ.get('TEST_ACCESS_TOKEN'))
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    response = test_client.post('/api-key', headers=headers)
    assert response.status_code == 200


def test_logout(test_client, init_database):
    access_token = str(os.environ.get('TEST_ACCESS_TOKEN'))
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    response = test_client.get('/logout', headers=headers)
    assert response.status_code == 200


def test_forgot_token(test_client, init_database):
    user = User.query.filter_by(email='ff@ff.com').first()
    url = '?token=' + str(user.forgotten_password_code)
    response = test_client.post('/forgot-token', json={'url': url},
                                follow_redirects=True)
    assert response.status_code == 200


def test_reset_password(test_client, init_database):
    user = User.query.filter_by(email='ff@ff.com').first()
    url = '?token=' + str(user.forgotten_password_code)
    response = test_client.post('/forgot-token', json={'url': url, 'password': 'ff'},
                                follow_redirects=True)
    assert response.status_code == 200
