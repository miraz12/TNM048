/*
  Created: Jan 14 2018
  Author: Kahin Akram Hassan
*/

function sp(data) {

    this.data = data;
    var div = '#scatter-plot';

    var height = 500;
    var parentWidth = $(div).parent().width();
    var margin = { top: 20, right: 20, bottom: 60, left: 40 },
        width = parentWidth - margin.right - margin.left,
        height = height - margin.top - margin.bottom;

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var tooltip = d3.select(div).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    /* Task 2
      Initialize 4 (x,y,country,circle-size)
      variables and assign different data attributes from the data filter
      Then use domain() and extent to scale the axes

      x and y domain code here*/

    var scaleX = d3.scaleLinear()
        .domain(d3.extent(data, function (d)

        { return d.Household_income; }))
            .range([0, width]);

    var scaleY = d3.scaleLinear()
        .domain([50, 100])
        .range([height, 0]);

    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

        /* ~~ Task 3 Add the x and y Axis and title  ~~ */

    var circles = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .style("fill", function (d) {
            return color(d["Country"]);
        })
        .attr("cx", function (d) {
            var tmp = scaleX(d.Household_income);
            return tmp;
        })
        .attr("cy", function (d) {
            return scaleY(d.Self_reported_health);
        })
        .attr("r", function (d) {
            return ((d.Life_satisfaction - 40) / Math.PI) * 0.7;
        })
        .attr("non_brushed", 0);

    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function (d) {
            return d.Country;
        })
        .attr("x", function (d) {
            var tmp = scaleX(d.Household_income);
            return tmp;
        })
        .attr("y", function (d) {
            return scaleY(d.Self_reported_health);
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "black");



    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(scaleX));

    svg.append("g")
        .attr("transform", "translate(0," + 0 + ")")
        .call(d3.axisLeft(scaleY));


    // text label for the x axis
    svg.append("text")
        .attr("transform",
        "translate(" + (width / 2) + " ," +
        (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Household income");

    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Self reported health"); 

        /* ~~ Task 4 Add the scatter dots. ~~ */


        /* ~~ Task 5 create the brush variable and call highlightBrushedCircles() ~~ */


    var brush = d3.brush()
        .extent([[0, 0], [width, height]])
        .on("brush", highlightBrushedCircles);


    svg.append("g")
        .attr("class", "brush")
        .call(brush)


         //highlightBrushedCircles function
         function highlightBrushedCircles() {
             if (d3.event.selection != null) {
                 // revert circles to initial style
                 circles.attr("class", "non_brushed");
                 var brush_coords = d3.brushSelection(this);
                 // style brushed circles
                   circles.filter(function (){
                            var cx = d3.select(this).attr("cx");
                            var cy = d3.select(this).attr("cy");
                            return isBrushed(brush_coords, cx, cy);
                  })
                  .attr("class", "brushed");
                   var d_brushed = d3.selectAll(".brushed").data();

                   var count = [];
                   d_brushed.forEach(function (d) { count.push(d.Country); });


                   /* ~~~ Call pc or/and map function to filter ~~~ */
                   pc.selectLine(count);
                   map.selectCountry(count);
             }
         }//highlightBrushedCircles
         function isBrushed(brush_coords, cx, cy) {
              var x0 = brush_coords[0][0],
                  x1 = brush_coords[1][0],
                  y0 = brush_coords[0][1],
                  y1 = brush_coords[1][1];
             return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
         }//isBrushed



         //Select all the dots filtered
         this.selecDots = function(value){
             svg.selectAll("circle").data(data)
                 .filter(function (d) {
                     return value.includes(d.Country);
                 })
                 .attr("class", "brushed");


             svg.selectAll("circle").data(data)
                 .filter(function (d) {
                     return !value.includes(d.Country);
                 })
                 .attr("class", "non_brushed");

         };


}//End
