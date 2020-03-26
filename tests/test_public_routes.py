import names

uname = 'test_user' + names.get_first_name()


def test_signup(test_client, init_database):
    response = test_client.post('/signup', json={'email': uname,
                                                 'password': 'abab',
                                                 'name': 'asas'},
                                follow_redirects=True)
    assert response.status_code == 200


def test_forgot_password(test_client, init_database):
    response = test_client.post('/forgotpassword', json={'email': 'ss'},
                                follow_redirects=True)
    assert response.status_code == 200

def test_confirmation_token(test_client, init_database):
    response = test_client.post('/send-confirmation-token', json={'email': 'ss'},
                                follow_redirects=True)
    assert response.status_code == 200
