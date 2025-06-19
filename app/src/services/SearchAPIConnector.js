class SearchAPIConnector {
  // Use index data by default
  constructor(indexName = "data") {
    this.indexName = indexName;
    //console.log("created connector for", indexName);
  }

  onResultClick() {
    console.log("onResultClick");
  }
  onAutocompleteResultClick() {
    console.log("onAutocompleteResultClick");
  }

  async onSearch(requestState, queryConfig) {
    console.log("onSearch", requestState, queryConfig);
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
    //console.log(response);
    return response.json();
  }

  async onAutocomplete(requestState, queryConfig) {
    console.log("onAutocomplete", requestState, queryConfig);
    const request = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        indexName: this.indexName,
        requestState,
        queryConfig,
        isSuggest: true, // if you want
      }),
    };
    const response = await fetch("/api/autocomplete", request);
    return response.json();
  }
}

export default SearchAPIConnector;
