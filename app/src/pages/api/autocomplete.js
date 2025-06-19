import axios from "axios";

const ELASTICSEARCH_SERVER = "https://www.openml.org/es/";

export default async function handler(req, res) {
  const { requestState, queryConfig, indexName } = req.body;
  const searchTerm = requestState?.searchTerm;

  if (!searchTerm) {
    return res.status(400).json({ error: "Missing searchTerm" });
  }

  try {
    const esQuery = {
      query: {
        match: {
          name: {
            query: searchTerm,
            fuzziness: "AUTO"
          }
        }
      },
      size: queryConfig?.autocompleteQuery?.resultsPerPage || 5,
      _source: ["name", "url"]
    };

    const response = await axios.post(
      `${ELASTICSEARCH_SERVER}/${indexName}/_search`,
      esQuery,
      { headers: { "Content-Type": "application/json" } }
    );

    const hits = response.data.hits.hits || [];

    const autocompletedResults = hits.map((hit) => ({
      id: { raw: hit._id },
      title: { snippet: hit._source.name },
      url: { raw: hit._source.url }
    }));

    res.status(200).json({
      autocompletedResults,
      autocompletedSuggestions: [],
      rawResponse: response.data,
    });
  } catch (error) {
    console.error("Autocomplete error:", error.message);
    res.status(500).json({ error: "Autocomplete search failed" });
  }
}
