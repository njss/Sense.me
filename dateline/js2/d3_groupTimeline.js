var color = d3.scale.category20();
var colorList = {};
var chart, brush, main, mini, x1DateAxis, x1MonthAxis, itemRects, y1, y2, x, x1;
var data, users, items, now;
var tip;

function drawGroupTimeVis(parentDiv) {
    data = randomData(),
        users = data.lanes,
        items = data.items,
        now = new Date();

    var margin = {top: 20, right: 15, bottom: 15, left: 60},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        miniHeight = users.length * 12 + 50,
        mainHeight = height - miniHeight - 50;

    x = d3.time.scale()
        .domain([d3.time.second(d3.min(items, function (d) {
            return d.start;
        })),
            d3.max(items, function (d) {
                return d.end;
            })])
        .range([0, width]);

//    tip = d3.tip()
//            .attr('class', 'd3-tip')
//            .offset([-10, 0])
//            .html(items, function (d) {
//                return "<strong>AOI</strong> <span style='color:red'>" + d.id + "</span>";
//            });

    x1 = d3.time.scale().range([0, width]);

    var ext = d3.extent(users, function (d) {
        return d.id;
    });
    y1 = d3.scale.linear().domain([ext[0], ext[1] + 1]).range([0, mainHeight]);
    y2 = d3.scale.linear().domain([ext[0], ext[1] + 1]).range([0, miniHeight]);


    chart = d3.select("#" + parentDiv)
        .append('svg:svg')
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom)
        .attr('class', 'chart');


    chart.append('defs').append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', width)
        .attr('height', mainHeight);

//    chart.call(tip);

    main = chart.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('width', width)
        .attr('height', mainHeight)
        .attr('class', 'main');

    mini = chart.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + (mainHeight + 60) + ')')
        .attr('width', width)
        .attr('height', miniHeight)
        .attr('class', 'mini');

    // draw the lanes for the main chart
    main.append('g').selectAll('.laneLines')
        .data(users)
        .enter().append('line')
        .attr('x1', 0)
        .attr('y1', function (d) {
            return d3.round(y1(d.id)) + 0.5;
        })
        .attr('x2', width)
        .attr('y2', function (d) {
            return d3.round(y1(d.id)) + 0.5;
        })
        .attr('stroke', function (d) {
            return d.label === '' ? 'white' : 'lightgray'
        });

    main.append('g').selectAll('.laneText')
        .data(users)
        .enter().append('text')
        .text(function (d) {
            return d.label;
        })
        .attr('x', -10)
        .attr('y', function (d) {
            return y1(d.id + .5);
        })
        .attr('dy', '0.5ex')
        .attr('text-anchor', 'end')
        .attr('class', 'laneText');

    // draw the lanes for the mini chart
    mini.append('g').selectAll('.laneLines')
        .data(users)
        .enter().append('line')
        .attr('x1', 0)
        .attr('y1', function (d) {
            return d3.round(y2(d.id)) + 0.5;
        })
        .attr('x2', width)
        .attr('y2', function (d) {
            return d3.round(y2(d.id)) + 0.5;
        })
        .attr('stroke', function (d) {
            return d.label === '' ? 'white' : 'lightgray'
        });

    mini.append('g').selectAll('.laneText')
        .data(users)
        .enter().append('text')
        .text(function (d) {
            return d.label;
        })
        .attr('x', -10)
        .attr('y', function (d) {
            return y2(d.id + .5);
        })
        .attr('dy', '0.5ex')
        .attr('text-anchor', 'end')
        .attr('class', 'laneText');

    // draw the x axis
    var xDateAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        //            .ticks(d3.time.mondays, (x.domain()[1] - x.domain()[0]) > 15552e6 ? 2 : 1)
        //            .tickFormat(d3.time.format('%d'))
        .ticks(d3.time.seconds, 10)
        .tickFormat(d3.time.format('%M:%S'))
        .tickSize(6, 0, 0);

    x1DateAxis = d3.svg.axis()
        .scale(x1)
        .orient('bottom')
        .ticks(d3.time.days, 1)
        .tickFormat(d3.time.format('%a %d'))
        .tickSize(6, 0, 0)
