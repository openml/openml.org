class SearchAPIConnector {
  // Use index data by default
  constructor(indexName = "data") {
    this.indexName = indexName;
    console.log("created connector for", indexName);
  }

  onResultClick() {
    console.log("onResultClick");
  }
  onAutocompleteResultClick() {
    console.log("onAutocompleteResultClick");
  }

  async onSearch(requestState, queryConfig) {
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        indexName: this.indexName,
        requestState,
        queryConfig,
      }),
    };
    //console.log(request.body);
    const response = await fetch("/api/search", request);
    return response.json();
  }

  async onAutocomplete(requestState, queryConfig) {
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        indexName: this.indexName,
        requestState,
        queryConfig,
      }),
    };
    //console.log(request.body);
    const response = await fetch("/api/autocomplete", request);
    return response.json();
  }
}

export default SearchAPIConnector;
