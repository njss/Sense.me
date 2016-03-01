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

                var tip;

                //remove previous data and chart
                var svg = d3.select("#parallelcoordinates");
                svg.selectAll("*").remove();


               tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([0, 0])
                .html(function (d) {
                  var color = "#FF6500"
                    return "<p><strong>userName: </strong> <span style='color:" + color + "'>" + d.row.userName + "</span></p>"
                    + "<p><strong>age: </strong> <span style='color:" + color + "'>" + d.row.age + "</span></p>"
                    + "<p><strong>experiment: </strong> <span style='color:" + color + "'>" + d.row.experiment + "</span></p>"
                    + "<p><strong>trial: </strong> <span style='color:" + color + "'>" + d.row.trial + "</span></p>"
                    + "<p><strong>aoi: </strong> <span style='color:" + color + "'>" + d.row.aoi + "</span></p>"
                    + "<p><strong>duration: </strong> <span style='color:" + color + "'>" + d.row.durationAoi + "</span></p>"
                    ;

                });


                       // load csv file and create the chart
                var colorGen = d3.scale.ordinal()
                  .range(["#a6cee3","#1f78b4","#b2df8a","#33a02c",
                          "#fb9a99","#e31a1c","#fdbf6f","#ff7f00",
                          "#cab2d6","#6a3d9a","#ffff99","#b15928"]);



                var dimensions;
                var numberPattern = /\d+/g;

                //TODO: This should be dynamic
                var users = ["user1", "user2", "user3"];

                //Start
                var margin = {top: 30, right: 40, bottom: 10, left: 10},
                    width = 1350 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

                var x = d3.scale.ordinal().rangePoints([0, width], 1),
                    y = {},
                    dragging = {};

                var line = d3.svg.line()
                .interpolate("monotone");
                //.interpolate("basis");
                var axis = d3.svg.axis().orient("left"),
                    background,
                    foreground;


                var svg = d3.select("#parallelcoordinates").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                  svg.call(tip);

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

                   // Add a legend.
                    var legend = svg.selectAll("g.legend")
                        .data(users)
                      .enter().append("svg:g")
                        .attr("class", "legend")
                        .attr("transform", function(d, i) { return "translate(" + (width - 40) + "," + (i * 20 + 100) + ")"; });

                    legend.append("svg:line")
                        .attr("class", String)
                        .attr("x2", 8);

                    legend.append("svg:text")
                        .attr("x", 12)
                        .attr("dy", ".31em")
                        .text(function(d) { return d; });


                  // linear color scale
                  var blue_to_brown = d3.scale.linear()
                    .domain([1, 2])
                    .range(["steelblue", "#881336"])
                    .interpolate(d3.interpolateLab);



                  var tempLineColor;

                  // Add blue foreground lines for focus.
                  foreground = svg.append("g")
                      .attr("class", "foreground")
                    .selectAll("path")
                      .data(root)
                    .enter().append("path")
                      .attr("d", path)
                      .style("stroke", function(d) {
                        var colorClass = blue_to_brown(d.row.userName);
                        return  colorClass;/*"user" + d.row.userName;*/  /*color*/})
                          .on("mouseover", function(d){
                             tempLineColor = this.style.stroke;

                            tip.show(d);

                            d3.select(this).transition().duration(100)
                                .style({'stroke' : '#FFA500'});

                        })
                        .on("mousemove", function(){
                        var coordinates = [0, 0];
                        coordinates = d3.mouse(this);
                        var x = coordinates[0];
                        var y = coordinates[1];
                          return tip.style("top", (width + y + 30)+"px").style("left",(height + x + 595)+"px");})
                        .on("mouseout", function(d){

                          tip.hide(d);

                          var colorClass = blue_to_brown(d.row.userName);
                          d3.select(this).transition().duration(100)
                          .style({'stroke': colorClass })

                            });

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

                          //new
                          this.__dragged__ = true;
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

                            //new
                            if (!this.__dragged__)
                            {
                              // no movement, invert axis
                              var extent = invert_axis(d);

                            } else {
                              // reorder axes
                              d3.select(this).transition().attr("transform", "translate(" + x(d) + ")");

                              var extent = y[d].brush.extent();
                            }

                          //New
                          // TODO required to avoid a bug
                          x.domain(dimensions);
                          update_ticks(d, extent);
                        }));

                  // Add an axis and title.
                  g.append("g")
                      .attr("class", "axis")
                      .each(function(d) {
                        d3.select(this).call(axis.scale(y[d]));
                          })
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



function invert_axis(d) {
  // save extent before inverting
  if (!y[d].brush.empty()) {
    var extent = y[d].brush.extent();
  }
  if (y[d].inverted == true) {
    y[d].range([height, 0]);
    d3.selectAll('.text')
      .filter(function(p) { return p == d; })
      .style("text-decoration", null);
    y[d].inverted = false;
  } else {
    y[d].range([0, height]);
    d3.selectAll('.text')
      .filter(function(p) { return p == d; })
      .style("text-decoration", "underline");
    y[d].inverted = true;
  }
  return extent;
}

// transition ticks for reordering, rescaling and inverting
function update_ticks(d, extent) {
  // update brushes
  if (d) {
    var brush_el = d3.selectAll(".brush")
        .filter(function(key) { return key == d; });
    // single tick
    if (extent) {
      // restore previous extent
      brush_el.call(y[d].brush = d3.svg.brush().y(y[d]).extent(extent).on("brush", brush));
    } else {
      brush_el.call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush));
    }
  } else {
    // all ticks
    d3.selectAll(".brush")
      .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
  }

  //brush_count++;

  //show_ticks();

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

