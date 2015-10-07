var getResolved = function(d) { return d.data.resolved.count; };
var getCreated = function(d) { return d.data.created.count; };
var getTrend = function(d){return d.data.unresolvedTrend.count;};

var width = 600,
    height = 600;

var y = d3.scale.linear()
    .range([height, 0]);

var chart = d3.select(".chartVertical")
    .attr("width", width)
    .attr("height", height);


  y.domain([0, d3.max(data, getCreated)]);

  var barWidth = width / data.length;

  var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

  bar.append("rect")
      .attr("y", function(d) { return y(getCreated(d)); })
      .attr("height", function(d) { return height - y(getCreated(d)); })
      .attr("width", barWidth - 1)
  .style("fill", function(d){return d3.hsl(getCreated(d),0.9,0.5);});