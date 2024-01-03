const express = require('express');
const proxy = require('express-http-proxy');
const app = express();

app.use('/proxy', proxy('https://es.openml.org', {
  proxyReqBodyDecorator(bodyContent, srcReq) {
    // Convert Buffer to String
    const queryStr = bodyContent.toString();

    // Parse the string into JSON and pretty print
    try {
      const queryObj = JSON.parse(queryStr);
      console.log('Elasticsearch Query:', JSON.stringify(queryObj, null, 2));
    } catch (error) {
      console.error('Error parsing JSON:', error);
      // Log the original string if it's not valid JSON
      console.log('Elasticsearch Query:', queryStr);
    }
    
    return bodyContent;
  }
}));

// Root route handler
app.get('/', (req, res) => {
    res.send('Elasticsearch Proxy Server is running.');
  });

app.listen(3001, () => {
  console.log('Proxy server running on port 3001');
});
