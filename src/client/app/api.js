function errorCheck(request) {
    if (!request.ok) {
        throw Error("Request failed: " + request.statusText);
    }
    return request;
}

function getTeaser(description) {
    let lines = description.split("\n").map(i=>i.trim());
    for (let i=0; i<lines.length; i++){
        if (!lines[i].startsWith("*") && !lines[i].startsWith("#") && lines[i].length>0){
            return lines[i];
        }
    }
    return lines[0];
}

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
        },
        "_source": [
            "name",
            "runs",
            "nr_of_likes",
            "nr_of_downloads",
            "reach",
            "impact",
            "qualities.NumberOfInstances",
            "qualities.NumberOfFeatures",
            "qualities.NumberOfClasses",
            "qualities.NumberOfMissingValues",
            "data_id",
            "description"
        ]
    };

    return fetch('https://www.openml.org/es/openml/_search',
        {
            method: "POST",
            mode: "cors",
            body: JSON.stringify(params)
        }
    ).then(
        errorCheck
    ).then(
        (request) => request.json()
    ).then(
        (data) => {
            console.log(data["hits"]["hits"][0]);
            return data["hits"]["hits"].map(
                x => ({
                    "name": x["_source"]["name"],
                    "teaser": getTeaser(x["_source"]["description"]),
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

export function getItem(itemId) {
    return fetch(
        "https://www.openml.org/es/openml/data/" + itemId,
        {
            mode: "cors"
        }
    ).then(
        errorCheck
    ).then(
        (request)=>request.json()
    ).then(
        (data)=>{
            if (data["found"]!==true){
                throw Error("No dataset with id \""+itemID+"\" found. It may have been removed or renamed");
            }
            return Promise.resolve(data["_source"])
        }

    )
}