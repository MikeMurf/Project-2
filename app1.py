import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify

#################################################
# Database Setup
#################################################
rds_connection_string = "postgres:meg221196@localhost:5432/integrated_covid_view_db"
engine = create_engine(f'postgresql://{rds_connection_string}')

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Country = Base.classes.country_name

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
        f"/api/covid-data<br/>"
        f"/api/covid-data/country_name/australia<br/>"
    )


@app.route("/api/v1.0/covid-data/country_name/<country_name>")
def covid_stats_by_country_name(country_name):
    """Fetch the country which name matches the path 
       variable supplied by the user, or a 404 if not."""

    canonicalized = country_name.replace(" ", "").lower()
    for country in full_covid_table:
        search_term = country["real_name"].replace(" ", "").lower()

        if search_term == canonicalized:
            country_statistics = []
            for confirmed, deaths, recovered in results:
                country_dict = {}
                country_dict["confirmed"] = confirmed
                country_dict["deaths"] = deaths
                country_dict["recovered"] = recovered
                country_statistics.append(country_dict)

            return jsonify(country_statistics)

    return jsonify({"error": f"Country with name {country_name} not found."}), 404


if __name__ == '__main__':
    app.run(debug=True)