//            .ticks(d3.time.seconds, 50)
//            .tickSize(20, 0, 0)
//            .tickFormat(d3.time.format('%Lms'));

    var xMonthAxis = d3.svg.axis()
        .scale(x)
        .orient('top')
        .ticks(d3.time.months, 1)
        .tickFormat(d3.time.format('%b %Y'))
        .tickSize(15, 0, 0);

    x1MonthAxis = d3.svg.axis()
        .scale(x1)
        .orient('top')
        .ticks(d3.time.mondays, 1)
        .tickFormat(d3.time.format('%b - Week %W'))
        .tickSize(15, 0, 0);

    main.append('g')
        .attr('transform', 'translate(0,' + mainHeight + ')')
        .attr('class', 'main axis date')
        .call(x1DateAxis);

    main.append('g')
        .attr('transform', 'translate(0,0.5)')
        .attr('class', 'main axis month')
        .call(x1MonthAxis)
        .selectAll('text')
        .attr('dx', 5)
        .attr('dy', 12);

    mini.append('g')
        .attr('transform', 'translate(0,' + miniHeight + ')')
        .attr('class', 'axis date')
        .call(xDateAxis);

    mini.append('g')
        .attr('transform', 'translate(0,0.5)')
        .attr('class', 'axis month')
        .call(xMonthAxis)
        .selectAll('text')
        .attr('dx', 5)
        .attr('dy', 12);

    // draw a line representing today's date
    main.append('line')
        .attr('y1', 0)
        .attr('y2', mainHeight)
        .attr('class', 'main todayLine')
        .attr('clip-path', 'url(#clip)');

    mini.append('line')
        .attr('x1', x(now) + 0.5)
        .attr('y1', 0)
        .attr('x2', x(now) + 0.5)
        .attr('y2', miniHeight)
        .attr('class', 'todayLine');

    // draw the items
    itemRects = main.append('g')
        .attr('clip-path', 'url(#clip)');

    var randomNumber = function (min, max) {
        return Math.floor(Math.random(0, 1) * (max - min)) + min;
    };

    mini.append('g').selectAll('miniItems')
        .data(getPaths(items))
        .enter().append('path')
        .attr('class', function (d) {
            return 'miniItem ' + d.class;
        })
        .attr('d', function (d) {
            return d.path;
        })
        .style("stroke", function (d) {
            var c = color(randomNumber(0, 20))
            colorList[d.id] = c;
            return c;
        })
//            .on("mouseover", function (d) {
//                tip.show(d);
//            })
//            .on("mouseout", function (d) {
//                tip.hide(d);
//            });

    // invisible hit area to move around the selection window
    mini.append('rect')
        .attr('pointer-events', 'painted')
        .attr('width', width)
        .attr('height', miniHeight)
        .attr('visibility', 'hidden')
        .on('mouseup', moveBrush);

    // draw the selection area
    brush = d3.svg.brush()
        .x(x)
        //            .extent([d3.time.monday(now), d3.time.saturday.ceil(now)])
        .on("brush", display);

    mini.append('g')
        .attr('class', 'x brush')
        .call(brush)
        .selectAll('rect')
        .attr('y', 1)
        .attr('height', miniHeight - 1);

    mini.selectAll('rect.background').remove();
    display();
}

function display() {

    var rects, labels
        , minExtent = d3.time.second(brush.extent()[0])
        , maxExtent = d3.time.second(brush.extent()[1])
        , visItems = items.filter(function (d) {
        return d.start < maxExtent && d.end > minExtent
    });

    mini.select('.brush').call(brush.extent([minExtent, maxExtent]));

    x1.domain([minExtent, maxExtent]);

    if ((maxExtent - minExtent) < 7000) {
        x1DateAxis.ticks(d3.time.milliseconds, 100).tickFormat(d3.time.format("%S.%L"))
    }
    else {
        x1DateAxis.ticks(d3.time.seconds, 1).tickFormat(d3.time.format('%S'))
    }

    // shift the today line
    main.select('.main.todayLine')
        .attr('x1', x1(now) + 0.5)
        .attr('x2', x1(now) + 0.5);

    // update the axis
    main.select('.main.axis.date').call(x1DateAxis);
    main.select('.main.axis.month').call(x1MonthAxis)
        .selectAll('text')
        .attr('dx', 5)
        .attr('dy', 12);

    // upate the item rects
    rects = itemRects.selectAll('rect')
        .data(visItems, function (d) {
            return d.id;
        })
        .attr('x', function (d) {
            return x1(d.start);
        })
        .attr('width', function (d) {
            return x1(d.end) - x1(d.start);
        })
        .style("fill", function(d){
            return colorList[d.id];
        });

    rects.enter().append('rect')
        .attr('x', function (d) {
            return x1(d.start);
        })
        .attr('y', function (d) {
            return y1(d.lane) + .1 * y1(1) + 0.5;
        })
        .attr('width', function (d) {
            return x1(d.end) - x1(d.start);
        })
        .attr('height', function (d) {
            return .8 * y1(1);
        })
        .attr('class', function (d) {
            return 'mainItem ' + d.class;
        })
//                .style("fill", function(){
//                    return color(randomNumber(0,20));
//                });

    rects.exit().remove();

    // update the item labels
    labels = itemRects.selectAll('text')
        .data(visItems, function (d) {
            return d.id;
        })
        .attr('x', function (d) {
            return x1(Math.max(d.start, minExtent)) + 2;
        });

    labels.enter().append('text')
        .text(function (d) {
            return 'AOI\n\n\n\n: ' + d.id;
        })
        .attr('x', function (d) {
            return x1(Math.max(d.start, minExtent)) + 2;
        })
        .attr('y', function (d) {
            return y1(d.lane) + .4 * y1(1) + 0.5;
        })
        .attr('text-anchor', 'start')
        .attr('class', 'itemLabel');

    labels.exit().remove();
}

