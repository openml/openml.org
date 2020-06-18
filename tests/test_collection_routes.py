import os

import pytest

from server.extensions import db
from server.user.models import User


def test_upload_collection_runs(test_client, init_database):
    response = test_client.post('/login', json={'email': 'ff@ff.com', 'password': 'ff'},
                                follow_redirects=True)
    access_token = str(os.environ.get('TEST_ACCESS_TOKEN'))
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    response = test_client.post('/upload-collection-runs', headers=headers, json={'run_ids': '1,2,3,4',
                                                                                  'collectionname': 'test',
                                                                                  'description': 'test desc',
                                                                                  'benchmark': '23'}
                                )
    print(response)
    assert response.status_code == 200


def test_upload_collection_tasks(test_client, init_database):
    access_token = str(os.environ.get('TEST_ACCESS_TOKEN'))
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    response = test_client.post('/upload-collection-tasks', headers=headers, json={'taskids': '1,2,3,4',
                                                                                   'collectionname': 'test',
                                                                                   'description': 'test desc',
                                                                                   }
                                )
    print(response)
    assert response.status_code == 200
