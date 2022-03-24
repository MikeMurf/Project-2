// Set SVG dimensions and margins
var svgWidth = 960;
var svgHeight = 625;

var margin = {top: 20, right: 40, bottom: 100, left: 100};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter") // insert chart to tag id "scatter"
	.append("svg")
	.attr("width", svgWidth)
	.attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g") 
	.attr("height", height)
	.attr("width", width)
	.attr("transform", `translate(${margin.left}, ${margin.top})`);
	
// initial parameters
var xProperty = "fully_vaccinated_per_hundred";
var yProperty = "confirmed";

// function to update x-scale 
function xScale(data, xProperty) {
	// create scale
	var xLinearScale = d3.scaleLinear()
	.domain([d3.min(data, d => d[xProperty]) * 0.8,
	d3.max(data, d => d[xProperty]) * 1.2
	])
	.range([0, width]);
	return xLinearScale;
}

// function to update y-scale
function yScale(data, yProperty) {
	// create scale
	var yLinearScale = d3.scaleLinear()
	.domain([d3.min(data, d => d[yProperty]) * 0.8,
	d3.max(data, d => d[yProperty]) * 1.1
	])
	.range([height, 0]);
	return yLinearScale;
}

// function to update x-axis var when x-axis label clicked 
function renderXAxis(newXScale, xAxis) {
	var bottomAxis = d3.axisBottom(newXScale);
	xAxis.transition()
	.duration(1000)
	.call(bottomAxis);
	return xAxis;
}

	// Function to update y-axis var when y-axis label clicked
function renderYAxis(newYScale, yAxis) {
	var leftAxis = d3.axisLeft(newYScale); 
	yAxis.transition()
	.duration(1000)
	.call(leftAxis);
	return yAxis;
}

// Function to render circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, xProperty, newYScale, yProperty) {
	circlesGroup.transition()
	.duration(1000)
	.attr("cx", d => newXScale(d[xProperty]))
	.attr("cy", d => newYScale(d[yProperty]));
	return circlesGroup;
}

// Function to render circles text
function renderText(circleText, newXScale, xProperty, newYScale, yProperty) {
	circleText.transition()
	.duration(1000)
	.attr("x", d => newXScale(d[xProperty]))
	.attr("y", d => newYScale(d[yProperty]));
	return circleText;
}

// Function to update circles group with new tooltip
function updateToolTip(xProperty,yProperty, circlesGroup) {
	console.log("update tool tip", xProperty);
	var label;
	
	// set x and y axis label on tooltip based on selection
	if (xProperty === "fully_vaccinated_per_hundred") {
	label = "Fully Vaccinated per 100:";
	}
	else if (xProperty === "not_fully_vaccinated_per_hundred") {
	label = "Not Vaccinated per 100:";
	}
	else {
	label = "Boosted per 100:";
	}
	
	if (yProperty === "deaths") {
	ylabel = "Deaths:";
	}
	else {
	ylabel = "Confirmed Cases:";
	}

	// Initialise tooltip
	var toolTip = d3.tip()
	.attr("class", "d3-tip")
	.offset([80, -60])
	.html(function (d) {
			//if (xProperty === "fully_vaccinated_per_hundred") {
			//return (`${d.country_id}<br>${label} ${d[xProperty]}%<br>${ylabel} ${d[yProperty]}%`); 
			//}
			//else
			//return (`${d.country_id}<br>${label} ${d[xProperty]}<br>${ylabel} ${d[yProperty]}%`);
			
			if (yProperty === "confirmed") {
			return (`${d.country_id}<br>${label} ${d[xProperty]}<br>${ylabel} ${d[yProperty]}`); 
			}
			else
			return (`${d.country_id}<br>${label} ${d[xProperty]}<br>${ylabel} ${d[yProperty]}`);
	});

	// Display tooltip on click
	circlesGroup.call(toolTip);
	circlesGroup.on("mouseover", function (data) {
	toolTip.show(data,this);
	})
	// Hide tooltip on mouseout
	.on("mouseout", function (data, index) {
		toolTip.hide(data,this);
	});
	return circlesGroup;
}

