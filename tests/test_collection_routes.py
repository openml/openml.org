import os


def test_upload_collection_runs(test_client, init_database):
    response = test_client.post(
        "/login", json={"email": "ff@ff.com", "password": "ff"}, follow_redirects=True
    )
    access_token = str(os.environ.get("TEST_ACCESS_TOKEN"))
    headers = {"Authorization": "Bearer {}".format(access_token)}
    json_obj = {
        "run_ids": "1,2,3,4",
        "collectionname": "test",
        "description": "test desc",
        "benchmark": "23",
    }
    response = test_client.post(
        "/upload-collection-runs", headers=headers, json=json_obj
    )
    print(response)
    assert response.status_code == 200


def test_upload_collection_tasks(test_client, init_database):
    access_token = str(os.environ.get("TEST_ACCESS_TOKEN"))
    headers = {"Authorization": "Bearer {}".format(access_token)}
    json_obj = {
        "taskids": "1,2,3,4",
        "collectionname": "test",
        "description": "test desc",
    }
    response = test_client.post(
        "/upload-collection-tasks", headers=headers, json=json_obj
    )
    print(response)
    assert response.status_code == 200
