import psycopg2

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
    covid_data = cur.fetchall()
    cur.close()
    conn.close()
    response = jsonify(covid_data)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    app.run(debug=True)
