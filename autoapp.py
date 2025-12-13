import os

from flask import Flask, request, send_from_directory, redirect
from flask_cors import CORS

from server.app import register_blueprints, register_extensions
from server.config import Config


""" Create flask app and routing"""
app = Flask(
    __name__,
    static_url_path="",
    static_folder="server/src/client/app/build",
    instance_relative_config=True,
)
app.config.from_object(Config)
app.add_url_rule("/", "root", lambda: app.send_static_file("index.html"))

# Configure CORS with production-ready settings
CORS(
    app,
    origins=app.config.get("CORS_ORIGINS"),
    supports_credentials=app.config.get("CORS_SUPPORTS_CREDENTIALS"),
    allow_headers=app.config.get("CORS_ALLOW_HEADERS"),
    methods=app.config.get("CORS_METHODS"),
)

register_extensions(app)
register_blueprints(app)
app.secret_key = os.environ.get("APP_SECRET_KEY")


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_static(path):
    """Never ever reached!"""
    print("static folder serve")
    if path != "" and os.path.exists(app.static_folder + "/" + path):
        print(path)
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


@app.errorhandler(404)
def page_not_found(e):
    # This seems to catch all routes! Refer link:
    # https://stackoverflow.com/questions/14023864/flask-url-route-route-all-other-urls-to-some-function
    print("error handler reached!")
    print(request.url)
    if "/d/" in request.url:
        print("Data in URL")
        url = str(request.url)
        url = url.split("/d/")
        return redirect(
            os.environ.get("REDIRECT_URL") + "/search?type=data&sort=runs&id=" + url[1]
        )
    elif "/t/" in request.url:
        print("Task in URL")
        url = str(request.url)
        url = url.split("/t/")
        return redirect(
            os.environ.get("REDIRECT_URL") + "/search?type=task&sort=runs&id=" + url[1]
        )
    elif "/f/" in request.url:
        print("Flow in URL")
        url = str(request.url)
        url = url.split("/f/")
        return redirect(
            os.environ.get("REDIRECT_URL") + "/search?type=flow&sort=runs&id=" + url[1]
        )
    elif "/r/" in request.url:
        print("Run in URL")
        url = str(request.url)
        url = url.split("/r/")
        return redirect(
            os.environ.get("REDIRECT_URL") + "/search?type=run&sort=date&id=" + url[1]
        )
    elif "/s/" in request.url:
        print("Study in URL")
        url = str(request.url)
        url = url.split("/s/")
        url = url[1]
        return redirect(
            os.environ.get("REDIRECT_URL")
            + "/search?type=study&study_type=run&id="
            + url
        )
    elif "/u/" in request.url:
        print("User in URL")
        url = str(request.url)
        url = url.split("/u/")
        return redirect(
            os.environ.get("REDIRECT_URL") + "/search?type=user&sort=date&id=" + url[1]
        )

    return send_from_directory(app.static_folder, "index.html")

    # return app


# app = create_app()

# if __name__ == '__main__':
#     app.run(port=int(os.environ.get("PORT", 5000)), debug=True, ssl_context='adhoc')
