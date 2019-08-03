from src.dash.dashapp import create_dash_app
from flask import Flask
import time
def test_one(dash_br):
    dash_br.server_url = 'http://127.0.0.1:5000/dashboard/'
    assert dash_br.wait_for_element("h1").text == "Welcome to dash dashboard"
    time.sleep(1)
    assert dash_br.get_logs() == [], "browser console should contain no error"

    dash_br.percy_snapshot("dash testing page")
# from selenium import webdriver
#
# driver = webdriver.Chrome()