		var width = 1140;           // width of arc div
        var height = 250;           // height of arc div
        var margin = 50;            // amount of margin around plot area
        var pad = margin / 2;       // actual padding amount
        var radiusArc = 4;             // fixed node radiusArc
        var yfixed = pad + radiusArc;  // y position for all nodes

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
		var matrixNodes = [];


        /* DRAW ARC DIAGRAM */

		function drawArcDiagram(url, settings)
		{
			currentSettingsID = settings;
			
			tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function (d) {
					if(d.aoi < 39){
						return "<strong>AOI</strong> <span style='color:red'>" + d.aoi + "</span>";
					}else{
						return "<strong>AOI</strong> <span style='color:red'>" + d.name + "</span>";
					}
                });
								
			d3.json(url, arcDiagram);
		}
		
		function drawArcDiagram2(data, settings)
		{
			currentSettingsID = settings;
			
			tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function (d) {
					if(d.aoi < 39){
						return "<strong>AOI</strong> <span style='color:red'>" + d.aoi + "</span>";
					}else{
						return "<strong>AOI</strong> <span style='color:red'>" + d.name + "</span>";
					}
                });
								
			arcDiagram(data);
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
				.style("height", "100%");
					
            // create svg image
            var svg = divArc
                    .append("svg")
                    .attr("id", "svgArc_"  + currentSettingsID)
                    .attr("width", width)
                    .style("height", "100%")
                    .style("border", "1px solid black")
					.style("margin", "auto"); 

            svg.call(tip);

            // create plot area within svg image
            var plot = svg.append("g")
                    .attr("id", "gArc_" + currentSettingsID)
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
			
			// reset height
			var element = document.getElementById('gArc_' + currentSettingsID);
			var divHeight = element.getBoundingClientRect().height + 30;
			d3.select("#svgArc_" + currentSettingsID).node().style.height = divHeight;

            // draw scatterplot matrix
            drawSPmatrix(graph.nodes);
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
            });
        }

        // Draws nodes on plot
        function drawNodes(nodes) {
            // used to assign nodes color by group
            var color = d3.scale.category20();
			
			var colors = colorbrewer["RdYlGn"][classesNumber];
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
                        return d.name;
                    })
                    .attr("cx", function (d, i) {
                        return d.x;
                    })
                    .attr("cy", function (d, i) {
                        return d.y;
                    })
                    .attr("r", function (d, i) {
                        return radiusArc * d.value;
                    })
                    .style("fill", function (d, i) {
                        return colorScale(d.duration);
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
                        return d.value;
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
						var id = "id-" + s + "_" + t;
						labelList.push(id);
                        return id + currentSettingsID;
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
					.style("fill", "black");
					
			//treat duplicates
			for(var i = 0; i < labelList.length -1; i++){
				for(var j = i+1; j < labelList.length; j++){
					var n1 = labelList[i].substring(3, labelList[i].indexOf("_")) //"id-" -> 3
					var n2 = labelList[i].substring(labelList[i].indexOf("_")+1)
					var reverseI = "id-" + n2 + "_" + n1;
					if(labelList[i] === labelList[j] || reverseI === labelList[j]){
						var l = d3.select("#" + labelList[i] + currentSettingsID);
						var text = l.text() + ", " + d3.select("#" + labelList[j] + currentSettingsID).text();
						
						d3.select("#" + labelList[j] + currentSettingsID).text("");
						d3.select("#" + labelList[i] + currentSettingsID).text(text);
						
						// d3.select("#" + labelList[i]).append("tspan").text(d3.select("#" + labelList[j]).text());
						// d3.select("#" + labelList[j]).text("");
					}
				}
			}
        }

        function drawSPmatrix(nodes) {
						
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
                    .style("height", row * imageHeight +30) // +30 for off-screen
					.style("margin", "auto");

            imagesSVG.call(tip);

            //sort nodes by aoi
            nodes.sort(function (a, b) {
                return a.aoi - b.aoi;
            });
			
			for(var i = 0; i < nodes.length; i++){
				if(nodes[i].aoi > 39){
					matrixNodes.push(nodes[i]);
					nodes.splice(i, 1);
					i--;
				}
			}

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
                        return "img/plots/" + d.name;
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
                        return (i % column) * imageWidth + (imageWidth/2);
                    })
                    .attr("y", function (d, i) {
                        return (Math.floor(i / column) * imageHeight) + (imageHeight/2);  // 10 +  ... + Math.floor(i / 4) * 50
                    })
					.text(function (d, i) {
                        return "AOI " + d.aoi;
                    });
					
			

			var element = document.getElementById('gSPLOM_' + currentSettingsID); //replace elementId with your element's Id.
			var rect = element.getBoundingClientRect();
			var offScreenItemWidth = rect.width / 3;

			var offscreen = d3.select("#gSPLOM_" + currentSettingsID)
				.append("g")
				.attr("id", "otherAOIs_" + currentSettingsID)
				.selectAll("rect")
				.data(matrixNodes)
				.enter()
				.append("rect")
				.attr('class', 'image-border')
				.attr("id", function (d, i) {
					return d.aoi;
				})
				.attr("x", function (d, i) {
					return (i % column) * offScreenItemWidth +1;
				})
				.attr("y", function (d, i) {
					return 500;
				})
				.attr("height", 28)
				.attr("width", offScreenItemWidth -2)
				.style("fill", "LightYellow")
				.style("stroke-width", "1")
				.on("mouseover", function (d, i) {
					tip.show(d);
					highlightADcircle(d3.select(this));
				})
				.on("mouseout", function (d, i) {
					tip.hide(d);
					d3.select("#highlightCircle").remove();
				});
					
			d3.select("#otherAOIs_" + currentSettingsID).selectAll("text")
				.data(matrixNodes)
				.enter()
				.append("text")
				.attr("class", "matrix-label")
				.attr("id", function (d, i) {
					return d.name;
				})
				.attr("x", function (d, i) {
					return (i % column) * offScreenItemWidth + (offScreenItemWidth/2);
				})
				.attr("y", function (d, i) {
					return 500 + 23;
				})
				.text(function (d, i) {
					return "AOI " + d.name;
				});
			
			
			var hArc = d3.select("#divArc").style("height");
			var heightArcDiv = parseInt(hArc.substr(0, hArc.indexOf("px")))
			var headerHeigth = 40;
						
			var spHeatmap = d3.select("#divSPLOM")
				.append("div")
				.attr("id", "divHeatmap")
				.style("top", (heightArcDiv + headerHeigth) +"px")
				.style("left", "110px")
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
					return (Math.floor(i / column) * imageHeight) + "px";
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
				.attr("id", "colorSlider_" + currentSettingsID)
				.attr("width", "200");
				
			$(function() {
				$("#colorSlider_" + currentSettingsID).slider({
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
			
			
			d3.select("#colorPalette_" + currentSettingsID).on("keyup", function() {
				var newPalette = d3.select("#colorPalette_" + currentSettingsID).property("value");
    			if (newPalette != null)           // when interfaced with jQwidget, the ComboBox handles keyup event but value is then not available ?
                  	changePalette(newPalette);
            	})
            	.on("change", function() {
					var parentDiv = d3.select(this).node().id;
					var parentName = parentDiv.substring(parentDiv.indexOf("_")+1);
    				var newPalette = d3.select("#colorPalette_" + parentName).property("value");
                	changePalette(newPalette, parentName);
            	});
			
        }
		

        /* HELPER FUNCTIONS */
		
		function changePalette(paletteName, parentName) {
			if(paletteName === "---"){
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
			else if(paletteName === "labels"){
				//show labels inside cells
    			d3.select("#gSPLOM_" + parentName)
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
    			var svg = d3.select("#gSPLOM_" + parentName);
    			var t = svg.transition().duration(500);
    			t.selectAll("rect")
        			.style("fill", function(d, i) {
						var c = colorScale(d.duration)
						return colorScale(d.duration);
        			});
			
				var colors = colorbrewer["RdYlGn"][classesNumber];
    			var colorScale = d3.scale.quantize()
        			.domain([0, 1])
        			.range(colors);
				var svg2 = d3.select("#gArc_" + parentName);
    			var t2 = svg2.transition().duration(500);
    			t2.selectAll("circle")
        			.style("fill", function(d, i) {
						var c = colorScale(d.duration)
						return colorScale(d.duration);
        			});
				
			}
		}
		
		function changeOpacity(value){
			var svg = d3.select("#gSPLOM_" + currentSettingsID);
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
				// now also with custom radiusArc
				var radiusArc = Math.floor(Math.random()*70);

				max = Math.max(max, val);
				var point = {
					x: Math.floor(Math.random()*width),
					y: Math.floor(Math.random()*height),
					value: val,
					// radiusArc configuration on point basis
					radiusArc: radiusArc
				};
				points.push(point);
			}
			var data = { max: max, data: points };
			return data;
		}


        // Generates a tooltip for SP grid based on selected ID
        function highlightSPLOMgrid(circle) {

            var cId = circle.attr("id");
			var groupElement = d3.select("#gCellBorder_" + currentSettingsID);
			var groupNodes = groupElement.node();
			
			if(cId >= 0){
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
			}else{
				for(var i = 0; i < matrixNodes.length; i++){
					if(cId == matrixNodes[i].aoi){
						var spNode = d3.select("#otherAOIs_" + currentSettingsID).node().children[i];
						spNode.style
						var borderX = spNode.x;
						var borderY = spNode.y;
						
						groupElement.append("rect")
							.attr("id", "highlightRect")
							.attr("x", borderX.baseVal.value)
							.attr("y", borderY.baseVal.value)
							.attr("width", spNode.width.baseVal.value)
							.attr("height", spNode.height.baseVal.value)
							.style("fill", "none")
							.style("stroke", "red")
							.style("stroke-width", 4);
					}
				}
			}

        }

        function highlightADcircle(grid) {
            var spID = grid.attr("id");
            var groupElement = d3.select("#gArc_" + currentSettingsID);
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

			if(gID >= 0){
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
			}else{
				
			}
        }
		
