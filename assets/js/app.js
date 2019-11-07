var svgWidth = 860;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

/* Create an SVG wrapper, append an SVG group that will hold our chart, 
and shift the latter by left and top margins.*/

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data

d3.csv("assets/data/data.csv")
  .then(function(demoData) {

// Parse Data/Cast as numbers
    
    demoData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

// Create scale functions
    
    var xLinearScale = d3.scaleLinear()
      .domain([9, d3.max(demoData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([2, d3.max(demoData, d => d.healthcare)])
      .range([height, 0]);

// Create axis functions
    
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

//Append Axes to the chart
    
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

// Create Circles
    
    chartGroup.selectAll("label")
    .data(demoData)
    .enter()
    .append("text")
    .attr("dx", function(d){return -8})
    .attr("font-family", "times new roman")
    .attr("font-size", "10px")
    .attr("font-weight", "bold")
    .attr("x", function(d){
      return xLinearScale(d.poverty)
    })
    .attr("y", function(d){
      return yLinearScale(d.healthcare)
    })
    .text(function(d){return d.abbr})

    var circlesGroup = chartGroup.selectAll("circle")
    .data(demoData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "16")
    .attr("fill", "Plum")
    .attr("opacity", ".5")
    .text(function(d){return d.abbr});



// Initialize tool tip
    
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -70])
      .style("display", "block")
      .html(function(d) {
        return (`<p style="color:white; 
        background-color: Black; 
        margin-left: 10px; 
        padding: 5px;
        border-radius: 5px;">
        ${d.state}<br>
        Poverty: ${d.poverty} %<br>
        Healthcare: ${d.healthcare} %</p>`);
      });

// Create tooltip in the chart
  
    chartGroup.call(toolTip);

// Create event listeners to display and hide the tooltip
    
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
  
// On mouseout event

      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

// Create axes labels

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 5)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
      .attr("class", "axisText")
      .text("Poverty (%)");
  });
