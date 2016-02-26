(function () {
  'use strict';
  angular.module('FacetedUI')
    .directive('arcdiagramGuiItem', [
      function () {
        return {
          templateUrl: 'scripts/arcdiagram.html',
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
            scope.mytext = 'arcdiagram';

            var numberPattern = /\d+/g;

            var aoisConfig = [
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
              {"exp": "1", "trial": "1", "aoi": "33", "url": "13546.Turbidity-Density.png", "name": "aoi33", "duration": 0},
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


            function getAoiFromConfig(aoi) {
              var aoiResult = 0;
              /*eslint-disable no-alert */
              for (var obj of aoisConfig) {
                /* eslint-enable no-alert */
                if (obj.aoi == aoi) {
                  //console.log(obj);
                  return obj;
                }
              }

              return -1;
            };



            var width = 1200;           // width of arc div
            var height = 620;
            var margin = 50;            // amount of margin around plot area
            var pad = margin / 3;       // actual padding amount
            var radiusArc = 4;             // fixed node radiusArc
            var yfixed = pad + radiusArc + 10;  // y position for all nodes

            var imageWidth = 150;       // width of SP image
            var imageHeight = 100;      // height of SP image
            var cellGroup;

            var currentSettingsID;
            var tip;          // tool tip

            var column = 8;
            var row = 5;
            var matrixGap = 30;

            //colorbrewer
            var classesNumber = 9;
            var palette = "Blues"; //"PuBuGn";
            var matrixNodes = [];


            scope.$watch('bind', function (data) {

              if (data) 
              {

                
                // function checkNodeExists(rootFinal, key)
                // {
                //   var FoundException = {};

                
                //     if (!rootFinal.nodes_rows.length == 0)
                //     {
                //       try {
                //         rootFinal.nodes_rows.forEach(function (d) 
                //         {
                //           if (d.key == key)
                //           {
                //             throw FoundException;                   
                //           }
                //         });
                //       } catch(e)
                //         {
                //           if (e==FoundException)
                //           {
                //             return true;
                //           }
                //         }
                //     }                  
                // }


                // function returnAOIIndice(rootFinal, key)
                // {
                //   var FoundException = {};

                
                //     for (var i=0; i<rootFinal.nodes_rows.length;i++)
                //     {
                //       if (rootFinal.nodes_rows[i].aoi== key)
                //         return i;
                //     }

                //     return -1;
                // }

                // Create nodes for experiment 1, trial 1, user 1
                var root = createChildNodes(data);


                //TODO: refactor to include all experiments and all trials and all users
                //Right now is just handling experiment 1, trial 1, user 1
                function createChildNodes(dataObj) {                  
                  var rootFinal =  new Array();

                  rootFinal.nodes_rows = new Array();
                  rootFinal.nodes_rows = JSON.parse(JSON.stringify(aoisConfig));

                  //rootFinal.nodes_rows =  aoisConfig.slice(0);                  
                                
                  //Nodes
                  dataObj.entries.forEach(function (d) {                   

                    var indice = d.main._source.aoi;
                                  
                    rootFinal.nodes_rows[indice].aoi = d.main._source.aoi;
                    //rootFinal.nodes_rows[indice].durationAoi = new Array();
                    rootFinal.nodes_rows[indice].duration += d.main._source.durationAoi;

                    // rootFinal.nodes_rows[indice].age = d.main._source.age;
                    // rootFinal.nodes_rows[indice].experiment = d.main._source.experiment;
                    // rootFinal.nodes_rows[indice].trial = d.main._source.trial;
                    // rootFinal.nodes_rows[indice].userName = d.main._source.userName;
                    // rootFinal.nodes_rows[indice].datetime = d.main._source.datetime;
                    // rootFinal.nodes_rows[indice].datetimezero = d.main._source.datetimezero;
                    // rootFinal.nodes_rows[indice].Xscreen = d.main._source.Xscreen;
                    // rootFinal.nodes_rows[indice].Yscreen = d.main._source.Yscreen;

                    rootFinal.nodes_rows[indice].x = 0;
                    rootFinal.nodes_rows[indice].y = 0;                   

                  });

                  //source to target
                  rootFinal.links_rows = new Array();

                  var count = 0;
                 
                  for (var i = 0; i < dataObj.entries.length; i++) {
                    if (i != dataObj.entries.length - 1) {
                      rootFinal.links_rows[count] = new Array();
                      rootFinal.links_rows[count].source = dataObj.entries[i].main._source.aoi;
                      rootFinal.links_rows[count].target = dataObj.entries[i+1].main._source.aoi;
                    }
                    else
                    {
                      rootFinal.links_rows[count] = new Array();
                      rootFinal.links_rows[count].source = dataObj.entries[i].main._source.aoi;
                      rootFinal.links_rows[count].target = dataObj.entries[i].main._source.aoi;
                    }
                    count++;
                  }

                  return rootFinal;
                }


                /* DRAW ARC DIAGRAM */

                function drawArcDiagram() {
                  currentSettingsID = "arcdiagram";

                  var svg = d3.select("#arcdiagram");
                  svg.selectAll("*").remove();

                  tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(function (d) {
                      //40 AOIS - after that take the name (ex: offscreen, sketch and settings)
                      // if(d.aoi < 40){
                      //   return "<strong>AOI</strong> <span style='color:red'>" + d.aoi + "</span>";
                      // }else{

                      if (d.aoi) {
                        return "<strong>AOI</strong> <span style='color:red'>" + d.aoi + "</span>";
                      }
                      else {
                        //Higlight of circle when hovering on image matrix for AOIS
                        return "<strong>AOI</strong> <span style='color:red'>" + d.aoi + "</span>";
                      }
                      //}
                    });

                  arcDiagram(data, root);
                }


                // Draws an arc diagram for the provided undirected graph
                function arcDiagram(data, graph) {

                  d3.select("#" + currentSettingsID)
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .style("text-align", "center")
                    .style("margin", "0 auto");

                  var divArc = d3.select("#" + currentSettingsID)
                    .append("div")
                    .attr("id", "divArc")
                    .attr("width", "100%")
                    .style("height", "100%");

                  // create svg image
                  var svg = divArc
                    .append("svg")
                    .attr("id", "svgArc_" + currentSettingsID)
                    .style("width", width)
                    .style("height", height)
                    .style("border", "1px solid black")
                    .style("margin", "auto");

                  svg.call(tip);

                  // create plot area within svg image
                  var plot = svg.append("g")
                    .attr("id", "gArc_" + currentSettingsID)
                    .attr("transform", "translate(" + pad + ", " + pad + ")");

                  //fix graph links to map to objects instead of indices
                  graph.links_rows.forEach(function (d, i) {
                            d.source = isNaN(d.source) ? d.source : graph.nodes_rows[d.source];
                            d.target = isNaN(d.target) ? d.target : graph.nodes_rows[d.target];
                        });


                  // must be done AFTER links are fixed
                  linearLayout(graph.nodes_rows);

                  // draw links first, so nodes appear on topck

                  drawLinks(graph.links_rows);

                  // draw nodes last
                  drawNodes(graph.nodes_rows);

                  // reset height
                  var element = document.getElementById('gArc_' + currentSettingsID);
                  var gHeight = element.getBoundingClientRect().height + 30;
                  var svgHeight = d3.select("#svgArc_" + currentSettingsID).node().height.baseVal.value;
                  if ((svgHeight - gHeight) > 100)
                    d3.select("#svgArc_" + currentSettingsID).node().style.height = gHeight;

                  // draw scatterplot matrix (get dataroconfig)
                  //drawSPmatrix(graph.children[0].main.trials.buckets[0].aois.buckets);
                  drawSPmatrix(data, graph.nodes_rows);
                }

                // Layout nodes linearly, sorted by group
                function linearLayout(nodes) {

                  // used to scale node index to x position
                  var xscale = d3.scale.linear()
                    .domain([0, nodes.length - 1])
                    .range([radiusArc, width - margin - radiusArc]);

                  // calculate pixel location for each node
                  nodes.forEach(function (d, i) {
                    d.x = xscale(i);
                    d.y = yfixed;
                    //d.duration = d.durationAoi;
                  });
                }

                // Draws nodes on plot
                function drawNodes(nodes) {
                  // used to assign nodes color by group
                  var color = d3.scale.category20();

                  var colors = colorbrewer[palette][classesNumber];
                  var colorScale = d3.scale.quantize()
                    .domain([0, 1])
                    .range(colors);


                  d3.select("#gArc_" + currentSettingsID).selectAll(".node")
                    .data(nodes)
                    .enter()
                    .append("circle")
                    .attr("class", "node")
                    .attr("id", function (d, i) {
                      return d.aoi;
                    })
                    .attr("name", function (d, i) {
                      return getAoiFromConfig(d.aoi).url;
                    })
                    .attr("cx", function (d, i) {
                      return d.x;
                    })
                    .attr("cy", function (d, i) {
                      return d.y;
                    })
                    .attr("r", function (d, i) {
                      return radiusArc * (d.duration / 1000) + 2;//value
                    })
                    .style("fill", function (d, i) {
                      var c = colorScale(parseInt(d.duration) / 100);
                      return c;
                    })
                    .on("mouseover", function (d, i) {
                      tip.show(d);
                      highlightSPLOMgrid(d3.select(this));
                    })
                    .on("mouseout", function (d, i) {
                      tip.hide(d);
                      var parentDiv = d3.select(this).node().parentNode.id;
                      var parentRef = parentDiv.substring(parentDiv.indexOf("_") + 1);
                      d3.select("#highlightRect_" + parentRef).remove();
                    });
                }

                // Draws nice arcs for each link on plot
                function drawLinks(links) {
                  // scale to generate radians (just for lower-half of circle)
                  var radians = d3.scale.linear()
                    .range([Math.PI / 2, 3 * Math.PI / 2]);

                  // path generator for arcs (uses polar coordinates)
                  var arc = d3.svg.line.radial()
                    .interpolate("basis")
                    .tension(0)
                    .angle(function (d) {
                      return radians(d);
                    });

                  // add links
                  d3.select("#gArc_" + currentSettingsID).selectAll(".link")
                    .data(links)
                    .enter()
                    .append("path")
                    .attr("class", "link")
                    .attr("transform", function (d, i) {
                      // arc will always be drawn around (0, 0)
                      // shift so (0, 0) will be between source and target
                      var xshift = d.source.x + (d.target.x - d.source.x) / 2;
                      var yshift = yfixed;
                      return "translate(" + xshift + ", " + yshift + ")";
                    })
                    .attr("d", function (d, i) {
                      // get x distance between source and target
                      var xdist = Math.abs(d.source.x - d.target.x);

                      // set arc radiusArc based on x distance
                      arc.radius(xdist / 2);

                      // want to generate 1/3 as many points per pixel in x direction
                      var points = d3.range(0, Math.ceil(xdist / 3));

                      // set radian scale domain
                      radians.domain([0, points.length - 1]);

                      // return path for arc
                      return arc(points);
                    })
                    .style("stroke-width", function (d) {
                      //TODO: Maybe we want to use the number of jumps instead...
                      return (d.duration / 10);
                    });

                  // add labels
                  var labelList = [];
                  d3.select("#gArc_" + currentSettingsID).selectAll("text")
                    .data(links)
                    .enter()
                    .append("text")
                    .attr("id", function (d, i) {
                      var s = d.source.aoi;
                      var t = d.target.aoi;
                      var id = "id" + i + "-" + s + "_" + t;
                      labelList.push(id);
                      return id + currentSettingsID;
                    })
                    .attr("x", function (d, i) {
                      return d.source.x + (d.target.x - d.source.x) / 2;
                    })
                    .attr("y", function (d, i) {
                      var xdist = Math.abs(d.source.x - d.target.x);
                      return yfixed + (xdist / 2) + 10;
                    })
                    .text(function (d, i) {
                      return i + 1;
                    })
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "10px")
                    .style("text-anchor", "middle")
                    .style("fill", "black");

                  //treat duplicates
                  for (var i = 0; i < labelList.length - 1; i++) {
                    for (var j = i + 1; j < labelList.length; j++) {
                      var tmp = labelList[i].substring(labelList[i].indexOf("-") + 1);
                      var n1 = tmp.substring(0, tmp.indexOf("_"));
                      var n2 = tmp.substring(tmp.indexOf("_") + 1);
                      var check = n1 + "_" + n2;
                      var reverseI = n2 + "_" + n1;

                      var tmp2 = labelList[j].substring(labelList[j].indexOf("-") + 1);
                      var n1j = tmp2.substring(0, tmp2.indexOf("_"));
                      var n2j = tmp2.substring(tmp2.indexOf("_") + 1);
                      var target = n1j + "_" + n2j;

                      if (check === target || reverseI === target) {
                        var valI = d3.select("#" + labelList[i] + currentSettingsID).text();
                        var valJ = d3.select("#" + labelList[j] + currentSettingsID).text();

                        if (valI.length > 0 && valJ.length > 0) {
                          var text;
                          if (valI !== valJ) {
                            text = valI + "," + valJ;
                            d3.select("#" + labelList[j] + currentSettingsID).text("");
                            d3.select("#" + labelList[i] + currentSettingsID).text(text);
                          } else {
                          }
                        }

                        //var valI = d3.select("#" + labelList[i] + currentSettingsID).text();
                        //var valJ = d3.select("#" + labelList[j] + currentSettingsID).text();
                        //
                        //if(valI.length > 0 && valJ.length > 0) {
                        //  d3.select("#" + labelList[i] + currentSettingsID).append("tspan").attr("dx", "-1em").attr("dy", "1.2em").text(d3.select("#" + labelList[j] + currentSettingsID).text());
                        //  d3.select("#" + labelList[j] + currentSettingsID).text("");
                        //}
                      }
                    }
                  }
                }

                function drawSPmatrix(data, nodes) {

                  //add view
                  var divSPLOM = d3.select("#" + currentSettingsID)
                    .append("div")
                    .attr("id", "divSPLOM")
                    .style("width", "1000")
                    .style("height", "100%")

                  var imagesSVG = divSPLOM
                    .append("svg")
                    .attr("id", "svgSPLOM")
                    .style("width", column * imageWidth)
                    .style("height", row * imageHeight + 130) // +30 for off-screen
                    .style("margin", "auto");

                  imagesSVG.call(tip);

                  //sort nodes by aoi
                  nodes.sort(function (a, b) {
                    return a.aoi - b.aoi;
                  });

                  // for(var i = 0; i < nodes.length; i++){
                  //   if(nodes[i].aoi > 39){
                  //     matrixNodes.push(nodes[i]);
                  //     nodes.splice(i, 1);
                  //     i--;
                  //   }
                  // }

                  cellGroup = imagesSVG
                    .append("g")
                    .attr("id", "gSPLOM_" + currentSettingsID)
                    .attr("x", 0)
                    .style("textAlign", "center")
                    .append("g")
                    .attr("id", "gCellImages")
                    .selectAll("image")
                    .data(nodes)
                    .enter()
                    .append("svg:image")
                    .attr("xlink:href", function (d, i) {
                      return "config/images/" + d.url;
                    })
                    .attr("class", "image")
                    .attr("width", imageWidth)
                    .attr("height", imageHeight)
                    .attr("x", function (d, i) {
                      return (i % column) * imageWidth;   // + (i % 4) * matrixGap
                    })
                    .attr("y", function (d, i) {
                      return (Math.floor(i / column) * imageHeight);  // 10 +  ... + Math.floor(i / 4) * 50
                    });


                  var spBorder = d3.select("#gSPLOM_" + currentSettingsID)
                    .append("g")
                    .attr("id", "gCellBorder_" + currentSettingsID)
                    .selectAll("rect")
                    .data(nodes)
                    .enter()
                    .append("rect")
                    .attr("id", function (d, i) {
                      return d.aoi;
                      ;
                    })
                    .attr('class', 'image-border')
                    .attr("x", function (d, i) {
                      return (i % column) * imageWidth;   // + (i % 4) * matrixGap
                    })
                    .attr("y", function (d, i) {
                      return (Math.floor(i / column) * imageHeight);  // 10 +  ... + Math.floor(i / 4) * 50
                    })
                    .attr("height", imageHeight)
                    .attr("width", imageWidth)
                    .on("mouseover", function (d, i) {
                      tip.show(d);
                      highlightADcircle(d3.select(this));
                    })
                    .on("mouseout", function (d, i) {
                      tip.hide(d);
                      d3.select("#highlightCircle").remove();
                    });

                  var spText = d3.select("#gSPLOM_" + currentSettingsID)
                    .append("g")
                    .attr("id", "gCellText")
                    .selectAll("text")
                    .data(nodes)
                    .enter()
                    .append("text")
                    .attr("class", "matrix-label")
                    .attr("id", function (d, i) {
                      return d.aoi;
                    })
                    .attr("x", function (d, i) {
                      return (i % column) * imageWidth + (imageWidth / 2);
                    })
                    .attr("y", function (d, i) {
                      return (Math.floor(i / column) * imageHeight) + (imageHeight / 2);  // 10 +  ... + Math.floor(i / 4) * 50
                    })
                    .text(function (d, i) {
                      return "AOI " + d.aoi;
                    });


                  var element = document.getElementById('gSPLOM_' + currentSettingsID); //replace elementId with your element's Id.
                  var rect = element.getBoundingClientRect();
                  var offScreenItemWidth = rect.width / 3;
                  offScreenItemWidth = 400; //bug: > 2 users -> tab error!

                  var hArc = d3.select("#divArc").style("height");
                  var heightArcDiv = parseInt(hArc.substr(0, hArc.indexOf("px")))
                  var headerHeigth = 40;

                  var spHeatmap = d3.select("#divSPLOM")
                    .append("div")
                    .attr("id", "divHeatmap")
                    // .style("width", column * imageWidth)
                    // .style("height", row * imageHeight + 30) // +30 for off-screen
                    // .style("margin", "auto");
                    //.style("top", (heightArcDiv + headerHeigth) + "px")
                    //.style("left", "20px")
                    .style("position", "relative")
                    .style("top", "-635px")
                    .selectAll("div")
                    .data(nodes)
                    .enter()
                    .append("div")
                    .attr("id", function (d, i) {
                      return "heatmap" + d.aoi;
                    })
                    .attr('class', 'heatmap')
                    .style("left", function (d, i) {
                      var margin = (i % column) * imageWidth
                      return margin + "px";   // + (i % 4) * matrixGap
                    })
                    .style("top", function (d, i) {
                      return (Math.floor(i / column) * imageHeight) + "px";
                    })
                    .attr("height", imageHeight)
                    .attr("width", imageWidth)
                    .style("position", "absolute");

                  //add controler
                  var settingDiv = d3.select("#" + currentSettingsID)
                    .append("div")
                    .attr("id", "divControl")
                    .attr("width", "100%")
                    .style("top", "-700px")
                    .style("text-align", "left")
                    .style("left", "1050px")
                    .style("position", "relative");

                  var colorSliderGroup = settingDiv
                    .append("g")
                    .attr("id", "gSlider")
                    .attr("width", "33%")
                    .style("margin", "5px");

                  colorSliderGroup
                    .append("label")
                    .attr("for", "value")
                    .text("Opacity:");

                  colorSliderGroup
                    .append("text")
                    .attr("id", "value")
                    .style("fill", "#004669")
                    .style("font-weight", "bold")
                    .text("95%");

                  colorSliderGroup
                    .append("div")
                    .attr("id", "colorSlider_" + currentSettingsID)
                    .attr("width", "200");

                  $(function () {
                    $("#colorSlider_" + currentSettingsID).slider({
                      range: "min",
                      value: 95,
                      min: 0,
                      max: 100,
                      slide: function (event, ui) {
                        $("#value").text(ui.value + "%");
                        var val = ui.value / 100;
                        changeOpacity(val);
                      }
                    });
                  });

                  var dropDown = settingDiv.append("select")
                    .attr("id", "colorPalette_" + currentSettingsID)
                    .attr("width", "33%")
                    .style("margin", "5px");

                  dropDown.append("option")
                    .text("---")
                    .attr("value", "---")
                    .attr("selected", "selected");
                  dropDown.append("option")
                    .text("Labels")
                    .attr("value", "labels");
                  dropDown.append("option")
                    .text("Global AOI")
                    .attr("value", "global");
                  dropDown.append("option")
                    .text("Local AOI")
                    .attr("value", "local");


                  d3.select("#colorPalette_" + currentSettingsID).on("keyup", function () {
                      var newPalette = d3.select("#colorPalette_" + currentSettingsID).property("value");
                      if (newPalette != null)           // when interfaced with jQwidget, the ComboBox handles keyup event but value is then not available ?
                        changePalette(data, newPalette);
                    })
                    .on("change", function () {
                      var parentDiv = d3.select(this).node().id;
                      var parentName = parentDiv.substring(parentDiv.indexOf("_") + 1);
                      var newPalette = d3.select("#colorPalette_" + parentName).property("value");
                      changePalette(data, newPalette, parentName);
                    });

                }


                /* HELPER FUNCTIONS */

                function changePalette(data, paletteName, parentName) {
                  if (paletteName === "---") {
                    var svg = d3.select("#gSPLOM_" + parentName);
                    var t = svg.transition().duration(500);
                    t.selectAll("rect")
                      .style("fill", "transparent");

                    //disable other views
                    d3.select("#divHeatmap").node().style.visibility = "hidden";
                    d3.select("#gSPLOM_" + parentName).selectAll("text").style("visibility", "hidden");

                    var svg = d3.select("#otherAOIs_" + parentName);
                    var t = svg.transition().duration(500);
                    t.selectAll("rect")
                      .style("fill", "LightYellow");
                    // d3.select("#otherAOIs_" + parentName).selectAll("rect").style("fill", "LightYellow");
                  }
                  else if (paletteName === "labels") {
                    //show labels inside cells
                    d3.select("#gSPLOM_" + parentName)
                      .selectAll("text")
                      .style("visibility", "visible");
                  }
                  else if (paletteName === "local") {
                    //enable local AOI view
                    d3.select("#divHeatmap").node().style.visibility = "visible";

                    var heatmapsDiv = d3.select("#divHeatmap");
                    var heatNodes = heatmapsDiv.node().childNodes;

                    if (!heatNodes[0].hasChildNodes()) {
                      for (var i = 0; i < heatNodes.length; i++) {
                        var id = heatNodes[i].id;
                        d3.select("#" + id).style("width", imageWidth + "px");
                        d3.select("#" + id).style("height", imageHeight + "px");

                        //create each AOI heatmap
                        createHeatMap(data, id);

                        d3.select("#" + id).style("position", "absolute");
                      }
                    }
                  }
                  else if (paletteName === "global") {

                    var colors = colorbrewer[palette][classesNumber];
                    var colorScale = d3.scale.quantize()
                      .domain([0.0, 1.0])
                      .range(colors);
                    var svg = d3.select("#gSPLOM_" + parentName);
                    var t = svg.transition().duration(500);
                    t.selectAll("rect")
                      .style("fill", function (d, i) {
                        var c = colorScale(parseInt(d.duration) / 100);
                        return c;
                      });

                    var colors = colorbrewer[palette][classesNumber];
                    var colorScale = d3.scale.quantize()
                      .domain([0, 1])
                      .range(colors);
                    var svg2 = d3.select("#gArc_" + parentName);
                    var t2 = svg2.transition().duration(500);
                    t2.selectAll("circle")
                      .style("fill", function (d, i) {
                        var c = colorScale(parseInt(d.duration) / 100);
                        return c;
                      });

                  }
                }

                function changeOpacity(value) {
                  var svg = d3.select("#gSPLOM_" + currentSettingsID);
                  var t = svg.transition().duration(500);
                  t.selectAll("rect")
                    .style("opacity", value);
                }

                function createHeatMap(data, divName) {
                  var heatmapInstance = h337.create({
                    // only container is required, the rest will be defaults
                    container: document.querySelector('#' + divName)
                  });

                  //Data for each plot
                  var dataAOI = generateRandomData(10);
                  var dataAOI2 = prepareHeatmapData(data, divName);

                  heatmapInstance.setData(dataAOI2);
                }

                function prepareHeatmapData(data, divName)
                {                  
                  var points = [];
                  var max = 0;
                  var width = imageWidth;
                  var height = imageHeight;
                  var Xscreen = 0;
                  var Yscreen = 0;
                  var aoi = divName.match(numberPattern);
                  var val = 0;


                  data.entries.forEach(function (d) {

                    if (d.main._source.aoi == aoi)
                    {
                      val = d.main._source.durationAoi;

                      var row = (aoi/8 + 1);
                      var col = aoi/5;

                      //For the calculation of x and y we need to take in account the original screen limits of the AOI
                      Xscreen = Math.floor(d.main._source.x/width +70);
                      Yscreen = Math.floor(d.main._source.y/height + 50);

                      // now also with custom radiusArc
                      //var radiusArc = Math.floor(Math.random() * 70);;

                      max = Math.max(max, val);
                      var point = {
                        x: Xscreen,
                        y: Yscreen,
                        value: val,
                        // radiusArc configuration on point basis
                        //radiusArc: radiusArc
                      };

                      points.push(point);
                    }

                  });

                  var data = {max: max, data: points};

                  return data;
                }

                function generateRandomData(len) {
                  // now generate some random data
                  var points = [];
                  var max = 0;
                  var width = imageWidth;
                  var height = imageHeight;

                  while (len--) {
                    var val = Math.floor(Math.random() * 100);
                    // now also with custom radiusArc
                    var radiusArc = Math.floor(Math.random() * 70);

                    max = Math.max(max, val);
                    var point = {
                      x: Math.floor(Math.random() * width),
                      y: Math.floor(Math.random() * height),
                      value: val,
                      // radiusArc configuration on point basis
                      radiusArc: radiusArc
                    };
                    points.push(point);
                  }
                  var data = {max: max, data: points};
                  return data;
                }


                // Generates a tooltip for SP grid based on selected ID
                function highlightSPLOMgrid(circle) {
                  var parentDiv = circle.node().parentNode.id;
                  var parentRef = parentDiv.substring(parentDiv.indexOf("_") + 1);

                  var cId = circle.attr("id");

                  var groupElement = d3.select("#gCellBorder_" + parentRef);
                  var groupNodes = groupElement.node();

                  //      if(cId < 40){
                  var spNode = groupNodes.children[cId];
                  var borderX = spNode.x;
                  var borderY = spNode.y;

                  groupElement.append("rect")
                    .attr("id", "highlightRect_" + parentRef)
                    .attr("x", borderX.baseVal.value)
                    .attr("y", borderY.baseVal.value)
                    .attr("width", imageWidth)
                    .attr("height", imageHeight)
                    .style("fill", "none")
                    .style("stroke", "red")
                    .style("stroke-width", 3);
                  // }else{
                  //   for(var i = 0; i < matrixNodes.length; i++){
                  //     if(cId == matrixNodes[i].aoi){
                  //       var spNode = d3.select("#otherAOIs_" + parentRef).node().children[i];
                  //       spNode.style
                  //       var borderX = spNode.x;
                  //       var borderY = spNode.y;

                  //       groupElement.append("rect")
                  //         .attr("id", "highlightRect_" + parentRef)
                  //         .attr("x", borderX.baseVal.value)
                  //         .attr("y", borderY.baseVal.value)
                  //         .attr("width", spNode.width.baseVal.value)
                  //         .attr("height", spNode.height.baseVal.value)
                  //         .style("fill", "none")
                  //         .style("stroke", "red")
                  //         .style("stroke-width", 4);
                  //       break;
                  //     }
                  //   }
                  // }

                }

                function highlightADcircle(grid) {
                  var parentDiv = grid.node().parentNode.id;
                  var parentRef = parentDiv.substring(parentDiv.indexOf("_") + 1);

                  var spID = grid.attr("id");
                  var groupElement = d3.select("#gArc_" + parentRef);
                  var groupNodes = groupElement.node();

                  var gID = -1;
                  for (var i = 0; i < groupNodes.children.length; ++i) {
                    var n = groupNodes.children[i];
                    if (groupNodes.children[i].localName === "circle") {
                      if (groupNodes.children[i].id === spID) {
                        gID = i;
                        break;
                      }
                    }
                  }

                  var spNode = groupNodes.children[gID];

                  if (spNode) {
                    var cX = spNode.cx;
                    var cY = spNode.cy;
                    var cR = spNode.r;

                    groupElement.append("circle")
                      .attr("id", "highlightCircle")
                      .attr("cx", cX.baseVal.value)
                      .attr("cy", cY.baseVal.value)
                      .attr("r", cR.baseVal.value)
                      .attr("width", imageWidth)
                      .attr("height", imageHeight)
                      .style("fill", "none")
                      .style("stroke", "red")
                      .style("stroke-width", 3);
                  }
                }

                drawArcDiagram();


              }
            });

          }
        }
      }]
    );
}());

