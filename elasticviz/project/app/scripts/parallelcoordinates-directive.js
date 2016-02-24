(function () {
  'use strict';
  angular.module('FacetedUI')
    .directive('parallelcoordinatesGuiItem', [
      function () {
        return {
          templateUrl: 'scripts/parallelcoordinates.html',
          replace: true,
          scope: {
            bind: '=',
            confirmAction: '&'
          },
          link: function (scope, element, attrs, ctrl) {

            //var client = new elasticsearch.Client();

            //scope.buckets; // these are the buckets passed in as attribute

            // here you can do more things to initialise the 'scope' of your
            // directive

            // e.g. some extra value
            scope.mytext = 'parallelcoordinates';



            scope.$watch('bind', function (data) {

              if (data) {
                // D3 code goes here.
                var root = createChildNodes(data);

                
                //remove previous data and chart
                var svg = d3.select("#parallelcoordinates");
                svg.selectAll("*").remove();

                       // load csv file and create the chart
                var colorgen = d3.scale.ordinal()
                  .range(["#a6cee3","#1f78b4","#b2df8a","#33a02c",
                          "#fb9a99","#e31a1c","#fdbf6f","#ff7f00",
                          "#cab2d6","#6a3d9a","#ffff99","#b15928"]);

                var color = function(d) { 
                  return colorgen(d.group); };


                var dimensions;                
                var numberPattern = /\d+/g;

                //Start
                var margin = {top: 30, right: 10, bottom: 10, left: 10},
                    width = 1400 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

                var x = d3.scale.ordinal().rangePoints([0, width], 1),
                    y = {},
                    dragging = {};

                var line = d3.svg.line(),
                    axis = d3.svg.axis().orient("left"),
                    background,
                    foreground;

                var svg = d3.select("#parallelcoordinates").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                  

                  //Data Start
                  // Extract the list of dimensions and create a scale for each.
                  x.domain(dimensions = d3.keys(root[0].row).filter(function(d) {
                    return d != "duration" 
                    && d != "datetime" && d != "datetimezero" 
                    && (y[d] = d3.scale.linear()
                        .domain(d3.extent(root, function(p) { 
                      
               
                        //console.log(d + " :d: " + p.row[d]);
                     

                            return +p.row[d]; 
                          
                        }))
                        .range([height, 0]));
                  }));

                  // Add grey background lines for context.
                  background = svg.append("g")
                      .attr("class", "background")
                    .selectAll("path")
                      .data(root)
                    .enter().append("path")
                      .attr("d", path);

                  // Add blue foreground lines for focus.
                  foreground = svg.append("g")
                      .attr("class", "foreground")
                    .selectAll("path")
                      .data(root)
                    .enter().append("path")
                      .attr("d", path);

                  // Add a group element for each dimension.
                  var g = svg.selectAll(".dimension")
                      .data(dimensions)
                    .enter().append("g")
                      .attr("class", "dimension")
                      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
                      .call(d3.behavior.drag()
                        .origin(function(d) { return {x: x(d)}; })
                        .on("dragstart", function(d) {
                          dragging[d] = x(d);
                          background.attr("visibility", "hidden");
                        })
                        .on("drag", function(d) {
                          dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                          foreground.attr("d", path);
                          dimensions.sort(function(a, b) { return position(a) - position(b); });
                          x.domain(dimensions);
                          g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
                        })
                        .on("dragend", function(d) {
                          delete dragging[d];
                          transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                          transition(foreground).attr("d", path);
                          background
                              .attr("d", path)
                            .transition()
                              .delay(500)
                              .duration(0)
                              .attr("visibility", null);
                        }));

                  // Add an axis and title.
                  g.append("g")
                      .attr("class", "axis")
                      .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
                    .append("text")
                      .style("text-anchor", "middle")
                      .attr("y", -9)
                      .text(function(d) { return d; });

                  // Add and store a brush for each axis.
                  g.append("g")
                      .attr("class", "brush")
                      .each(function(d) {
                        d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
                      })
                    .selectAll("rect")
                      .attr("x", -8)
                      .attr("width", 16);


                function position(d) {
                  var v = dragging[d];
                  return v == null ? x(d) : v;
                }

                function transition(g) {
                  return g.transition().duration(500);
                }

                // Returns the path for a given data point.
                function path(d) {
                  return line(dimensions.map(function(p) { 

                    return [position(p), y[p](d.row[p])]; 
                  
                  }));
                }

                function brushstart() {
                  d3.event.sourceEvent.stopPropagation();
                }

                // Handles a brush event, toggling the display of foreground lines.
                function brush() {
                  var actives = dimensions.filter(function(p) { 
                    return !y[p].brush.empty(); }),
                      extents = actives.map(function(p) { 
                        return y[p].brush.extent(); });
                  foreground.style("display", function(d) {
                    return actives.every(function(p, i) {
                      return extents[i][0] <= d.row[p] && d.row[p] <= extents[i][1];
                    }) ? null : "none";
                  });
                }


                function createChildNodes(dataObj) {
                  var root = {};

                  root.key = "Eye Data";

                  root = dataObj.entries;

                  root.forEach(function (d) {
                    d.row = d.main._source;
                    d.main = null;
                  });                

                  return root;
                }    
              }
            });

          }
        }
      }]
    );
}());

