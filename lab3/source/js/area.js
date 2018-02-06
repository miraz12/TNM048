/*
  Author: Kahin Akram Hassan
  Date: Jan 31 2018
*/

function area(data) {

  var div = "#area";

  var parentWidth = $(div).parent().width();
  var margin = {top: 10, right: 10, bottom: 80, left: 40},
        margin2 = {top: 500 - 50, right: 40, bottom: 20, left: 40},

        width = parentWidth - margin.left - margin.right;
        height = 500 - margin.top - margin.bottom;
        height2 = 500 - margin2.top - margin2.bottom;


  //Create variable for parsing the time axis

  //Create scales for the axis x,x2, y,y2

  //Sets the axes

  //Assigns the brush to the small chart's x axis

  //Creates the big chart
  var area = d3.area()

  //Creates the small chart
  var area2 = d3.area()

  //Assings the svg canvas to the area div
  var svg =

  //Defines clip region

  //Set the domains for the 4 axes


  //Defines the focus area
  var focus = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Defines the context area
 var context = svg.append("g")
          .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


  //Initializes the axis domains for the big chart
  focus.append("path")

  focus.append("g")

  focus.append("g")

  //Initializes the axis domains for the small chart
  context.append("path")

  context.append("g")

  context.append("g")




//Method for brushing
function brush() {

  var s = d3.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));
  focus.select(".area").attr("d", area);
  focus.select(".axis--x").call(xAxis);

  //Call the filterTime function in map

}

}
