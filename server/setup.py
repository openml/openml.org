import os
from distutils.util import strtobool

import openml

from server.utils import current_user


SERVER_BASE_URL = os.getenv("URL_API", "https://www.openml.org/")


def setup_openml_config():
    """
    This setup should be run before each request that interacts with the openml package,
    because the configuration depends on the user.
    """
    openml.config.server = SERVER_BASE_URL + "api/v1/xml"
    if strtobool(os.environ.get("TESTING", "True")):
        openml.config.start_using_configuration_for_example()
    user = current_user()
    openml.config.apikey = user.session_hash if user else ''
