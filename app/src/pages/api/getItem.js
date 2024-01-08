//get specific item
const ELASTICSEARCH_SERVER = "https://www.openml.org/es/";

export function errorCheck(response) {
  if (!response.ok) {
    console.error(
      "Request failed: [" + response.status + "] " + response.statusText,
    );
    console.log(response);
    if (
      response.hasOwnProperty("headers") &&
      !response.headers.get("content_type").startsWith("application/json")
    ) {
      return Promise.reject("[" + response.status + "] " + response.statusText);
    }
    if (typeof data !== "undefined") {
      return response
        .json()
        .then((data) =>
          Promise.reject("[ElasticSearch] " + data.error.root_cause[0].reason),
        );
    } else {
      return Promise.reject(
        "[ElasticSearch] " + response.status + ": " + response.statusText,
      );
    }
    //throw new Error("Request failed: " + request.statusText);
  }
  return Promise.resolve(response);
}

export function getItem(type, itemId) {
  return fetch(ELASTICSEARCH_SERVER + "/" + type + "/" + type + "/" + itemId, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    mode: "cors",
  })
    .then(errorCheck)
    .then((request) => request.json())
    .then((data) => {
      if (data["found"] !== true) {
        throw Error(
          'No task with id "' +
            itemId +
            '" found. It may have been removed or renamed',
        );
      }
      return Promise.resolve(data["_source"]);
    });
}
