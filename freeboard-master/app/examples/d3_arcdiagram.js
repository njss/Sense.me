var width = 940;           // width of svg image
        var height = 350;           // height of svg image
        var margin = 50;            // amount of margin around plot area
        var pad = margin / 2;       // actual padding amount
        var radius = 4;             // fixed node radius
        var yfixed = pad + radius;  // y position for all nodes

        var imageWidth = 150;       // width of SP image
        var imageHeight = 100;      // height of SP image
        var cellGroup;
		
		var currentSettingsID;
        var tip;					// tool tip
		
		var column = 6;
		var row = 4;
		var matrixGap = 30


        /* DRAW ARC DIAGRAM */

		function DrawArcDiagram(url, settings)
		{
			currentSettingsID = settings;
			
			tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function (d) {
                    return "<strong>Scatterplot</strong> <span style='color:red'>" + d.name + "</span>";
                });
				
			d3.json(url, arcDiagram);
		}
		
        // Draws an arc diagram for the provided undirected graph
        function arcDiagram(graph) {

			d3.select("#" + currentSettingsID)
				.style("text-align", "center")
				.style("margin", "auto");
				
		
            // create svg image
            var svg = d3.select("#" + currentSettingsID)
                    .append("svg")
                    .attr("id", "arc")
                    .attr("width", width)
                    .attr("height", height)
                    .style("border", "1px solid black")
					.style("margin", "auto"); 

            svg.call(tip);

            // create plot area within svg image
            var plot = svg.append("g")
                    .attr("id", "gPlot")
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

            d3.select("#gPlot").selectAll(".node")
                    .data(nodes)
                    .enter()
                    .append("circle")
                    .attr("class", "node")
                    .attr("id", function (d, i) {
                        return d.rank;
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
                        return color(d.group);
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
            d3.select("#gPlot").selectAll(".link")
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
        }

        function drawSPmatrix(nodes) {
			
			d3.select("#" + currentSettingsID).append("p");
            var imagesSVG = d3.select("#" + currentSettingsID)
                    .append("svg")
                    .attr("id", "svgVis")
					//.attr("width", width)
                    //.attr("width", 4 * imageWidth + 3 * matrixGap)
                    //.attr("height", 3 * imageHeight + 2 * 60)
					.attr("width", column * imageWidth)
                    .attr("height", row * imageHeight +10)
					.style("margin", "auto");

            imagesSVG.call(tip);

            //sort nodes by rank
            nodes.sort(function (a, b) {
                return a.rank - b.rank;
            });

            cellGroup = imagesSVG
                    .append("g")
                    .attr("id", "gSPLOM")
					.attr("x", 0)
					//.attr("y", 15)
                    .style("textAlign", "center")
					.attr("transform", "translate(0,10)")
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
					.selectAll("rect")
                    .data(nodes)
                    .enter()
                    .append("rect")
                    .attr("id", function (d, i) {
                        return d.rank;
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
					
        }

        /* HELPER FUNCTIONS */

        // Generates a tooltip for SP grid based on selected ID
        function highlightSPLOMgrid(circle) {

            var cId = circle.attr("id");
            var groupElement = d3.select("#gSPLOM");
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
                    .style("stroke-width", 1);

        }

        function highlightADcircle(grid) {
            var spID = grid.attr("id");
            var groupElement = d3.select("#gPlot");
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
                    .style("stroke-width", 1);
        }
		