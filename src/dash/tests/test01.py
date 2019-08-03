from src.dash.dashapp import create_dash_app
from flask import Flask

def test_one(dash_duo):
    flask_app = Flask(__name__, static_url_path='', static_folder='src/client')
    flask_app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))
    app = create_dash_app(flask_app)
    dash_duo.start_server(app)
