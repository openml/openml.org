# flake8: noqa
import sqlite3
import os
basedir = os.path.abspath(os.path.dirname(__file__))


def create_empty_table():
    qry = """ CREATE TABLE IF NOT EXISTS users (
                                          id mediumint PRIMARY KEY CHECK(id > 0 ),
                                          username varchar(100) NOT NULL,
                                          password varchar(255) NOT NULL,
                                          email varchar(254) NOT NULL,
                                           activation_selector varchar(255) DEFAULT NULL,
                                          activation_code varchar(255) DEFAULT NULL,
                                          forgotten_password_selector varchar(255) DEFAULT NULL,
                                          forgotten_password_code varchar(255) DEFAULT NULL,
                                          forgotten_password_time int DEFAULT NULL,
                                          remember_selector varchar(255) DEFAULT NULL,
                                          remember_code varchar(255) DEFAULT NULL,
                                          created_on int NOT NULL,
                                          last_login int  DEFAULT NULL,
                                          active tinyint  DEFAULT NULL,
                                          first_name varchar(50) DEFAULT NULL,
                                          last_name varchar(50) DEFAULT NULL,
                                          company varchar(100) NOT NULL,
                                          phone varchar(20) DEFAULT NULL,
                                          country varchar(50) NOT NULL,
                                          image varchar(128) DEFAULT NULL,
                                          bio text NOT NULL,                                         
                                          core text CHECK( core IN ('true','false') )   NOT NULL DEFAULT 'false',                               
                                          external_source varchar(50) DEFAULT NULL,
                                          external_id varchar(50) DEFAULT NULL,
                                          session_hash varchar(40) DEFAULT NULL,
                                          session_hash_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                                          gamification_visibility varchar(32) NOT NULL DEFAULT 'show'
                                   
                                      ); """
    conn = sqlite3.connect(os.path.join(basedir, 'server/openml.db'),  check_same_thread=False)
    c = conn.cursor()
    c.execute(qry)
    conn.commit()
    c.close()
    conn.close()

#TODO Create demo user
create_empty_table()
