/* Copyright 2013 Peter Cook (@prcweb); Licensed MIT */

var radius = 30, padding = 4, cols = 8;
var aoiPosData2, matchData2, remaining2 = 2;
var aoiPos2 = {};

var numColors = 50;
var chartDiv;

var colArray = ['red', 'purple', 'blue', 'green', 'yellow', 'orange', 'red']

// this file should have my code for doing d3 stuff
var colorMods = ['default', "hsv", "hsl", "lab", "lch"]

var scale = chroma.scale(colArray);

var compare = function array_compare(a1, a2) {
    if (a1.length != a2.length) {
        return false;
    }
    for (var i in a1) {
        // Don't forget to check for arrays in our arrays.
        if (a1[i] instanceof Array && a2[i] instanceof Array) {
            if (!array_compare(a1[i], a2[i])) {
                return false;
            }
        }
        else if (a1[i] != a2[i]) {
            return false;
        }
    }
    return true;
}


function translateSVG(x, y) {
    return 'translate(' + x + ',' + y + ')';
}

function arcSVG(mx0, my0, rx, ry, xrot, larc, sweep, mx1, my1) {
    return 'M' + mx0 + ',' + my0 + ' A' + rx + ',' + ry + ' ' + xrot + ' ' + larc + ',' + sweep + ' ' + mx1 + ',' + my1;
}

function surname(d) {
    return d.name.split(' ')[0];
}

function fullname(d) {
    return d.name;
}

function nameId(n) {
    return n.replace(/[\., ]/g, '');
}

function drawArrows() {
    matchData2 = _.map(matchData2, function (v) {
        var wX = aoiPos2[v.target].x;
        var wY = aoiPos2[v.target].y;
        var lX = aoiPos2[v.source].x;
        var lY = aoiPos2[v.source].y;

        // Truncate lines so that they don't overlap circles
        var alpha = Math.atan2(lY - wY, lX - wX);

        wX += radius * Math.cos(alpha);
        wY += radius * Math.sin(alpha);

        lX -= (radius + 2) * Math.cos(alpha);
        lY -= (radius + 2) * Math.sin(alpha);

        v.sourceX = lX;
        v.sourceY = lY;
        v.targetX = wX;
        v.targetY = wY;


        return v;
    });
}

function playerOver2(d) {

    // Render arrows
    var m = _.filter(matchData2, function (v) {
        return v.target === d.name; //|| v.source === d.name;
    });

    var topMatches = d3.select('#svgMatch2 g.top-matches')
        .selectAll('path')
        .data(m);

    topMatches.enter()
        .append('path')
        .classed('edge', true);

    topMatches.exit()
        .remove();

    topMatches
        .attr('d', function (d, i) {
            return arcSVG(d.targetX, d.targetY, 800, 800, 0, 0, 1, d.sourceX, d.sourceY);
        })
        .style("stroke-width", function(d){
            return Math.floor((Math.random() * 9) + 1);
        })
        .style('stroke', function (d) {
            return "black";
        })
        .attr('marker-end', 'url(#Triangle2)');


    // Highlight player
    d3.select('.players').selectAll('circle').style("fill", function (d, i) {
        //colors!!!
        var colval = i * (1 / (numColors - 1));
        return scale(colval).hex();
    });

    d3.select(this).style('fill', '#225D23');

}

function Create2DArray(rows, columns) {
    Brady = new Array(rows);
    for (i = 0; i < Brady.length; ++i)
        Brady [i] = new Array(columns);
    return Brady;
}

function drawChart(div) {
    chartDiv = div;
    var matches = d3.select('#svgMatch2')
        .append('g')
        .classed('matches', true);

    // Render players
    var players = d3.select('#svgMatch2')
        .append('g')
        .classed('players', true)
        .attr('transform', translateSVG(radius + padding, radius + padding))
        .selectAll('g')
        .data(aoiPosData2)
        .enter()
        .append('g')
        //.sort(function(a, b) {return d3.ascending(a.name, b.name);})
        .attr('id', function (d) {
            return 'player-' + nameId(d.name);
        })
        .classed('player', true)
        .attr('transform', function (d, i) {
            var row = Math.floor(i / cols), col = i % cols;
            var x = 2 * col * (radius + padding), y = 2 * row * (radius + padding);
            aoiPos2[d.name] = {x: x, y: y};
            return translateSVG(x, y);
        });

    drawArrows();

    players.append('circle')
        .attr('r', radius)
        .on('mouseover', playerOver2);


    var arr = Create2DArray(40, 2);

    players.append('text')
        .text(function (d, i) {
            arr[i][0] = d.totalDuration;
            arr[i][1] = d.totalDuration;
            return fullname(d);

        }) //((.slice(0, 10)))
        .classed('name', true)
        .attr('y', '0.2em');

    players.selectAll('circle').style("fill", function (d, i) {
        //colors!!!
        var colval = i * (1 / (numColors - 1));
        return scale(colval).hex();

    });

    // Front layer for matches of selected player
    var topMatches = d3.select('#svgMatch2')
        .append('g')
        .attr('transform', translateSVG(radius + padding, radius + padding))
        .classed('top-matches', true);


    //Faded Lines (curved)
    matches.attr('transform', translateSVG(radius + padding, radius + padding))
        .selectAll('line')
        .data(matchData2)
        .enter()
        .append('path')
        .classed('edge', true)
        .attr('d', function (d, i) {
            return arcSVG(d.targetX, d.targetY, 800, 800, 0, 0, 1, d.sourceX, d.sourceY);
        })
        .attr('marker-end', 'url(#Triangle2)')
        //.style("stroke-width", function(d){
        //    return Math.floor((Math.random() * 6) + 1);
        //})
        .style('opacity', function (d) {
            //if (d.count > 20)
            //    return 0.7;
            //else
                return 0.1;
        })
        //.style('stroke', function (d) {
                //if (d.count > 20)
                //    return "#FF00FF";
                //else
                //return "#B90505";
        //})
        ;
}


