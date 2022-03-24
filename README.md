# Project-2
 Project2:    Visualize Me, Captain!
 
1. Project Overview:
The project was initiated to tell a story with data. 
The specific requirements of the project are:
1. Your visualization must include a Python Flask–powered API, HTML/CSS, JavaScript, and at least one database (SQL, MongoDB, SQLite, etc.).
2. Your project should fall into one of the below four tracks:
2.1) A custom “creative” D3.js project (i.e., a nonstandard graph or chart)
2.2) A combination of web scraping and Leaflet or Plotly
2.3) A dashboard page with multiple charts that update from the same data
2.4) A “thick” server that performs multiple manipulations on data in a database prior to visualization (must be approved)
2.5) Your project should include at least one JS library that we did not cover. 
2.6) Your project must be powered by a data set with at least 100 records.
2.7) Your project must include some level of user-driven interaction (e.g., menus, dropdowns, textboxes).
2.8) Your final visualization should ideally include at least three views.

The “Project-2” directory contains the following files submitted for assessment:
•    “index.html” – the dashboard containing the COVID-19 visualisations created as part of this project.
•    “app.py” – the Flask API that must be run to extract the data from the PostgreSQL database and convert it to JSON format for use in creating visualisations in the dashboard.
•    “assets” – a folder containing the Javascript files used to create visualisations, as well as the CSS stylesheet files.
•    “database” – a folder containing the Jupyter Notebook used to conduct the extract, transform, and load of the COVID-19 datasets, as well as schemas used to create the tables within the PostgreSQL database. 
•    “tables” – a folder containing CSV files of the tables developed with the ETL Jupyter Notebook. 
•    “presentation” – a folder containing “Project-2”, the PowerPoint presentation for the project,
•    “proposal” – a folder containing "project-2-project-proposal", the original proposal for the project.

2. Team Members:
    Megan Greenhill 
    Hesh Kuruppuge 
    Jacqueline Xia 
    Mike Murphy
    
3. Project Brief Description:
The project uses a Python Flask-powered API to access an integrated PostgreSQL database that contains COVID-19 information. The database can be updated as frequently as required.
This information has been sourced from the John Hopkins University COVID-19 time series datasets, vaccination information sourced from Our World in Data, and world population information sourced from Worldometers.
This provides the basis for an ongoing analysis of COVID-19 and its global impact using user selected visualisations.

4. Project Evolution:
•    To commence this project, we utilised the work from our prior ETL project where we extracted and transformed COVID-19 data from JHU, Our World in Data, Worldometers to create tables, which were then loaded into a PostgreSQL relational database.
•    Instead of creating individual tables as in the ETL project, we altered our Jupyter Notebook script to merge all tables into one full table, then loaded this to the database.
•    This would allow us to create a single JSON file with this data when we developed the Flask-powered API.

5. Flask-powered API:
•    A Flask-powered API was created to extract the full COVID table from the PostgreSQL database and create a JSON file.
•    This extraction was achieved using a Python library called psycopg2.
•    Each column of the database table was assigned to a dictionary, which was then JSONified and returned through the app. This app would then be called on in the JS script to create visualisations.

          

 
6. Covid-19 Visualisations:    
As part of this project, we developed three visualizations:

1. A bubble chart representing confirmed cases and deaths and case-fatality-ratio plotted against fully vaccinated, boosted, and unvaccinated populations for each country.

 
2. A bar chart representing the ten countries with the highest number of confirmed cases as of the date of the last database update, March 15, 2022.
 






3. Two scatter plots representing the number of confirmed cases and deaths over time for any country of the user’s choice, which can be selected using a dropdown list.

 
 
7. Project Datasets:
The datasets for the project can be found at the following links.
•    “JHU – Time Series Daily Reports”
https://coronavirus.jhu.edu/data
•    “World population data”
https://www.worldometers.info/world-population/population-by-country/
•    “Vaccination rates per country”
https://ourworldindata.org/covid-vaccinations

8. Covid-19 Database Entity Relationship Diagram:
Original ERD:                                    New ERD:
                  

9. Covid-19 Database Description
The key to the data base was to use the International Standards Organisation (iso_code: ISO 3166-1 alpha-3 – three-letter country code) henceforth referred to as “iso-code”, to create relationships between the tables. The “country-codes” table contains the “iso-code” and matching “country-name” for all countries covered by the “iso-code” and was generated during the Extraction phase of the project. The “covid-cases” table contains the basic cleansed data from the JHU Data Sets which form the basis of the global view of Covid-19 cases. The “vaccinations” table contains vaccination status from the Our World in data Vaccination data set. The “full_table” contains the complete set of data used to drive the visualisations for the project.

10. Covid-19 Data Load:
The data load phase of the assignment uses urls / wget downloads as API calls are not available for the datasets needed. The three JHU time series data sets are retrieved using this method.
The Vaccination and Population data sets are downloaded from their respective sites as CSV files using the Pandas pd.read_csv function.
The “create-covid-db” Jupyter Notebook transforms and cleanses the downloaded data and creates the “covid” database. 


