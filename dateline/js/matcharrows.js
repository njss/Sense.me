/* Copyright 2013 Peter Cook (@prcweb); Licensed MIT */

var radius = 30, padding = 4, cols = 8;
var aoiPosData, matchData, remaining = 2;
var aoiPos = {};

var numColors = 50;

var colArray = ['red','purple','blue','green', 'yellow','orange','red']

// this file should have my code for doing d3 stuff
var colorMods = ['default', "hsv","hsl", "lab", "lch"]

var scale = chroma.scale(colArray);

var compare = function array_compare(a1, a2) {
 if(a1.length != a2.length) {
  return false;
 }
 for(var i in a1) {
  // Don't forget to check for arrays in our arrays.
  if(a1[i] instanceof Array && a2[i] instanceof Array) {
   if(!array_compare(a1[i], a2[i])) {
    return false;
   }
  }
  else if(a1[i] != a2[i]) {
   return false;
  }
 }
 return true;
}


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

// var kmeans = {
//    clusterColors: function(colors, k) {
//      var worker = new Worker("./kmeans-worker.js");

//      worker.onmessage = function(event) {
//        var clusters = event.data.clusters;
       
//        visualizeClusters(clusters);
//        if(event.data.time)
//          $("<div>" + event.data.time + " ms</div>")
//            .css("margin-bottom", "14px")
//            .prependTo($("#clusters"));
//      };

//      worker.onerror = function(event) {
//        console.log("Worker thread error: " + event.message
//              + " " + event.filename + " " + event.lineno);
//      }

//      worker.postMessage({
//        colors: colors,
//        frameRate: 1000,
//        k: k
//      });
//    }
// }

function visualizeClusters(clusters, point) {

  var total = 0; 
  for(var i = 0; i < clusters.length; i++) {
    var cluster = clusters[i];
    total += cluster.length;
    var width = Math.ceil(Math.sqrt(cluster.length));
   
    for(var j = 0; j < cluster.length; j++) {
      if (cluster[j]==point)
        return i;
    }
  }
}


function playerOver(d) {
  //var color = d3.scale().category20();
  var arrNameSplit = new Array();

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
  //d3.select('.players').selectAll('circle').style('fill', '#7A9D7B');
  d3.select('.players').selectAll('circle').style("fill", function(d, i) 
  { 
     //arrNameSplit = d.name.split(/(\s+)/);
    //colors!!!
    var colval =  i*(1/(numColors-1));
         return scale(colval).hex();
        //return color(arrNameSplit); 
  });

    d3.select(this).style('fill', '#225D23');

}

function Create2DArray(rows,columns) {
Brady = new Array (rows);
for (i = 0; i < Brady.length; ++ i)
  Brady [i] = new Array (columns);
   return Brady;
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

    var input = [];
 
    


  players
    .append('circle')
    .attr('r', radius)
    .on('mouseover', playerOver);





var arr = Create2DArray(40,2);

  players
    .append('text')
    .text(function(d,i) {
arr[i][0] = d.totalDuration;
arr[i][1] = d.totalDuration;
    return fullname(d);

    }) //((.slice(0, 10)))
    .classed('name', true)
    .attr('y', '0.2em');

var clusters = clusterfck.kmeans(arr, 4);

  players.selectAll('circle').style("fill", function(d, i) 
  { 
    //var duration = getTotalDuration(i);


var test=0;

var total = 0; 
  for(var i = 0; i < clusters.length-1; i++) {
    var cluster = clusters[i];
    total += cluster.length;
    var width = Math.ceil(Math.sqrt(cluster.length));
   
    for(var j = 0; j < cluster.length-1; j++) {
      if (compare(cluster[j],[d.totalDuration, d.totalDuration]))
       test =i;
    }
  }

     var colval =  test*(1/(clusters.length-1));
     
          return scale(colval).hex();
        
  });

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
    })
    .style('color', function (d) {
        if (d.count>20)
          return "#FF00FF";
        else
          return "#000000";
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


// function getTotalDuration(pos)
// {
//     for (int i = 0; aoiPosData.length-1; i++)
//     {
//         if (i == pos)
//           return aoiPosData[i].totalDuration;
//     }
// }

