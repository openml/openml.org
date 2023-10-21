class SearchAPIConnector {
  constructor(type) {
    this.type = type;
  }

  onResultClick() {
    console.log("onResultClick");
  }
  onAutocompleteResultClick() {
    console.log("onAutocompleteResultClick");
  }

  async onSearch(requestState, queryConfig) {
    const response = await fetch("/api/search/" + this.type, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestState,
        queryConfig,
      }),
    });
    console.log("Received queryConfig:", queryConfig);
    console.log("Response:", response);
    return response.json();
  }

  async onAutocomplete(requestState, queryConfig) {
    const response = await fetch("api/autocomplete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestState,
        queryConfig,
      }),
    });
    return response.json();
  }
}

export default SearchAPIConnector;
