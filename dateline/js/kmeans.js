var avgXY, distance, normalPt, randomCenter;
var initProblem;

normalPt = function(normalFun) {
  var val;
  val = normalFun();
  if (val > 0 && val < 100) {
    return val;
  } else {
    return normalPt(normalFun);
  }
};

randomCenter = function() {
  return (Math.random() * 90) + 5;
};

distance = function(a, b) {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
};

avgXY = function(arr) {
  return [
    d3.sum(arr, function(d) {
      return d[0];
    }) / arr.length, d3.sum(arr, function(d) {
      return d[1];
    }) / arr.length
  ];
};


  var centroidsGroup, colors, height, pointsGroup, svg, voronoi, voronoiGroup, width, x, y;
  if (!$('#kmeans-vis').length) {
    return;
  }
  colors = d3.scale.category10();
  width = $('.container').width();

  if (width > 600) {
    width = 600;
  }

  height = width;

  svg = d3.select('#nmeans-vis').append('svg').attr('width', width).attr('height', height);

  pointsGroup = svg.append('g').attr('id', 'points');
  centroidsGroup = svg.append('g').attr('id', 'centroids');
  voronoiGroup = svg.append('g').attr('id', 'voronoi');

  x = d3.scale.linear().range([0, width]).domain([0, 100]);
  y = d3.scale.linear().range([height, 0]).domain([0, 100]);

  voronoi = d3.geom.voronoi().x(function(d) {
    return x(d[0]);
  }).y(function(d) {
    return y(d[1]);
  });

   function initProblem() {
    var i, j, kNdx, l, ptNdx, ref, ref1, ref2, xNorm, yNorm;
    points = [];
    centroids = [];
    k = parseInt($('#k-val').val());
    n = parseInt($('#n-val').val());

    for (kNdx = i = 1, ref = k; 1 <= ref ? i <= ref : i >= ref; kNdx = 1 <= ref ? ++i : --i) {
      xNorm = d3.random.normal(randomCenter(), 12);
      yNorm = d3.random.normal(randomCenter(), 12);
      for (ptNdx = j = 1, ref1 = n / k; 1 <= ref1 ? j <= ref1 : j >= ref1; ptNdx = 1 <= ref1 ? ++j : --j) {
        points.push([normalPt(xNorm), normalPt(yNorm)]);
      }
    }

    for (kNdx = l = 1, ref2 = k; 1 <= ref2 ? l <= ref2 : l >= ref2; kNdx = 1 <= ref2 ? ++l : --l) {
      centroids.push([randomCenter(), randomCenter()]);
    }

    voronoiGroup.selectAll('*').remove();
    centroidsGroup.selectAll('*').remove();
    pointsGroup.selectAll('*').remove();

    centroidsGroup.selectAll('circle').data(centroids).enter().append('circle').style('fill', function(d, ndx) {
      return colors(ndx);
    }).attr('cx', function(d) {
      return x(d[0]);
    }).attr('cy', function(d) {
      return y(d[1]);
    }).attr('r', 4.5);
    return pointsGroup.selectAll('circle').data(points).enter().append('circle').attr('cx', function(d) {
      return x(d[0]);
    }).attr('cy', function(d) {
      return y(d[1]);
    }).attr('r', 1.5);
  };

  return window.step = function() {
    var bin, binNdx, centroid, centroidBins, centroidNdx, d, i, j, l, len, len1, len2, m, minDist, minNdx, newCentroid, point, results;

    voronoiGroup.selectAll('*').remove();

    voronoiGroup.selectAll('path').data(voronoi(centroids)).enter().append('path').style('fill', function(d, ndx) {
      return colors(ndx);
    }).attr('d', function(d) {
      return "M" + (d.join('L')) + "Z";
    });

    centroidBins = (function() {
      results = [];
      for (var i = 1; 1 <= k ? i <= k : i >= k; 1 <= k ? i++ : i--){ results.push(i); }
      return results;
    }).apply(this).map(function(d) {
      return [];
    });

    for (j = 0, len = points.length; j < len; j++) {
      point = points[j];
      minDist = 100;
      for (centroidNdx = l = 0, len1 = centroids.length; l < len1; centroidNdx = ++l) {
        centroid = centroids[centroidNdx];
        if ((d = distance(point, centroid)) < minDist) {
          minDist = d;
          minNdx = centroidNdx;
        }
      }
      centroidBins[minNdx].push(point);
    }

    for (binNdx = m = 0, len2 = centroidBins.length; m < len2; binNdx = ++m) {
      bin = centroidBins[binNdx];
      newCentroid = avgXY(bin);
      centroids[binNdx] = newCentroid;
    }

    return centroidsGroup.selectAll('circle').data(centroids).transition().attr('cx', function(d) {
      return x(d[0]);
    }).attr('cy', function(d) {
      return y(d[1]);
    });

  };

})(window);

initProblem();