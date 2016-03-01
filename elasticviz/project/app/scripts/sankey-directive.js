(function () {
  'use strict';
  angular.module('FacetedUI')
    .directive('sankeyGuiItem', [
      function () {
        return {
          templateUrl: 'scripts/sankey.html',
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
            scope.mytext = 'sankey';

            var aoisConfig2 = [
              {"exp": "1", "trial": "1", "aoi": "0", "url": "14.TS-NI.png", "name": "aoi0", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "1", "url": "15.Sum-Ni.png", "name": "aoi1", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "2", "url": "16.Ni-Ni.png", "name": "aoi2", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "3", "url": "34.Ni-Sum.png", "name": "aoi3", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "4", "url": "69.Fe-Ni.png", "name": "aoi4", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "5", "url": "40.TS-Ni.png", "name": "aoi5", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "6", "url": "38.Ni-Ni.png", "name": "aoi6", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "7", "url": "35.TS-Sum.png", "name": "aoi7", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "8", "url": "70.Co-Ni.png", "name": "aoi8", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "9", "url": "71.TS-Ni.png", "name": "aoi9", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "10", "url": "169.Sum-TS.png", "name": "aoi10", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "11", "url": "170.Ni-TS.png", "name": "aoi11", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "12", "url": "1.png", "name": "aoi12", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "13", "url": "2.png", "name": "aoi13", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "14", "url": "3.png", "name": "aoi14", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "15", "url": "4.png", "name": "aoi15", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "16", "url": "5.png", "name": "aoi16", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "17", "url": "6.png", "name": "aoi17", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "18", "url": "7.png", "name": "aoi18", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "19", "url": "8.png", "name": "aoi19", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "20", "url": "9.png", "name": "aoi20", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "21", "url": "10.png", "name": "aoi21", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "22", "url": "11.png", "name": "aoi22", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "23", "url": "12.png", "name": "aoi23", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "24", "url": "422.TS-TS.png", "name": "aoi24", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "25", "url": "41.Fe-Ni.png", "name": "aoi25", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "26", "url": "39.Fe-Ni.png", "name": "aoi26", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "27", "url": "29.Sum-TS.png", "name": "aoi27", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "28", "url": "27.Ni-TS.png", "name": "aoi28", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "29", "url": "24409.Depth-WBD.png", "name": "aoi29", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "30", "url": "157.Fe-Fe.png", "name": "aoi30", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "31", "url": "154.Co-Fe.png", "name": "aoi31", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "32", "url": "153.Ni-Fe.png", "name": "aoi32", "duration": 0},
              {
                "exp": "1",
                "trial": "1",
                "aoi": "33",
                "url": "13546.Turbidity-Density.png",
                "name": "aoi33",
                "duration": 0
              },
              {"exp": "1", "trial": "1", "aoi": "34", "url": "149.Co-Ni.png", "name": "aoi34", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "35", "url": "148.Fe-Ni.png", "name": "aoi35", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "36", "url": "147.Ni-Ni.png", "name": "aoi36", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "37", "url": "145.Co-Ni.png", "name": "aoi37", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "38", "url": "144.Fe-Ni.png", "name": "aoi38", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "39", "url": "13551.Sal-Turbidity.png", "name": "aoi39", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "40", "url": "sketch.png", "name": "aoi sketch", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "41", "url": "settings.png", "name": "aoi settings", "duration": 0},
              {"exp": "1", "trial": "1", "aoi": "42", "url": "offscreen.png", "name": "aoi offscreen", "duration": 0}
            ];


            scope.$watch('bind', function (data) {

              if (data) {
                // D3 code goes here.
                var root = createChildNodes(data);

                // Create nodes for experiment 1, trial 1, user 1
                var root = createChildNodes(data);


                //TODO: refactor to include all experiments and all trials and all users
                //Right now is just handling experiment 1, trial 1, user 1
                function createChildNodes(dataObj) {
                  var rootFinal = [];

                  rootFinal.nodes = [];
                  rootFinal.nodes = JSON.parse(JSON.stringify(aoisConfig2));

                  //source to target
                  rootFinal.links = [];

                  var count = 0;


                  var tempData = [];

                  dataObj.entries.forEach(function (d) {
                    if (d.main._source.trial == 1 && d.main._source.userName == 1 && d.main._source.experiment == 1) {
                      tempData.push(d);
                    }
                  });

                  for (var i = 0; i < tempData.length; i++) {

                    if (i != tempData.length - 1) {

                      var element = new Object();

                      element.source = tempData[i].main._source.aoi;
                      element.target = tempData[i + 1].main._source.aoi;
                      element.value = tempData[i].main._source.durationAoi;

                      if (element.source != element.target) {
                        rootFinal.links.push(element);
                      }
                    }
                    // else
                    // {
                    //   var element =  new Object();
                    //   element.source = dataObj.entries[i].main._source.aoi;
                    //   element.target = dataObj.entries[i].main._source.aoi;
                    //   element.value = dataObj.entries[i].main._source.durationAoi;

                    //   rootFinal.links.push(element);
                    // }
                    count++;
                  }

                  rootFinal.links.forEach(function (d) {
                    if (d.source > d.target) {
                      var tempSource = d.source;

                      d.source = d.target;
                      d.target = tempSource;
                    }

                  });

                  return rootFinal;
                }

                var tip;

                //remove previous data and chart
                var svg = d3.select("#sankey");
                svg.selectAll("*").remove();

                var dimensions;
                var numberPattern = /\d+/g;


                var margin = {top: 1, right: 1, bottom: 6, left: 1},
                  width = 1200 - margin.left - margin.right,
                  height = 800 - margin.top - margin.bottom;

                var formatNumber = d3.format(",.0f"),
                  format = function (d) {
                    return formatNumber(d) + " ms";
                  },
                  //color = d3.scale.category20b();

                 //color = d3.scale.ordinal()
                 // .domain(["foo", "bar", "baz"])
                 // .range(["#fff","#000","#333"]);

                 color = d3.scale.linear()
                  .domain([0, 2000])
                  .range(["#9AC0CD", "steelblue"])
                  .interpolate(d3.interpolateLab);

                var svg = d3.select("#sankey").append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var sankey = d3.sankey()
                  .nodeWidth(15)
                  .nodePadding(10)
                  .size([width, height]);

                var path = sankey.link();

                sankey
                  .nodes(root.nodes)
                  .links(root.links)
                  .layout(32);

                var link = svg.append("g").selectAll(".link")
                  .data(root.links)
                  .enter().append("path")
                  .attr("class", "link")
                  .attr("d", path)
                  .style("stroke-width", function (d) {
                    return Math.max(1, d.dy);
                  })
                  .sort(function (a, b) {
                    return b.dy - a.dy;
                  });

                link.append("title")
                  .text(function (d) {
                    return d.source.name + " → " + d.target.name + "\n" + format(d.value);
                  });

                var node = svg.append("g").selectAll(".node")
                  .data(root.nodes)
                  .enter().append("g")
                  .attr("class", "node")
                  .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                  })
                  .call(d3.behavior.drag()
                    .origin(function (d) {
                      return d;
                    })
                    .on("dragstart", function () {
                      this.parentNode.appendChild(this);
                    })
                    .on("drag", dragmove));

                node.append("rect")
                  .attr("height", function (d) {
                    return d.dy;
                  })
                  .attr("width", sankey.nodeWidth())
                  .style("fill", function (d) {
                    //return d.color = color(d.name.replace(/ .*/, ""));
                    return d.color = color(d.value);
                  })
                  .style("stroke", function (d) {
                    return d3.rgb(d.color).darker(2);
                  })
                  .append("title")
                  .text(function (d) {
                    return d.name + "\n" + format(d.value);
                  });

                node.append("text")
                  .attr("x", -6)
                  .attr("y", function (d) {
                    return d.dy / 2;
                  })
                  .attr("dy", ".35em")
                  .attr("text-anchor", "end")
                  .attr("transform", null)
                  .text(function (d) {
                    return d.name;
                  })
                  .filter(function (d) {
                    return d.x < width / 2;
                  })
                  .attr("x", 6 + sankey.nodeWidth())
                  .attr("text-anchor", "start");

                function dragmove(d) {
                  d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
                  sankey.relayout();
                  link.attr("d", path);
                }


              }
            });

          }
        }
      }]
    );
}());