// Load data from csv file
// d3.csv('tables/full_covid_table.csv').then(function (data) {
d3.json("http://127.0.0.1:5000/").then((covidData) => {
    var data = JSON.parse(covidData).filter(function (dateobject) {
      return dateobject.date === "2022-02-05 00:00:00";
    })

	// Parse data
	data.forEach(d => {
	d.fully_vaccinated_per_hundred = +d.fully_vaccinated_per_hundred;
	d.confirmed = +d.confirmed;
	d.not_fully_vaccinated_per_hundred = +d.not_fully_vaccinated_per_hundred;
	d.boosted_per_hundred = +d.boosted_per_hundred;
	d.deaths = +d.deaths
    });

	// LinearScale functions 
	var xLinearScale = xScale(data, xProperty);
	var yLinearScale = yScale(data, yProperty);
	
	// Create axis functions
	var bottomAxis = d3.axisBottom(xLinearScale);
	var leftAxis = d3.axisLeft(yLinearScale);

	// Append x-axis
	var xAxis = chartGroup.append("g")
	.classed("x-axis", true)
	.attr("transform", `translate(0, ${height})`)
	.call(bottomAxis);

	// Append y-axis
	var yAxis = chartGroup.append("g")
	.classed("y-axis", true)
	.attr("transform", `translate(0, 1-${height})`)
	.call(leftAxis); 

	// Append initial circles
	var circlesGroup = chartGroup.selectAll("circle")
	.data(data)
	.enter()
	.append("circle")
	.attr("cx", d => xLinearScale(d[xProperty])) 
	.attr("cy", d => yLinearScale(d[yProperty])) 
	.attr("r", "15")
	.attr("fill", "SlateBlue") 
	.attr("opacity", ".5");

	// Create group for x-axis labels
	var labelsGroup = chartGroup.append("g")
	.attr("transform", `translate(${width / 2}, ${height + 20})`);

	var fully_vaccinated_per_hundredLabel = labelsGroup.append("text")
	.attr("x", 0)
	.attr("y", 15)
	.attr("value", "fully_vaccinated_per_hundred")
	.classed("active", true)
	.text("Fully Vaccinated per 100");

	var boosted_per_hundredLabel = labelsGroup.append("text")
	.attr("x", 0)
	.attr("y", 30)
	.attr("value", "boosted_per_hundred")
	.classed("inactive", true)
	.text("Boosted per 100");

	var not_fully_vaccinated_per_hundredLabel = labelsGroup.append("text")
	.attr("x", 0)
	.attr("y", 45)
	.attr("value", "not_fully_vaccinated_per_hundred") 
	.classed("inactive", true)
	.text("Not Vaccinated per 100");  

	var deathsLabel = labelsGroup.append("text")
	.attr("transform","rotate(-90)")
	.attr("x", (margin.left) * 2.5)
	.attr("y", 0 - (height -40))
	.attr("value", "deaths") 
	.classed("inactive", true)
	.text("Deaths");

	var confirmedLabel = labelsGroup.append("text")
	.attr("transform","rotate(-90)")
	.attr("x", (margin.left) * 2.5)
	.attr("y", 0 - (height -20))
	.attr("value", "confirmed") 
	.classed("active", true)
	.text("Confirmed Cases");  

	//  Add text to Circle
	var circleText = chartGroup.selectAll()
	.data(data)
	.enter()
	.append("text")
	.text(d => d.country_id)
	.attr("x", d => xLinearScale(d[xProperty])) 
	.attr("y", d => yLinearScale(d[yProperty])) 
	.attr("class", "stateText") 
	.attr("font-size", "9");

	// UpdateToolTip function
	var circlesGroup = updateToolTip(xProperty, yProperty,circlesGroup);

	// Axis labels event listener
	labelsGroup.selectAll("text")
	.on("click", function () { 
		// Get value of selection
		var value = d3.select(this).attr("value");

		if(true){   
			if (value == "fully_vaccinated_per_hundred" || value=="boosted_per_hundred" || value=="not_fully_vaccinated_per_hundred") { 
			console.log("event listener x property", xProperty);
			// Replace x-property with value
			xProperty = value;
			xLinearScale = xScale(data, xProperty);

			// Update x-axis with transition
			xAxis = renderXAxis(xLinearScale, xAxis);
			
			// Change classes to change bold text
			if (xProperty === "boosted_per_hundred") {
				boosted_per_hundredLabel
				.classed("active", true)
				.classed("inactive", false);
				fully_vaccinated_per_hundredLabel
				.classed("active", false)
				.classed("inactive", true);
				not_fully_vaccinated_per_hundredLabel
				.classed("active", false)
				.classed("inactive", true); 
			}
			else if(xProperty == "not_fully_vaccinated_per_hundred"){
				not_fully_vaccinated_per_hundredLabel
				.classed("active", true)
				.classed("inactive", false);  
				fully_vaccinated_per_hundredLabel
				.classed("active", false)
				.classed("inactive", true);
				boosted_per_hundredLabel
				.classed("active", false)
				.classed("inactive", true);
			}
			else {
				fully_vaccinated_per_hundredLabel
				.classed("active", true)
				.classed("inactive", false);
				boosted_per_hundredLabel
				.classed("active", false)
				.classed("inactive", true);
				not_fully_vaccinated_per_hundredLabel
				.classed("active", false)
				.classed("inactive", true); 
			}
			} 

		else

		// Replace y-property with value
		yProperty = value;
		yLinearScale = yScale(data, yProperty);
		console.log("event listener y property", yProperty);
		// Update y-axis with transition
		yAxis = renderYAxis(yLinearScale, yAxis);
				
		// Change classes to change bold text
		if (yProperty == "confirmed") {
			confirmedLabel
			.classed("active", true)
			.classed("inactive", false);  
			deathsLabel
			.classed("active", false)
			.classed("inactive", true);

		}
		else {
			deathsLabel
			.classed("active", true)
			.classed("inactive", false);
			confirmedLabel
			.classed("active", false)
			.classed("inactive", true);
		}
	
		// Update circles with new values
		circlesGroup = renderCircles(circlesGroup, xLinearScale, xProperty, yLinearScale, yProperty);
		//  Update circle text
		circleText = renderText(circleText, xLinearScale, xProperty, yLinearScale, yProperty); 

		// Update tooltips with new values
		circlesGroup = updateToolTip(xProperty, yProperty, circlesGroup);

	} 
	
	}); 

})

