import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

// Button to download the croissant description of a dataset
const CroissantButton = ({ url }) => {
  const [jsonData, setJsonData] = useState({});

  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setJsonData(data);
        } else {
          // Handle HTTP errors
          setJsonData({
            error: true,
            status: response.status,
            message: `HTTP error: ${response.status}`,
          });
        }
      } catch (error) {
        // Handle fetch errors
        setJsonData({
          error: true,
          message: error.message || "Error fetching JSON.",
        });
      }
    };

    fetchJsonData();
  }, [url]);
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(jsonData)}</script>
    </Helmet>
  );
};

export default CroissantButton;
