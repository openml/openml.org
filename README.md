# OpenML Frontend
This is a novel standalone frontend for OpenML, built on Flask, React, and Dash.

## Building React
The React files are in `src/client/app`. From there, run `npm install` to install the required packages.

Then, build the production app by running

`npm run build`

Or, for development (with hot-loading), run

`npm run start`

## Starting Flask
If you haven't already, install Flask with `pip install Flask`.
Start the service with:

`python server.py`

You should now see it running in your browser at:

`localhost:5000`

## How to contribute
We welcome all contributions to:
* Style and layout
* Data visualizations
* Search functionality
* Bugfixes and open issues

If you want to contribute new features, or you need additional functionality from the OpenML server, please open an issue.

## OpenML Server interaction
The frontend mainly works on data from an ElasticSearch index of OpenML data.
Additional interactions with an OpenML backend (e.g. dataset upload) go via the [OpenML REST API](https://www.openml.org/api_docs)

## Help
This code is currently underdocumented. We are working on this. Feel very free to open issues to ask questions!
