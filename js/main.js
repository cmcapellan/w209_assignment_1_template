var width = 800,
  height = 300,
  svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var margin = { top: 30, right: 30, bottom: 30, left: 40 },
  iwidth = width - margin.left - margin.right,
  iheight = height - margin.top - margin.bottom;

var gDrawing = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var xScale = d3.scaleTime().range([0, iwidth]);
var yScale = d3.scaleLinear().range([iheight, 0]);

function update(myData) {
  // Data parsing, in case you need it
  const parseDate = d3.timeParse("%m/%d/%Y");
  myData.forEach(d => d.start = parseDate(d.start));
  myData.forEach(d => d.end = parseDate(d.end));

  xScale.domain([
          d3.min(myData, d => d.start),
          d3.max(myData, d => d.start)
          ]);
  yScale.domain([3000, d3.max(myData, d => d.calories)]);

  var area = d3.area()
    .curve(d3.curveBasis)
    .x(d => xScale(d.start))
    .y0(d => yScale.range()[0])
    .y1(d => yScale(d.calories));
  
  gDrawing
    .append("path")
    .datum(myData)
    .attr("class", "area")
    .attr("d", area);

  var xAxis = gDrawing
    .append("g")
    .attr("transform", `translate(0,${iheight})`)
    .call(d3.axisBottom(xScale)
          .ticks(20)
          .tickFormat(function(date){
            if (d3.timeYear(date) < date) {
              return d3.timeFormat('%b')(date);
            } else {
              return d3.timeFormat('%b %Y')(date);
            }
          })
    )
    .append("text")
    .style("fill", "black")
    .style("font-size", "10pt")
    .text("Weeks")
    .attr("transform", `translate(${iwidth/2}, ${30})`);

  gDrawing
    .append("g")
    .call(d3.axisLeft(yScale))
    .append("text")
    .style("fill", "black")
    .style("font-size", "10pt")
    .text("Active Calories")
    .attr("transform", `translate(${100}, ${15})`);

    console.log("At the end of the callback")
}

d3.json("./data/active_calories_weekly.json", update);


