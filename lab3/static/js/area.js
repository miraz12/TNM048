/*
  Author: Kahin Akram Hassan
  Date: Jan 31 2018
*/

function area(data) {

    var div = "#area";

    var parentWidth = $(div).parent().width();
    var margin = { top: 10, right: 10, bottom: 80, left: 40 },
        margin2 = { top: 500 - 50, right: 40, bottom: 20, left: 40 },

        width = parentWidth - margin.left - margin.right;
    height = 500 - margin.top - margin.bottom;
    height2 = 500 - margin2.top - margin2.bottom;


    //Create variable for parsing the time axis


    var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
    var x = d3.scaleTime().range([0, width]),
        x2 = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        y2 = d3.scaleLinear().range([height2, 0]);


    //Create scales for the axis x,x2, y,y2

    x.domain(d3.extent(data, function (d) { return parseTime(d.time); }));
    y.domain([d3.min(data, function (d) { return d.mag; }), d3.max(data, function (d) { return d.mag; })]);
    x2.domain(x.domain());
    y2.domain(y.domain());


  //Sets the axes

    var xAxis = d3.axisBottom(x),
        xAxis2 = d3.axisBottom(x2),
        yAxis = d3.axisLeft(y);


    //Assigns the brush to the small chart's x axis

    var brush = d3.brushX()
        .extent([[0, 0], [width, height2]])
        .on("brush end", brushed);

    var zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", zoomed);

  //Creates the big chart
    var area = d3.area()
        .curve(d3.curveMonotoneX)
        .x(function (d) { return x(parseTime(d.time)); })
        .y0(height)
        .y1(function (d) { return y(d.mag); });


  //Creates the small chart
    var area2 = d3.area()
        .curve(d3.curveMonotoneX)
        .x(function (d) { return x2(parseTime(d.time)); })
        .y0(height2)
        .y1(function (d) { return y2(d.mag); });

  //Assings the svg canvas to the area div
  var svg = d3.select(div).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom + 30)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  //Defines clip region

  svg.append("defs").append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height);

  //Set the domains for the 4 axes


  //Defines the focus area
  var focus = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Defines the context area
  var context = svg.append("g")
      .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

  //Initializes the axis domains for the big chart
  focus.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area);

  focus.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  focus.append("g")
      .attr("class", "axis axis--y")
      //.attr("transform", "translate(0," + 0 + ")")
      .call(yAxis);

  //Initializes the axis domains for the small chart
  context.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area2);

  context.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

  context.append("g")
      .attr("class", "brush")
      .call(brush)
      .call(brush.move, x.range());


  svg.append("rect")
      .attr("class", "zoom")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoom)
//Method for brushing
function brush() {

  var s = d3.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));
  focus.select(".area").attr("d", area);
  focus.select(".axis--x").call(xAxis);

  //Call the filterTime function in map

  }

function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    var s = d3.event.selection || x2.range();
    x.domain(s.map(x2.invert, x2));
    focus.select(".area").attr("d", area);
    focus.select(".axis--x").call(xAxis);
    svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
        .scale(width / (s[1] - s[0]))
        .translate(-s[0], 0));

    map1.filterTime(x.domain());

}

function zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    var t = d3.event.transform;
    x.domain(t.rescaleX(x2).domain());
    focus.select(".area").attr("d", area);
    focus.select(".axis--x").call(xAxis);
    context.select(".brush").call(brush.move, x.range().map(t.invertX, t));

    map1.filterTime(x.domain());
}

}
