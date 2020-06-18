import os

import pytest

from server.extensions import db
from server.user.models import User


def test_upload_task(test_client, init_database):

    response = test_client.post('/login', json={'email': 'ff@ff.com', 'password': 'ff'},
                                follow_redirects=True)
    access_token = str(os.environ.get('TEST_ACCESS_TOKEN'))
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    response = test_client.post('/upload-task', headers=headers, json={'dataset_id': '128',
                                                                       'task_type': 'classification',
                                                                       'target_name': 'class',
                                                                       'evaluation_measure': 'predictive_accuracy'}
                                )
    print(response)
    assert response.status_code == 200
