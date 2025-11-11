# OpenML Frontend

This is a novel standalone frontend for OpenML, built on Flask, React, and Dash.

Master Branch:
[![Build Status](https://travis-ci.com/openml/openml.org.svg?branch=master)](https://travis-ci.com/openml/openml.org)

Development branch:
[![Build Status](https://travis-ci.com/openml/openml.org.svg?branch=develop)](https://travis-ci.com/openml/openml.org)

## Getting started

Please see the [Website documentation](https://docs.openml.org/contributing/website/Website/) for installation instructions and further information on structure and guidelines.

## How to contribute

We welcome all contributions to:

-   Style and layout
-   Data visualizations
-   Search functionality
-   Bugfixes and open issues

If you want to contribute new features, or you need additional functionality from the OpenML server, please open an issue.

## OpenML Server interaction

The frontend mainly works on data from an ElasticSearch index of OpenML data.
Additional interactions with an OpenML backend (e.g. dataset upload) go via the [OpenML Python API](https://openml.github.io/openml-python/main/)

## Help

This code is currently underdocumented. We are working on this. Feel very free to open issues to ask questions!

# OpenML.ORG Terminology (the right words, zero confusion)

| Old / vague word         | **Correct term**         | GYRNc one-liner example                     |
| ------------------------ | ------------------------ | ------------------------------------------- |
| envirments (vev)         | **environments**         | `echo -e "${G}envs ready${c}"`              |
| source venv/bin/activate | **activate the venv**    | `source .venv/bin/activate`                 |
| npm run dev              | **start the dev server** | `npm run dev -- --host`                     |
| flask run                | **run Flask in debug**   | `flask --app server/autoapp.py --debug run` |
| the pink script          | **Barbie Mode**          | `PINK='\033[1;35m'`                         |
| the green/yellow one     | **GYRNc Mode**           | `G='\033[0;32m' Y='\033[1;33m'`             |
| Ctrl+C everything        | **trap & kill**          | `trap "kill $BACK $FRONT" INT`              |
| pip install foo          | **SUCCESS**              | `echo -e "${G}foo installed ✓${c}"`         |

### 3 commands you’ll type forever

```bash
./dev.sh          # daily lightning (GYRNc)
./dev.sh --docker # prod mirror
pip install foo   # → SUCCESS
💚🚀
```

./dev.sh # setup & start front+back (GYRNc)
./dev.sh --docker # prod mirror
pip install foo # → SUCCESS

**Q: Do I need to create a `docker-compose.yaml` to use `./dev.sh --docker` on a new target production (Linux/AMD64)?**

A: Check if `docker-compose.yaml` already exists in the repository. If it does, `./dev.sh --docker` will use it. If not, you'll need to create one or verify that the script has an embedded/alternative container orchestration method. Review `dev.sh` source to confirm the expected setup.