// Load JSON data from PostgreSQL database
function getCovidCountryData(country) { 
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
        type: "scatter",
        marker: {
          color: '#6a5acd',
          line: {
            color: '#6a5acd'
          }
        }
    };
    
    // Define trace data
    var traceDataConfirmed = [traceConfirmed];
    
    // Define layout
    var layoutConfirmed = {
        title: "Confirmed Cases over Duration of COVID-19 Pandemic",
        xaxis: {title: {text: "Date"}},
        yaxis: {title: {text: "Number of Confirmed Cases"}}
    };    

    // Render the plot to the div tag with id "confirmed"
    Plotly.newPlot("confirmed", traceDataConfirmed, layoutConfirmed);

  // Deaths
    var traceDeaths = {
        x: dates,
        y: deathStats,
        type: "scatter",
        marker: {
          color: '#6a5acd',
          line: {
            color: '#6a5acd'
          }
        }
    };

    // Define trace data
    var traceDataDeaths = [traceDeaths];

    // Define layout
    var layoutDeaths = {
        title: "Deaths over Duration of COVID-19 Pandemic",
        xaxis: {title: {text: "Date"}},
        yaxis: {title: {text: "Number of Deaths"}}
    };    

    // Render the plot to the div tag with id "deaths"
    Plotly.newPlot("deaths", traceDataDeaths, layoutDeaths);
    }

    buildPlots()
});
};

// Load JSON data from PostgreSQL database
function getCovidDateData() { 
  d3.json("http://127.0.0.1:5000/").then((covidData) => {
  var recentData = JSON.parse(covidData).filter(function (dateobject) {
    return dateobject.date === "2022-03-15 00:00:00";
  })

  // Sort the data by confirmed cases
  var sortedByConfirmed = recentData.sort((a, b) => a.confirmed - b.confirmed);

  // Reverse the array to accommodate Plotly's defaults
  reversedData = sortedByConfirmed.reverse();

  // Slice the first 10 objects for plotting
  slicedData = reversedData.slice(0, 10);

  // Create empty arrays for use in plots
  confirmedCases = []
  countryNames=[]

  // Fill arrays with country data 
  for (var i = 0; i < slicedData.length; i++) {
    confirmedCases.push(slicedData[i].confirmed);
    countryNames.push(slicedData[i].country_name);
  }

  // Define trace data
  var trace = {
    x: confirmedCases,
    y: countryNames,
    text: countryNames,
    type: "bar",
    orientation: "h",
    marker: {
      color: '#6a5acd'}
  };

  var data = [trace];

  // Apply the group bar mode to the layout
  var layout = {
    title: "Top 10 Countries with Highest Confirmed Cases on March 15, 2022",
    xaxis: {title: {text: "Number of Confirmed Cases"}},
    margin: {
      l: 100,
      r: 100,
      t: 100,
      b: 100
    }
  };

  // Render the plot to the div tag with id "plot"
  Plotly.newPlot("bar", data, layout);
  });
};

// Set the country to first country (Afghanistan) to build the initial plots
getCovidDateData()

const initialData = "Afghanistan";
getCovidCountryData(initialData);

// Fetch new data each time a new sample is selected
function optionChanged(newCountry) {
  getCovidCountryData(newCountry);
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
