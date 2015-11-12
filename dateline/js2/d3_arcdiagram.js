		var width = 1140;           // width of arc div
        var height = 200;           // height of arc div
        var margin = 50;            // amount of margin around plot area
        var pad = margin / 2;       // actual padding amount
        var radius = 4;             // fixed node radius
        var yfixed = pad + radius;  // y position for all nodes

        var imageWidth = 150;       // width of SP image
        var imageHeight = 100;      // height of SP image
        var cellGroup;
		
		var currentSettingsID;
        var tip;					// tool tip
		
		var column = 8;
		var row = 5;
		var matrixGap = 30
		
		//colorbrewer
		var classesNumber = 10;
		var paletteName = "Spectral";


        /* DRAW ARC DIAGRAM */

		function drawArcDiagram(url, settings)
		{
			currentSettingsID = settings;
			
			tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function (d) {
                    return "<strong>AOI</strong> <span style='color:red'>" + d.aoi + "</span>";
                });
								
			d3.json(url, arcDiagram);
		}
		
        // Draws an arc diagram for the provided undirected graph
        function arcDiagram(graph) {

			d3.select("#" + currentSettingsID)
				.attr("width", "100%")
				.attr("height", "100%")
				.style("text-align", "center")
				.style("margin", "0 auto");
				
			var divArc = d3.select("#" + currentSettingsID)
                .append("div")
                .attr("id", "divArc")
				.attr("width", "100%")
				.attr("height", "100%");
					
            // create svg image
            var svg = divArc
                    .append("svg")
                    .attr("id", "svgArc")
                    .attr("width", width)
                    .attr("height", height)
                    .style("border", "1px solid black")
					.style("margin", "auto"); 

            svg.call(tip);

            // create plot area within svg image
            var plot = svg.append("g")
                    .attr("id", "gArc")
                    .attr("transform", "translate(" + pad + ", " + pad + ")");

            // fix graph links to map to objects instead of indices
            graph.links.forEach(function (d, i) {
                d.source = isNaN(d.source) ? d.source : graph.nodes[d.source];
                d.target = isNaN(d.target) ? d.target : graph.nodes[d.target];
            });

            // must be done AFTER links are fixed
            linearLayout(graph.nodes);

            // draw links first, so nodes appear on top
            drawLinks(graph.links);

            // draw nodes last
            drawNodes(graph.nodes);

            // draw scatterplot matrix
            drawSPmatrix(graph.nodes);
        }

        // Layout nodes linearly, sorted by group
        function linearLayout(nodes) {

            // used to scale node index to x position
            var xscale = d3.scale.linear()
                    .domain([0, nodes.length - 1])
                    .range([radius, width - margin - radius]);

            // calculate pixel location for each node
            nodes.forEach(function (d, i) {
                d.x = xscale(i);
                d.y = yfixed;
            });
        }

        // Draws nodes on plot
        function drawNodes(nodes) {
            // used to assign nodes color by group
            var color = d3.scale.category20();
			
			var colors = colorbrewer[paletteName][classesNumber];
    		var colorScale = d3.scale.quantize()
        		.domain([0, 10])
        		.range(colors);
			

            d3.select("#gArc").selectAll(".node")
                    .data(nodes)
                    .enter()
                    .append("circle")
                    .attr("class", "node")
                    .attr("id", function (d, i) {
                        return d.aoi;
                    })
                    .attr("name", function (d, i) {
                        return d.name;
                    })
                    .attr("cx", function (d, i) {
                        return d.x;
                    })
                    .attr("cy", function (d, i) {
                        return d.y;
                    })
                    .attr("r", function (d, i) {
                        return radius * d.value;
                    })
                    .style("fill", function (d, i) {
                        return colorScale(d.group);
                    })
                    .on("mouseover", function (d, i) {
                        tip.show(d);
                        highlightSPLOMgrid(d3.select(this));
                    })
                    .on("mouseout", function (d, i) {
                        tip.hide(d);
                        d3.select("#highlightRect").remove();
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
            d3.select("#gArc").selectAll(".link")
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

                        // set arc radius based on x distance
                        arc.radius(xdist / 2);

                        // want to generate 1/3 as many points per pixel in x direction
                        var points = d3.range(0, Math.ceil(xdist / 3));

                        // set radian scale domain
                        radians.domain([0, points.length - 1]);

                        // return path for arc
                        return arc(points);
                    })
                    .style("stroke-width", function (d) {
                        return d.value;
                    });
					
			// add labels
			var labelList = [];
            d3.select("#gArc").selectAll("text")
                    .data(links)
                    .enter()
                    .append("text")
					.attr("id", function (d, i) {
						var s = d.source.aoi;
						var t = d.target.aoi;
						var id = "id-" + s + "_" + t;
						labelList.push(id);
                        return id;
                    })
					.attr("x", function (d, i) {
                        return d.source.x + (d.target.x - d.source.x) / 2;
                    })
                    .attr("y", function (d, i) {
						var xdist = Math.abs(d.source.x - d.target.x);						
                        return yfixed + (xdist/2) + 10;
                    })
					.text(function (d, i) {
                        return i +1;
                    })
					.attr("font-family", "sans-serif")
					.attr("font-size", "10px")
					.style("text-anchor", "middle")
					.style("fill", "white");
					
			//treat duplicates
			for(var i = 0; i < labelList.length -1; i++){
				for(var j = i+1; j < labelList.length; j++){
					var n1 = labelList[i].substring(3, labelList[i].indexOf("_")) //"id-" -> 3
					var n2 = labelList[i].substring(labelList[i].indexOf("_")+1)
					var reverseI = "id-" + n2 + "_" + n1;
					if(labelList[i] === labelList[j] || reverseI === labelList[j]){
						var l = d3.select("#" + labelList[i]);
						var x = l.node().x.baseVal[0].value;
						var y = l.node().y.baseVal[0].value;
						var text = l.text() + ", " + d3.select("#" + labelList[j]).text();
						
						d3.select("#" + labelList[j]).text("");
						d3.select("#" + labelList[i]).text(text);
					}
				}
			}
        }

        function drawSPmatrix(nodes) {
						
			//add view				
			var divSPLOM = d3.select("#" + currentSettingsID)
                    .append("div")
                    .attr("id", "divSPLOM")
					.style("width", "1000")		//100% !
					.style("height", "100%")
					//.style("left", "50px")
					//.style("top", "50px")
					//.style("position", "absolute");
			
            var imagesSVG = divSPLOM
                    .append("svg")
                    .attr("id", "svgSPLOM")
					.attr("width", column * imageWidth)
                    .attr("height", row * imageHeight +10)
					.style("margin", "auto");

            imagesSVG.call(tip);

            //sort nodes by aoi
            nodes.sort(function (a, b) {
                return a.aoi - b.aoi;
            });

            cellGroup = imagesSVG
                    .append("g")
                    .attr("id", "gSPLOM")
					.attr("x", 0)
                    .style("textAlign", "center")
					//.attr("transform", "translate(0,10)")
					.append("g")
					.attr("id", "gCellImages")
                    .selectAll("image")
                    .data(nodes)
                    .enter()
                    .append("svg:image")
                    .attr("xlink:href", function (d, i) {
                        return "images/" + d.name;
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
					

            var spBorder = d3.select("#gSPLOM")
					.append("g")
					.attr("id", "gCellBorder")
					.selectAll("rect")
                    .data(nodes)
                    .enter()
                    .append("rect")
                    .attr("id", function (d, i) {
                        return d.aoi;
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
					
			var spText = d3.select("#gSPLOM")
					.append("g")
					.attr("id", "gCellText")
					.selectAll("text")
                    .data(nodes)
                    .enter()
                    .append("text")
                    .attr("id", function (d, i) {
                        return d.aoi;
                    })
                    .attr("x", function (d, i) {
                        return (i % column) * imageWidth + (imageWidth/2);
                    })
                    .attr("y", function (d, i) {
                        return (Math.floor(i / column) * imageHeight) + (imageHeight/2);  // 10 +  ... + Math.floor(i / 4) * 50
                    })
					.text(function (d, i) {
                        return "AOI " + d.aoi;
                    })
					.attr("font-family", "sans-serif")
					.attr("font-size", "20px")
					.style("text-anchor", "middle")
					.style("font-weight", "bold")
					.style("visibility", "hidden");
			
					
			var hArc = d3.select("#divArc").style("height");
			var heightArcDiv = parseInt(hArc.substr(0, hArc.indexOf("px")))
							
			//var heatmapX = d3.select("#svgSPLOM").node()
			
			var spHeatmap = d3.select("#divSPLOM")
					.append("div")
					.attr("id", "divHeatmap")
					//.attr("width", "800")
					//.style("height", "700")
					.style("top", heightArcDiv + "px")
					.style("left", "30px")
					.style("position", "absolute")
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
                        return (Math.floor(i / column) * imageHeight) + "px";  // 10 +  ... + Math.floor(i / 4) * 50
                    })
                    .attr("height", imageHeight)
                    .attr("width", imageWidth)
					.style("position", "absolute");
						
			//add controler
			var settingDiv = d3.select("#"+ currentSettingsID)
				.append("div")
				.attr("id", "divControl")
				.attr("width", "100%")
				.style("text-align", "left")
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
				.attr("id", "colorSlider")
				.attr("width", "200");
				
			$(function() {
				$("#colorSlider").slider({
					range: "min",
					value: 95,
					min: 0,
					max: 100,
					slide: function( event, ui ) {
						$( "#value" ).text(ui.value + "%");
						var val = ui.value / 100;
						changeOpacity(val);
					}
				});
			});
			
			var colors = colorbrewer[paletteName][classesNumber];
			
			var dropDown = settingDiv.append("select")
				.attr("id", "colorPalette")
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
			
			
			d3.select("#colorPalette").on("keyup", function() {
				var newPalette = d3.select("#colorPalette").property("value");
    			if (newPalette != null)           // when interfaced with jQwidget, the ComboBox handles keyup event but value is then not available ?
                  	changePalette(newPalette);
            	})
            	.on("change", function() {
    				var newPalette = d3.select("#colorPalette").property("value");
                	changePalette(newPalette);
            	});
			
			
        }
		

        /* HELPER FUNCTIONS */
		
		function changePalette(paletteName) {
			if(paletteName === "---"){
				var svg = d3.select("#gSPLOM");
    			var t = svg.transition().duration(500);
    			t.selectAll("rect")
					.style("fill", "transparent");
					
				//disable other views
				d3.select("#divHeatmap").node().style.visibility = "hidden";
				d3.select("#gSPLOM").selectAll("text").style("visibility", "hidden");
			}
			else if(paletteName === "labels"){
				//show labels inside cells
    			d3.select("#gSPLOM")
					.selectAll("text")
        			.style("visibility", "visible");
			}
			else if(paletteName === "local"){
				//enable local AOI view
				d3.select("#divHeatmap").node().style.visibility = "visible";
				
				var heatmapsDiv = d3.select("#divHeatmap");
				var heatNodes = heatmapsDiv.node().childNodes;
				
				if(!heatNodes[0].hasChildNodes()){
					for(var i=0; i < heatNodes.length; i++){
						var id = heatNodes[i].id
						d3.select("#"+ id).style("width", imageWidth + "px")
						d3.select("#"+ id).style("height", imageHeight + "px")
						createHeatMap(id); 
						d3.select("#"+ id).style("position", "absolute")
					}
				}
			}
			else if(paletteName === "global"){
				
    			var colors = colorbrewer["RdYlGn"][classesNumber];
    			var colorScale = d3.scale.quantize()
        			.domain([0.0, 1.0])
        			.range(colors);
    			var svg = d3.select("#gSPLOM");
    			var t = svg.transition().duration(500);
    			t.selectAll("rect")
        			.style("fill", function(d, i) {
						var c = colorScale(d.duration)
						return colorScale(d.duration);
        			});
			
				var colors = colorbrewer[paletteName][classesNumber];
    			var colorScale = d3.scale.quantize()
        			.domain([0, 10])
        			.range(colors);
				var svg2 = d3.select("#gArc");
    			var t2 = svg2.transition().duration(500);
    			t2.selectAll("circle")
        			.style("fill", function(d, i) {
						var c = colorScale(d.group)
						return colorScale(d.group);
						//if (d != null) return colorScale(d);
                		//else return "url(#diagonalHatch)";
        			});
				
			}
		}
		
		function changeOpacity(value){
			var svg = d3.select("#gSPLOM");
    		var t = svg.transition().duration(500);
    		t.selectAll("rect")
				.style("opacity", value);
			
		}
		
		function createHeatMap(divName){
			var heatmapInstance = h337.create({
				// only container is required, the rest will be defaults
				container: document.querySelector('#' + divName)
			});
			
			var data = generateRandomData(10);
			heatmapInstance.setData(data);
		}

		function generateRandomData(len) {
			// now generate some random data
			var points = [];
			var max = 0;
			var width = imageWidth;
			var height = imageHeight;

			while (len--) {
				var val = Math.floor(Math.random()*100);
				// now also with custom radius
				var radius = Math.floor(Math.random()*70);

				max = Math.max(max, val);
				var point = {
					x: Math.floor(Math.random()*width),
					y: Math.floor(Math.random()*height),
					value: val,
					// radius configuration on point basis
					radius: radius
				};
				points.push(point);
			}
			var data = { max: max, data: points };
			return data;
		}


        // Generates a tooltip for SP grid based on selected ID
        function highlightSPLOMgrid(circle) {

            var cId = circle.attr("id");
            var groupElement = d3.select("#gCellBorder");
            var groupNodes = groupElement.node();
            var spNode = groupNodes.children[cId];
            var borderX = spNode.x;
            var borderY = spNode.y;

            groupElement.append("rect")
                    .attr("id", "highlightRect")
                    .attr("x", borderX.baseVal.value)
                    .attr("y", borderY.baseVal.value)
                    .attr("width", imageWidth)
                    .attr("height", imageHeight)
                    .style("fill", "none")
                    .style("stroke", "red")
                    .style("stroke-width", 3);

        }

        function highlightADcircle(grid) {
            var spID = grid.attr("id");
            var groupElement = d3.select("#gArc");
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
		
