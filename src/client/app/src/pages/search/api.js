function errorCheck(response) {
      if (!response.ok) {
        console.error("Request failed: ["+response.status+"] "+response.statusText);
        console.log(response)
        if (response.hasOwnProperty("headers") && !response.headers.get("content_type").startsWith("application/json")){
            return Promise.reject("["+response.status+"] "+response.statusText);
        }
        if(typeof data !== 'undefined'){
        return response.json().then(
            (data)=>Promise.reject("[ElasticSearch] "+data.error.root_cause[0].reason)
        )
      } else {
        return Promise.reject("[ElasticSearch] "+response.status+": "+response.statusText);
      }
        //throw new Error("Request failed: " + request.statusText);
    }
    return Promise.resolve(response);
}

function getTeaser(description) {
    if (description === undefined) {
        return undefined;
    }
    let lines = description.split("\n").map(i => i.trim());
    for (let i = 0; i < lines.length; i++) {
        if (!lines[i].startsWith("*") && !lines[i].startsWith("#") && lines[i].length > 0) {
            return lines[i];
        }
    }
    return lines[0];
}

function parseDots(obj, param) {
    if (param === undefined || param === null) {
        return undefined;
    }

    if (obj === undefined || obj === null) {
        throw new Error("Obj may not be NULL");
    }
    param = param + "";

    let index = param.indexOf(".");
    if (index === -1) {
        if (!obj.hasOwnProperty(param)) {
            return ("Cannot load property "+param);
        }
        return obj[param];
    }
    else {
        if (!obj.hasOwnProperty(param.substring(0, index))){
            return ("Cannot load intermediate property "+param.substring(0, index));
        }
        return parseDots(obj[param.substring(0, index)], param.substring(index + 1));
    }
}

const ELASTICSEARCH_SERVER = 'https://www.openml.org/es/';

export function listItems(tag,type = "data", sort = {"value": "runs", "order": "desc"}, filter = [],
                             nameField = "name", descriptionField = "description",
                             processDescription = true,
                             idField = "data_id",
                             stats = [
                                 {"param": "runs", "unit": "runs", "icon": "fa fa-star"},
                                 {"param": "nr_of_likes", "unit": "likes", "icon": "fa-heart"},
                                 {"param": "nr_of_downloads", "unit": "downloads", "icon": "fa-cloud"},
                                 {"param": "reach", "unit": "reach", "icon": "fa-rss"},
                                 {"param": "impact", "unit": "impact", "icon": "fa-bolt"}
                             ],
                             stats2 = [
                                 {"param": "qualities.NumberOfInstances", "unit": "instances"},
                                 {"param": "qualities.NumberOfFeatures", "unit": "fields"},
                                 {"param": "qualities.NumberOfClasses", "unit": "classes"},
                                 {"param": "qualities.NumberOfMissingValues", "unit": "missing"}
                             ],
                             statusField = "status") {
      console.log(type);
      if(tag !== undefined){//nested query for tag
                  filter =[{
                      "nested":
                       {
                         "path":
                          "tags",
                          "query":
                                {
                                    "term":
                                        {
                                            "tags.tag":tag
                                        }
                                },
                      }
                    }]
      }
    //console.log(filter);
    let params = {
        "from": 0,
        "size": 100,
        "query": {
          "bool":
              {
                  "must":
                      {"match_all": {}},
                  "filter":[].concat(filter),
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
            [sort.value]: {
                "order": sort.order
            }
        },

        "aggs": {
            "type": {
                "terms": {"field": "_type"}
            }
        },
        "_source": [
            nameField,
            descriptionField,
            idField].concat(
            stats.map((stat) => stat.param)
        ).concat(
            stats2.map((stat) => stat.param)
        ).concat(statusField).filter((l)=>(!!l)),
    };
    console.log(params);
    //return fetch(process.env.ELASTICSEARCH_SERVER + '/' + type + '/'+ type + '/_search?type=' + type,
    return fetch(ELASTICSEARCH_SERVER + type + '/'+ type + '/_search?type=' + type,
        {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
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
            //console.log(data["hits"]["hits"][0]);
            return {
              "total": data["hits"]["total"],
              "results": data["hits"]["hits"].map(
                x => {
                    let source = x["_source"];
                    return {
                        "name": parseDots(source, nameField),
                        "teaser": processDescription ? getTeaser(parseDots(source, descriptionField)) :
                            parseDots(source, descriptionField),
                        "stats":
                            stats.map(
                                stat => ({
                                    "value": parseDots(source, stat.param),
                                    "unit": stat.unit,
                                    "icon": stat.icon
                                })
                            )
                        ,
                        "stats2":
                            stats2.map(
                                stat => ({
                                    "value": parseDots(source, stat.param),
                                    "unit": stat.unit,
                                    "icon": stat.icon
                                })
                            )
                        ,
                        "data_status": parseDots(source, statusField),
                        "data_id": parseDots(source, idField)
                    }
                }
            )}
        }
    );
}




export function getItem(type,itemId) {
    return fetch(
        ELASTICSEARCH_SERVER + "/" + type + "/" + type + "/" + itemId,
        {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            mode: "cors"
        }
    ).then(
        errorCheck
    ).then(
        (request) => request.json()
    ).then(
        (data) => {
            if (data["found"] !== true) {
                throw Error("No task with id \"" + itemId + "\" found. It may have been removed or renamed");
            }
            return Promise.resolve(data["_source"])
        }
    )
}
export function getList(itemId) {
    return fetch(
        ELASTICSEARCH_SERVER + "/data/data/list/tag/" + itemId,
        {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            mode: "cors"
        }
    ).then(
        errorCheck
    ).then(
        (request) => request.json()
    ).then(
        (data) => {
            if (data["found"] !== true) {
                throw Error("No task with id \"" + itemId + "\" found. It may have been removed or renamed");
            }
            return Promise.resolve(data["_source"])
        }
    )
}
