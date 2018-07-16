export function listDatasets() {
    /*JsonRequest(
            "https://www.openml.org/es/openml/_search",
            ,*/
    let params = {
        "from": 0,
        "size": 100,
        "query": {
            "bool":
                {
                    "must":
                        {"match_all": {}},
                    "filter":
                        {
                            "term":
                                {
                                    "status": "active"
                                }
                        },
                    "should":
                        [
                            {
                                "term": {
                                    "visibility": "public"
                                }
                            }
                        ],
                    "minimum_should_match": 1
                }
        },
        "sort": {
            "runs": {
                "order": "desc"
            }
        },
        "aggs": {
            "type": {
                "terms": {"field": "_type"}
            }
        }
    };

    console.log("fetching");

    return fetch('https://www.openml.org/search',
        {
            method: "POST",
            mode: "cors",
            body: JSON.stringify(params)
        }
    ).then(
        (request) => {
            console.log("fetching II");
            if (!request.ok) {
                throw Error("Request failed: " + request.statusText);
            }
            return request;
        }).then(
        (request) => request.json()
    ).then(
        (data) => {
            return data["hits"]["hits"].map(
                x => ({
                    "name": x["_source"]["name"],
                    "teaser": "I can not find the teaser text",
                    "stats": [
                        {"value": x["_source"]["runs"], "unit": "runs", "icon": "fa-star"},
                        {"value": x["_source"]["nr_of_likes"], "unit": "likes", "icon": "fa-heart"},
                        {"value": x["_source"]["nr_of_downloads"], "unit": "downloads", "icon": "fa-cloud"},
                        {"value": x["_source"]["reach"], "unit": "reach", "icon": "fa-rss"},
                        {"value": x["_source"]["impact"], "unit": "impact", "icon": "fa-bolt"}
                    ],
                    "stats2": [
                        {"value": x["_source"]["qualities"]["NumberOfInstances"] + "", "unit": "instances"},
                        {"value": x["_source"]["qualities"]["NumberOfFeatures"] + "", "unit": "fields"},
                        {"value": x["_source"]["qualities"]["NumberOfClasses"] + "", "unit": "classes"},
                        {"value": x["_source"]["qualities"]["NumberOfMissingValues"] + "", "unit": "missing"}
                    ],
                    "data_id": x["_source"]["data_id"]
                })
            )
        }
    );
}