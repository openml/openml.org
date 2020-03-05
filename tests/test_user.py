from server.user.models import User
import pytest
from server.extensions import db
from flask import jsonify

@pytest.fixture(scope='module')
def test_user():
    user1 = User(email='abc@abc.com', username='abc')
    user1.set_password('abcabc')
    db.session.add(user1)
    db.session.commit()
    yield db


def test_login(test_client, init_database):
    json_response = jsonify({'email': 'ss', 'password':'ss'})
    response = test_client.post('/login', json={'email': 'ss', 'password':'ss'}, follow_redirects=True)
    assert response.status_code == 200
