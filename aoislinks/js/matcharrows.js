/* Copyright 2013 Peter Cook (@prcweb); Licensed MIT */

var radius = 30, padding = 4, cols = 8;
var aoiPosData, matchData, remaining = 2;
var aoiPos = {};

function translateSVG(x, y) {
  return 'translate('+x+','+y+')';
}

function arcSVG(mx0, my0, rx, ry, xrot, larc, sweep, mx1, my1) {
  return 'M'+mx0+','+my0+' A'+rx+','+ry+' '+xrot+' '+larc+','+sweep+' '+mx1+','+my1;
}

function surname(d) {
  return d.name.split(' ')[0];
}

function fullname(d) {
  //var s = d.name.split(' ');
  //return s.length === 3 ? s[2] + ' ' + s[0] + ' ' + s[1] : s[1] + ' ' + s[0];

  return d.name;
}

function nameId(n) {
  return n.replace(/[\., ]/g, '');
}

function computeArrows() {
  matchData = _.map(matchData, function(v) {
    var wX = aoiPos[v.target].x;
    var wY = aoiPos[v.target].y;
    var lX = aoiPos[v.source].x;
    var lY = aoiPos[v.source].y;

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

function playerOver(d) {
  // Render arrows
  var m = _.filter(matchData, function(v) {return v.source === d.name || v.target === d.name;});

  var topMatches = d3.select('#chart svg g.top-matches')
    .selectAll('path')
    .data(m);

  topMatches.enter()
    .append('path')
    .classed('edge', true);

  topMatches.exit()
    .remove();

  topMatches
    .attr('d', function(d, i) {
      return arcSVG(d.targetX, d.targetY, 800, 800, 0, 0, 1, d.sourceX, d.sourceY);
    })
    .attr('marker-end', 'url(#Triangle)');

  // Highlight player
  d3.select('.players').selectAll('circle').style('fill', '#7A9D7B');
  d3.select(this).style('fill', '#225D23');

}

function makeChart() {
  var matches = d3.select('#chart svg')
    .append('g')
    .classed('matches', true);

  // Render players
  var players = d3.select('#chart svg')
    .append('g')
    .classed('players', true)
    .attr('transform', translateSVG(radius + padding, radius + padding))
    .selectAll('g')
    .data(aoiPosData)
    .enter()
    .append('g')
    //.sort(function(a, b) {return d3.ascending(a.name, b.name);})
    .attr('id', function(d) {return 'player-'+nameId(d.name);})
    .classed('player', true)
    .attr('transform', function(d, i) {
      var row = Math.floor(i / cols), col = i % cols;
      var x = 2 * col * (radius + padding), y = 2 * row * (radius + padding);
      aoiPos[d.name] = {x: x, y: y};
      return translateSVG(x, y);
    });

  computeArrows();

  players
    .append('circle')
    .attr('r', radius)
    .on('mouseover', playerOver);

  players
    .append('text')
    .text(function(d) {return fullname(d);}) //((.slice(0, 10)))
    .classed('name', true)
    .attr('y', '0.2em');

  // Front layer for matches of selected player
  var topMatches = d3.select('#chart svg')
    .append('g')
    .attr('transform', translateSVG(radius + padding, radius + padding))
    .classed('top-matches', true);


//Faded lines (straight)
  // Render matches as edges
 /* matches.attr('transform', translateSVG(radius + padding, radius + padding))
    .selectAll('line')
    .data(matchData)
    .enter()
    .append('line')
    .attr('x1', function(d, i) {return d.targetX;})
    .attr('y1', function(d, i) {return d.targetY;})
    .attr('x2', function(d, i) {return d.sourceX;})
    .attr('y2', function(d, i) {return d.sourceY;})
    .attr('marker-end', 'url(#Triangle)')
    .style('opacity', 0.1);*/

//Faded Lines (curved)
 matches.attr('transform', translateSVG(radius + padding, radius + padding))
    .selectAll('line')
    .data(matchData)
    .enter()
    .append('path')
    .classed('edge', true)
    .attr('d', function(d, i) {
      return arcSVG(d.targetX, d.targetY, 800, 800, 0, 0, 1, d.sourceX, d.sourceY);
    })    
    .attr('marker-end', 'url(#Triangle)')
    .style('opacity', function (d) {
        if (d.count>20)
          return 0.7;
        else
          return 0.1;
    });
}


d3.json('data/playergrid.json', function(err, data) {
  aoiPosData = data;
  if(!--remaining) makeChart();
});

d3.json('data/matches.json', function(err, data) {
  matchData = data;
  if(!--remaining) makeChart();
});

