// Load JSON data from PostgreSQL database
function getCovidData(country) { 
  d3.json("http://127.0.0.1:5000/").then((covidData) => {
  var countryData = JSON.parse(covidData).filter(function (countryobject) {
    return countryobject.country_name === country;
  })

  // Create empty arrays for use in plots
  dates = []
  confirmedCases = []
  recoveredCases = []
  deathStats = []

  // Fill arrays with country data 
  for (var i = 0; i < countryData.length; i++) {
    dates.push(countryData[i].date);
    confirmedCases.push(countryData[i].confirmed);
    recoveredCases.push(countryData[i].recovered);
    deathStats.push(countryData[i].deaths);
  }

  // Build plots
  function buildPlots() {
  // Confirmed cases
    var traceConfirmed = {
        x: dates,
        y: confirmedCases,
        type: "scatter"
    };
    
    // Define trace data
    var traceDataConfirmed = [traceConfirmed];
    
    // Define layout
    var layoutConfirmed = {
        title: "Confirmed Cases over Duration of COVID-19 Pandemic"
    };    

    // Render the plot to the div tag with id "confirmed"
    Plotly.newPlot("confirmed", traceDataConfirmed, layoutConfirmed);

  // Recovered cases
    var traceRecovered = {
        x: dates,
        y: recoveredCases,
        type: "scatter"
    };

    // Define trace data
    var traceDataRecovered = [traceRecovered];

    // Define layout
    var layoutRecovered = {
        title: "Recovered Cases over Duration of COVID-19 Pandemic"
    };    

    // Render the plot to the div tag with id "recovered"
    Plotly.newPlot("recovered", traceDataRecovered, layoutRecovered);

  // Deaths
    var traceDeaths = {
        x: dates,
        y: deathStats,
        type: "scatter"
    };

    // Define trace data
    var traceDataDeaths = [traceDeaths];

    // Define layout
    var layoutDeaths = {
        title: "Deaths over Duration of COVID-19 Pandemic"
    };    

    // Render the plot to the div tag with id "deaths"
    Plotly.newPlot("deaths", traceDataDeaths, layoutDeaths);
    }

    buildPlots()
});
};

// Set the country to first country (Afghanistan) to build the initial plots
const initialData = "Afghanistan";
getCovidData(initialData);

// Fetch new data each time a new sample is selected
function optionChanged(newCountry) {
  getCovidData(newCountry);
}

function init() {
    // Retrieve reference to the dropdown select element
    var selector = d3.select("#selDataset");
    // Use the list of country names to populate the select options
    d3.json("http://127.0.0.1:5000/").then((covidData) => {
    var covidDataParsed = JSON.parse(covidData)

    // Get all country names from imported JSON, then create array with only unique country names
    countryNamesAll = []
    for (var i = 0; i < covidDataParsed.length; i++) {
        countryNamesAll.push(covidDataParsed[i].country_name);
    }
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }   
    var countryNames = countryNamesAll.filter(onlyUnique).sort();
    
    // Add all country names as an option in a dropdown menu
    countryNames.forEach((country) => {
    selector
      .append("option")
      .text(country)
      .property("value", country);
    });
});
};

// Initialize the dashboard
init();
