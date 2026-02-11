import os


def test_upload_task(test_client):
    response = test_client.post(
        "/login", json={"email": "ff@ff.com", "password": "ff"}, follow_redirects=True
    )
    access_token = str(os.environ.get("TEST_ACCESS_TOKEN"))
    headers = {"Authorization": "Bearer {}".format(access_token)}
    json_obj = {
        "dataset_id": "128",
        "task_type": "classification",
        "target_name": "class",
        "evaluation_measure": "predictive_accuracy",
    }
    response = test_client.post("/upload-task", headers=headers, json=json_obj)
    print(response)
    assert response.status_code == 200
