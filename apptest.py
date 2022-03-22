import psycopg2

import json
import collections
from flask import Flask, jsonify

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################
def get_db_connection():
    conn = psycopg2.connect(user='postgres',
                            password='meg221196',
                            host='localhost',
                            port='5432',
                            database='integrated_covid_view_db')
    return conn

#################################################
# Flask Route
#################################################
@app.route('/')
def index():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM full_covid_table;')
    rows = cur.fetchall()

    covid_data_dict = []
    for row in rows:
        d = collections.OrderedDict()
        d['country_id'] = row[0]
        d['country_name'] = row[1]
        d['continent_name'] = row[2]
        d['population'] = row[3]
        d['date'] = row[4]
        d['confirmed'] = row[5]
        d['deaths'] = row[6]
        d['recovered'] = row[7]
        d['active'] = row[8]
        d['new_cases'] = row[9]
        d['new_deaths'] = row[10]
        d['new_recovered'] = row[11]
        d['vaccinated_per_hundred'] = row[12]
        d['fully_vaccinated_per_hundred'] = row[13]
        d['boosted_per_hundred'] = row[14]
        d['not_fully_vaccinated_per_hundred'] = row[15]
        covid_data_dict.append(d)

    covid_data = json.dumps(covid_data_dict)

    # with open('student_objects.js', 'w') as f:
    #     f.write(j)

    cur.close()
    conn.close()
    response = jsonify(covid_data)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    app.run(debug=True)
