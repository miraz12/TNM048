/*
  Author: Kahin Akram Hassan
  Date: Jan 31 2018
*/

function map(data, world_map_json){

  var div = '#map';
  var parentWidth = $(div).parent().width();
  var margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = parentWidth - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

  var curr_mag = 4;
  var format = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");

  //Sets the colormap
  var colors = colorbrewer.Set3[10];

  var filterdData = data;

  var timeExt = d3.extent(data.map(function (d) {
    return format(d.time);
  }));
  //initialize zoom
  var zoom = d3.zoom()
    .scaleExtent([1, 10])
    .on('zoom', move);

  //initialize tooltip
  var tooltip = d3.select(div).append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  var projection = d3.geoMercator()
      .center([60, 40])
      .scale(120);

  var path = d3.geoPath()
      .projection(projection);

  var svg = d3.select(div).append("svg")
      .attr("width", width)
      .attr("height", height)
      .call(zoom);

  var g = svg.append("g");

  //Formats the data in a feature collection trougth geoFormat()
  var geoData = {type: "FeatureCollection", features: geoFormat(data)};

  var countries_features = topojson.feature(world_map_json,
        world_map_json.objects.countries).features;

  var countries = g.selectAll(".country").data(countries_features);

  draw(countries);
  drawPoints()

  function draw(countries){
    //Add code here.

      countries.enter()
          .insert("path")
          .attr("class", "country")
          .attr("d", path)
          .attr("id", function (d) {
              return d.id;
          })
          .attr("title", function (d) {
              return d.properties.name
          });
          //.style("fill", function (d) { return d.properties.color; });
  }

  //Formats the data in a feature collection
  function geoFormat(array) {
      var data = [];

      array.map(function (d, i) {
          data.push({
            //Create five variables called :
            //id,type,geometry,mag and place and assign the corresponding value to is
              "id": d.id,
              "type": "Feature", 
              "geometry": {
                  "type": "Point",
                  "coordinates": [
                      d.lon,
                      d.lat
                  ]
              },
              "depth": d.depth,
              "mag": d.mag, 
              "place": d.place
            //geometry is an object and has two other attributes called coordinates and type.
          });
      });
      return data;
  }

  //Draws the map and the points
  function drawPoints(){
      //draw point
    var point = g.selectAll(".point").data(geoData.features);
    point.enter().append("path")
          .attr("class", "point")
          .attr("d", path)
          .attr("d", path.pointRadius(function (d) {
              return d.mag / 2;
          }))
          .style("opacity", 0.1)
          .on("mousemove", function (d) {
              var cur_mag = d3.select("#slider").property("value");
              d3.select(this)
              .style('opacity',1.0)
              .style("stroke", 'red')
              printInfo(d);
          })
          .on('mouseout',function(d){
            d3.select(this)
            .style('opacity', 0.1)
            .style("stroke", 'none');

          });

  }
  //Calls the filtering function
  d3.select("#slider").on("input", function () {
      //Call filterMag function here with this.value and data
      filterMag(this.value);
  });


  //Filters data points according to the specified magnitude
  function filterMag(value) {
      filterdData = [];
      curr_mag = value;

      //adjusts the text on the range slider
      d3.select("#slider-value").text(curr_mag);
      d3.select("#slider").property("value", curr_mag);
      d3.selectAll(".point").data(data)
              .style("fill", "orange")
              .style("opacity", 0.3)
              .style("visibility", function (d) {
                //show if mag > curr_mag && tmpT between timeExt
                  var tmpT = format(d.time);
                  if (d.mag > curr_mag && timeExt[0] < tmpT && tmpT < timeExt[1])
                  {
                      //push to filterdData
                      filterdData.push(d);
                      return "visible";
                  }
                  else
                      return "hidden";

              });

  }

  //Filters data points according to the specified time window
  this.filterTime = function (value) {
      filterdData = [];
      timeExt = value;
      d3.selectAll(".point").data(data)
              .style("fill", "orange")
              .style("opacity", 0.3)
              .style("visibility", function (d) {
                  //push d to filterData only if mag is > curr_mag and tmpT is between timeExt
                    var tmpT = format(d.time);
                  if (value[0] < tmpT && tmpT < value[1] && d.mag > curr_mag)
                  {
                      //filterData here
                      
                      filterdData.push(d);
                      return "visible";
                  }
                  else
                      return "hidden";

              });

  };


  //Calls k-means function and changes the color of the points
  this.cluster = function () {
      //Get the value from the input form in index
      var k = document.getElementById("k").value;

      var filteredData = [];

      for (var i = 0; i < filterdData.length; i++) {
          var entry = {
              depth: filterdData[i].depth,
              mag: filterdData[i].mag
          }
          filteredData.push(entry);
      }

      //Call the kmeansRes on the filterdData with k clusters.
      var kmeansRes = kmeans(filteredData, k);

      var color = d3.scaleOrdinal(d3.schemeCategory20);

      d3.selectAll(".point").data(data)
          //Change style fill if id == in filterdData id
              .style("fill", function (d) {
                  for (var j = 0; j < filterdData.length; j++)
                  {
                      if (d.id == filterdData[j].id) {
                          //return colors for each assignment j
                          var tmpColor = color(kmeansRes.assignments[j]);
                          return tmpColor;
                      }
                  }

              });
  };


  function move() {
      g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
      g.attr("transform", d3.event.transform);
  }

  function printInfo(value) {
      var elem = document.getElementById('info');
      elem.innerHTML = "Place: " + value["place"] + " / Depth: " + value["depth"] + " / Magnitude: " + value["mag"] + "&nbsp;";
  }

}
