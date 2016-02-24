(function () {
  'use strict';
  angular.module('FacetedUI')
    .directive('datelinediagramGuiItem', [
      function () {
        return {
          templateUrl: 'scripts/datelinediagram.html',
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
            scope.mytext = 'datelinediagram';

            var numberPattern = /\d+/g;


            scope.$watch('bind', function (data) {

              if (data) {

                var json = createChildNodes(data);

                //Node types: fixed, hasAnswer, free, isAnswer, both.
                //Node Links: answeredby
                var tipDateline;

                function createChildNodes(dataObj) {
                  var root = {};
                  var graph = {};

                  root.key = "Eye Data";

                  root.children = dataObj.entries;

                  //sources
                  var count = 0;

                  // root.children[0].main.trials.buckets[0].aois.buckets.forEach(function (d) {
                  //     d.source = parseInt(d.key.match(numberPattern));
                  // });

                  // //targets
                  // count = 0;

                  // for (var i = 0; i < root.children[0].main.trials.buckets[0].aois.buckets.length; i++) {
                  //   if (i != root.children[0].main.trials.buckets[0].aois.buckets.length - 1) {
                  //     root.children[0].main.trials.buckets[0].aois.buckets[i].target = root.children[0].main.trials.buckets[0].aois.buckets[i + 1].key.match(numberPattern);
                  //     //root.children[0].main.trials.buckets[0].aois.buckets[i].target.duration = root.children[0].main.trials.buckets[0].aois.buckets[i + 1].aoiDuration.buckets[0].key;
                  //     root.children[0].main.trials.buckets[0].aois.buckets[i].target.x = root.children[0].main.trials.buckets[0].aois.buckets[i + 1].x;
                  //     root.children[0].main.trials.buckets[0].aois.buckets[i].target.y = root.children[0].main.trials.buckets[0].aois.buckets[i + 1].y;
                  //   }
                  //   else {
                  //     root.children[0].main.trials.buckets[0].aois.buckets[i].target = root.children[0].main.trials.buckets[0].aois.buckets[i].key.match(numberPattern);
                  //     //root.children[0].main.trials.buckets[0].aois.buckets[i].target.duration = root.children[0].main.trials.buckets[0].aois.buckets[i].aoiDuration.buckets[0].key;
                  //     root.children[0].main.trials.buckets[0].aois.buckets[i].target.x = root.children[0].main.trials.buckets[0].aois.buckets[i].x;
                  //     root.children[0].main.trials.buckets[0].aois.buckets[i].target.y = root.children[0].main.trials.buckets[0].aois.buckets[i].y;
                  //   }
                  // }

                  var object = root.children[0].main.trials.buckets[0];

                    //       //sort nodes by aoi
                    // object.aois.buckets.sort(function (a, b) {
                    //   return a.aoiDate.buckets[0].key - b.aoiDate.buckets[0].key;
                    // });

                  graph.nodes = new Array();

                  //create nodes
                  for (var i = 0; i < root.children[0].main.trials.buckets[0].aois.buckets.length; i++) {
                    graph.nodes[i] = new Object();
                    graph.nodes[i].date = object.aois.buckets[i].key_as_string;
                    graph.nodes[i].duration = object.aois.buckets[i].durationAoi.buckets[0].key;
                    graph.nodes[i].id = i;
                    graph.nodes[i].type = "fixed";
                    graph.nodes[i].name = object.aois.buckets[i].aoiDate.buckets[0].key;
                    if (i==0)
                    {
                      graph.nodes[i].from = "R";
                    }
                    if (i==root.children[0].main.trials.buckets[0].aois.buckets.length-1)
                    {
                      graph.nodes[i].from = "F";
                    }
                    else
                    {
                      graph.nodes[i].from = parseInt(object.aois.buckets[i].aoiDate.buckets[0].key);
                    }
                  }

                  graph.links = new Array();

                  //create links
                  for (var i = 0; i < graph.nodes.length-1; i++) {                    
                      graph.links[i] = new Object();
                      graph.links[i].source = parseInt(graph.nodes[i].id);
                      graph.links[i].target = parseInt(graph.nodes[i+1].id);
                      graph.links[i].type = "answeredby";
                    
                  }

                  return graph;
                }

                function loadchart(div, graph) {
                  // pass in id of div where the svg will live and name/url of json data
                  var dayWidth = 70,
                    height = 200,
                    margin = {
                      top: 40,
                      right: 40,
                      bottom: 15,
                      left: 40
                    },
                    radius = 10;

                  // ctlx and ctly are the offsets for the control points for the Bezier curve.
                  //   ctly is subtracted from source and target, to place control point
                  //      above the source/target
                  //   ctlx is added to source and subtracted from target, to place control point
                  //      so as to flatten the curve slightly
                  var ctlx = 10;
                  var ctly = 35;


                  var line = d3.svg.line()

                  var earliest = new Date(graph.nodes[0].date);
                  // TODO discover latest by looking rather than assuming the nodes are sorted
                  var latest = new Date(graph.nodes[graph.nodes.length - 1].date);
                  // number of days in the data set ...
                  //var interval = ((latest - earliest) / 1000 / 60 / 60 / 24 + 1)*24*60;
                  var interval = ((latest - earliest) / 1000 / 60 / 60 / 24 + 1)*24;
                  // ... determines the width of the svg
                  var width = interval * dayWidth;

                  var svg = d3.select("#" + div)
                    .append("svg")
                    .attr("viewBox", "-10 40 1100 1100")
                    .attr("width", width)
                    .attr("height", height)
                    .attr('preserveAspectRatio', 'xMinYMin slice')
                    .append('g');

                  /************************
                   Scales and Axes
                   *************************/

                  var x = d3.time.scale()
                    .domain([earliest, d3.time.day.offset(latest, 1)])
                    .rangeRound([0, width - margin.left - margin.right]);
                   

                  var xAxisDays = d3.svg.axis()
                    .scale(x)
                    .orient('bottom')
                    .ticks(d3.time.hours, 1)
                    .tickFormat(d3.time.format("%H:%M %L"));
                    //.tickFormat(d3.time.format('%a %-e'))
                    //.tickSize(5)
                    //.tickPadding(8);

                  // var xAxisMonths = d3.svg.axis()
                  //   .scale(x)
                  //   .orient("bottom")
                  //   .ticks(d3.time.months, 1)
                  //   .tickFormat(d3.time.format("%B %Y"))
                  //   .tickSize(5, 0);

                  // svg.append('g')
                  //   .attr('class', 'x axis monthaxis')
                  //   .attr('transform', 'translate(0, ' + (height - margin.top - margin.bottom) + ')')
                  //   .attr('style', 'opacity: 0.1')
                  //   .call(xAxisMonths);
                  svg.append('g')
                    .attr('class', 'x axis dayaxis')
                    .attr('transform', 'translate(0, ' + (height - margin.top - margin.bottom) + ')')
                    .call(xAxisDays);

                  /************************
                   Links
                   *************************/

                  function curve(d) {
                    // Bezier curve
                    // we assume source is earlier than target or on same day
                    var c, upper, lower;
                    if (d.source.x == d.target.x) {
                      // same day - control points on right - need to start with upper
                      if (d.source.y < d.target.y) {
                        upper = d.source;
                        lower = d.target;
                      } else {
                        upper = d.target;
                        lower = d.source;
                      }
                      c = "M" + upper.x + "," + upper.y +
                        " C" + (upper.x + ctly) + "," + (upper.y - ctlx) +
                        " " + (lower.x + ctly) + "," + (lower.y + ctlx) +
                        " " + lower.x + "," + lower.y;
                    } else {
                      // different days - use ellipse
                      var dx = d.target.x - d.source.x,
                        dy = d.target.y - d.source.y,
                        dr = Math.sqrt(dx * dx + dy * dy);
                      c = "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " +
                        d.target.x + "," + d.target.y;
                    }
                    return c;
                  }

                  // Arrowheads
                  svg.append("svg:defs").selectAll("marker")
                    .data(["end"])
                    .enter().append("svg:marker")
                    .attr("id", String)
                    .attr("class", "arrowhead")
                    .attr("viewBox", "0 -5 10 10")
                    .attr("refX", 25)
                    .attr("refY", -1.5)
                    .attr("markerWidth", 8)
                    .attr("markerHeight", 8)
                    .attr("orient", "auto")
                    .append("svg:path")
                    .attr("d", "M0,-5L10,0L0,5");


                  //check this code
                  var link = svg.selectAll(".link")
                    .data(graph.links)
                    .enter().append("svg:path")
                    .attr("class", "link")
                    .attr("marker-end", "url(#end)");

                  /************************
                   Nodes
                   *************************/

                  // add fixed coords to nodes
                  var stackcounts = [];
                  

                  graph.nodes.forEach(function (node) {
                    // x is always over the sortdate
                    // y is stacked on any letters already on that date if the date is precise,
                    //   otherwise at top of graph to allow it to be pulled into position
                    node.x = x(new Date(node.date)) + (2 * radius);
                    if (node.type == "fixed" || "isAnswer") {
                      var previousLetters = (stackcounts['d' + node.date]) ? stackcounts['d' + node.date] : 0;
                      stackcounts['d' + node.date] = previousLetters + 1;
                      node.y = height - margin.bottom - margin.top - radius - 1 -
                        (previousLetters * radius * 2);
                      node.fixed = true;
                    } else {
                      // TODO offset x slightly
                      node.y = 0;
                    }
                  });

                  var node = svg.selectAll(".node")
                    .data(graph.nodes)
                    .enter().append("g")
                    .attr("class", "node");

                  var circle = node.append("svg:circle")
                    .attr('id', function (d) {
                      return "n" + d.id;
                    })
                    .attr('class', function (d) {
                      return "letter d" + d.date + " from" + d.from + " " +
                        ((d.type == "fixed" && d.duration < 350) ? "precise" : "notprecise");
                    })
                    .attr('r', radius)


                  // node.append("svg:title")
                  //     .text(function (d) {
                  //         return d.name;
                  //     });

                  tipDateline = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(function (d) {
                      return "<strong>AOI</strong> <span style='color:red'>" + d.name.match(numberPattern) + "</span>";
                    });


                  // text, centered in node, with white shadow for legibility
                  node.append("text")
                    .attr("text-anchor", "middle")
                    .attr("dy", radius / 2)
                    .attr("class", "shadow")
                    .text(function (d) {
                      
                      return d.name.match(numberPattern);
                    });
                  node.append("text")
                    .attr("text-anchor", "middle")
                    .attr("dy", radius / 2)
                    .text(function (d) {
                      
                      return d.name.match(numberPattern);
                    });

                  svg.call(tipDateline);

                  // on click, do something with id
                  // implement this in a function outside this block

                  node.on("click", function (d) {
                    itemclick(d);
                  });

                  node.on("mouseover", function (d, i) {
                    tipDateline.show(d);
                    highlightSPLOMgrid(d.id);
                  })
                  node.on("mouseout", function (d, i) {
                    tipDateline.hide(d);
                    d3.select("#highlightRect_arcdiagram").remove();
                  });    

                 // Generates a tooltip for SP grid based on selected ID
                  function highlightSPLOMgrid(id) {
                    var parentDiv = circle.node().parentNode.id;
                    var parentRef = parentDiv.substring(parentDiv.indexOf("_") + 1);

                    var cId = id;
                    var imageWidth = 150;       // width of SP image
                    var imageHeight = 100;      // height of SP image
                    var groupElement = d3.select("#gCellBorder_arcdiagram");
                    var groupNodes = groupElement.node();

                    //      if(cId < 40){
                    var spNode = groupNodes.children[cId];
                    var borderX = spNode.x;
                    var borderY = spNode.y;

                    groupElement.append("rect")
                      .attr("id", "highlightRect_arcdiagram")
                      .attr("x", borderX.baseVal.value)
                      .attr("y", borderY.baseVal.value)
                      .attr("width", imageWidth)
                      .attr("height", imageHeight)
                      .style("fill", "none")
                      .style("stroke", "red")
                      .style("stroke-width", 3);
                  }



                  // Resolves collisions between d and all other circles.
                  function collide(node) {
                    var r = radius + 8,
                      nx1 = node.x - r,
                      nx2 = node.x + r,
                      ny1 = node.y - r,
                      ny2 = node.y + r;
                    return function (quad, x1, y1, x2, y2) {
                      if (quad.point && (quad.point !== node)) {
                        var x = node.x - quad.point.x,
                          y = node.y - quad.point.y,
                          l = Math.sqrt(x * x + y * y),
                          r = radius + radius;
                        if (l < r) {
                          l = (l - r) / l * .5;
                          node.x -= x *= l;
                          node.y -= y *= l;
                          quad.point.x += x;
                          quad.point.y += y;
                        }
                      }
                      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                    };
                  }

                  /************************
                   Force and Tick
                   *************************/

                  var force = self.force = d3.layout.force()
                    .nodes(graph.nodes)
                    .links(graph.links)
                    .gravity(0)
                    .charge(0.1)
                    .distance(40)
                    .size([width, height])
                    .start()
                    .on("tick", tick);

                  function tick(e) {
                    // artificial gravity, based on node type
                    var k = 20 * e.alpha;
                    // graph.nodes.forEach(function (o, i) {
                    //     if (o.type == "isAnswer") // move right
                    //         o.x += k;
                    //     else if (o.type == "hasAnswer") // move left
                    //         o.x += -k;
                    //     else if (o.type == "free") // move up
                    //         o.y += -k;
                    // });

                    // handle collisions
                    var q = d3.geom.quadtree(graph.nodes),
                      i = 0,
                      n = graph.nodes.length;
                    while (++i < n) {
                      q.visit(collide(graph.nodes[i]));
                    }

                    node.attr("transform", function (d) {
                      return "translate(" + d.x + "," + d.y + ")";
                    });

                    // constrain to bounding box
                    node.attr("cx", function (d) {
                        return d.x = Math.max(15, Math.min(width - 15, d.x));
                      })
                      .attr("cy", function (d) {
                        return d.y = Math.max(15, Math.min(height - 15, d.y));
                      });

                    //check this code
                    link.attr("d", function (d) {
                      return curve(d);
                    });
                  }
                }

                //loadchart("datelinediagram", json);

              }
            });

          }
        }
      }]
    );
}());