function moveBrush() {
    var origin = d3.mouse(this)
        , point = x.invert(origin[0])
        , halfExtent = (brush.extent()[1].getTime() - brush.extent()[0].getTime()) / 2
        , start = new Date(point.getTime() - halfExtent)
        , end = new Date(point.getTime() + halfExtent);

    brush.extent([start, end]);
    display();
}

function getPaths(items) {
    var paths = {}, d, offset = .5 * y2(1) + 0.5, result = [];
    for (var i = 0; i < items.length; i++) {
        d = items[i];
        if (!paths[d.class]) paths[d.class] = '';
        result.push({id: items[i].id, class: "past", path: ['M', x(d.start), (y2(d.lane) + offset), 'H', x(d.end)].join(' ') });
    }

    return result;
}

var RandomData = function() {

    var addToLane = function (chart, item) {
        var name = item.lane;

        if (!chart.lanes[name])
            chart.lanes[name] = [];

        var lane = chart.lanes[name];

        var sublane = 0;
        while(isOverlapping(item, lane[sublane]))
            sublane++;

        if (!lane[sublane]) {
            lane[sublane] = [];
        }

        lane[sublane].push(item);
    };

    var isOverlapping = function(item, lane) {
        if (lane) {
            for (var i = 0; i < lane.length; i++) {
                var t = lane[i];
                if (item.start < t.end && item.end > t.start) {
                    return true;
                }
            }
        }
        return false;
    };

    var parseData = function (data) {
        var i = 0, length = data.length, node;
        chart = { lanes: {} };

        for (i; i < length; i++) {
            var item = data[i];

            addToLane(chart, item);


        }

        return collapseLanes(chart);
    };

    var collapseLanes = function (chart) {
        var lanes = [], items = [], laneId = 0;
        var now = new Date();

        for (var laneName in chart.lanes) {
            var lane = chart.lanes[laneName];

            for (var i = 0; i < lane.length; i++) {
                var subLane = lane[i];

                lanes.push({
                    id: laneId,
                    label: i === 0 ? laneName : ''
                });

                for (var j = 0; j < subLane.length; j++) {
                    var item = subLane[j];

                    items.push({
                        id: item.id,
                        lane: laneId,
                        start: item.start,
                        end: item.end,
                        class: item.end > now ? 'future' : 'past',
                        desc: item.desc
                    });
                }

                laneId++;
            }
        }

        return {lanes: lanes, items: items};
    }

    var randomNumber = function(min, max) {
        return Math.floor(Math.random(0, 1) * (max - min)) + min;
    };

    var generateRandomWorkItems = function () {
        var data = [];
        var laneCount = randomNumber(5,7)
            , totalWorkItems = randomNumber(10,20)
            , startMonth = randomNumber(0,1)
            , startDay = randomNumber(1,28)
            , startHour = randomNumber(8, 16)
            , totalMonths = randomNumber(4,10);

        for (var i = 0; i < laneCount; i++) {
            var dt = new Date(2012, startMonth, startDay, startHour);
            var tempSec = 0;
            //for (var j = 0; j < totalWorkItems; j++) {
            //
            //	var dtS = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + randomNumber(1,5), randomNumber(8, 16), 0, 0);
            //
            //	var dateOffset =  randomNumber(0,7);
            //	var dt = new Date(dtS.getFullYear(), dtS.getMonth(), dtS.getDate() + dateOffset, randomNumber(dateOffset === 0 ? dtS.getHours() + 2 : 8, 18), 0, 0);
            //
            //	var workItem = {
            //		id: i * totalWorkItems + j,
            //		name: 'work item ' + j,
            //		lane: 'User ' + i,
            //		start: dtS,
            //		end: dt,
            //		desc: 'This is a description.'
            //	};
            //	data.push(workItem);
            //}

            var j = 0;
            while(tempSec <= 59){
                var dtS = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), 0, tempSec, 0);

                tempSec = tempSec + randomNumber(1,10);
                var dt = new Date(dtS.getFullYear(), dtS.getMonth(), dtS.getDate(), dtS.getHours(), (tempSec >= 60) ? dtS.getMinutes() + 1 : 0, (tempSec >= 60) ? 0 : tempSec, 0);

                var workItem = {
                    id: i * totalWorkItems + j++,
                    name: 'work item ' + j++,
                    lane: 'User ' + i,
                    start: dtS,
                    end: dt,
                    desc: 'This is a description.'
                };

                data.push(workItem);
            }
        }
        return data;
    };

    return parseData(generateRandomWorkItems());
};

/**
 * Allow library to be used within both the browser and node.js
 */
var root = typeof exports !== "undefined" && exports !== null ? exports : window;
root.randomData = RandomData;