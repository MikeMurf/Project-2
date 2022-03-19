import numpy as np
import psycopg2
from flask import Flask, render_template


#################################################
# Database Setup
#################################################


conn_string = "host='localhost' dbname='Project2' user='postgres' password='Hesh2507#'"
conn = psycopg2.connect(conn_string)



#################################################
# Flask Setup
#################################################
app = Flask(__name__)



#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    return (
        f"Welcome to the COVID-19 Statistics API!<br/>"
        f"Available Routes:<br/>"
        f"/api/v1.0/covid_data<br/>"
        f"/api/v1.0/covid_data/country_name/australia<br/>"
    )

@app.route("/api/v1.0/covid-data")
def covid_data():
    
    # Create our session (link) from Python to the DB
    cur = conn.cursor()

    """Return a list of all passenger names"""
    # Query all countries
    cur.execute('SELECT * FROM full_covid_table;')
    country = cur.fetchall()

    cur.close()
   

    return (country)


if __name__ == '__main__':
    app.run(debug=True)



