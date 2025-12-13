import datetime
import os

from dotenv import load_dotenv


class Config(object):
    """
    Config object for flask app
    """

    load_dotenv(".env")
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URI")
    #     'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Argon 2 password hashing parameters
    ARGON2_TIME_COST = 4
    ARGON2_MEMORY_COST = 16384
    ARGON2_PARALLELISM = 2
    # Jwt parameters
    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ["access", "refresh"]
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(hours=2)
    # OAuth parameters
    GITHUB_OAUTH_CLIENT_ID = ""
    GITHUB_OAUTH_CLIENT_SECRET = ""
    OAUTHLIB_INSECURE_TRANSPORT = True  # True only for dev not for production

    # CORS Configuration for Vercel deployment
    # Add your Vercel deployment URLs here
    CORS_ORIGINS = os.environ.get(
        "CORS_ORIGINS", "http://localhost:3000,http://localhost:8000"
    ).split(",")
    CORS_SUPPORTS_CREDENTIALS = True
    CORS_ALLOW_HEADERS = ["Content-Type", "Authorization"]
    CORS_METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
