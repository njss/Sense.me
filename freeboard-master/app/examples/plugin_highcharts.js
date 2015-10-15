// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ freeboard.io-highcharts                                            │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2014 Hugo Sequeira (https://github.com/hugocore)       │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the MIT license.                                    │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Freeboard widget plugin for Highcharts.                            │ \\
// └────────────────────────────────────────────────────────────────────┘ \\

(function() {

	//
	// DECLARATIONS
	//
	var HIGHCHARTS_ID = 0;
	var ONE_SECOND_IN_MILIS = 1000;
	var MAX_NUM_SERIES = 3;

	//
	// HELPERS
	//

	// Get coordinates of point
	function xy(obj, x, y) {
		return [ obj[x], obj[y] ]
	}

	// Get label between double quotes
	function getDatasourceName(str) {
		var ret = "";
		if (/"/.test(str)) {
			ret = str.match(/"(.*?)"/)[1];
		} else {
			ret = str;
		}
		return ret;
	}

	//
	// TIME SERIES CHARTS
	//
	var highchartsLineWidgetSettings = [
			{
				"name" : "timeframe",
				"display_name" : "Timeframe (s)",
				"type" : "text",
				"description" : "Specify the last number of seconds you want to see.",
				"default_value" : 60
			},
			{
				"name" : "blocks",
				"display_name" : "Height (No. Blocks)",
				"type" : "text",
				"default_value" : 4
			},
			{
				"name" : "title",
				"display_name" : "Title",
				"type" : "text"
			},
			{
				"name" : "xaxis",
				"display_name" : "X-Axis",
				"type" : "calculated",
				"default_value" : "{\"title\":{\"text\" : \"Time\"}, \"type\": \"datetime\", \"floor\":0}"
			},
			{
				"name" : "yaxis",
				"display_name" : "Y-Axis",
				"type" : "calculated",
				"default_value" : "{\"title\":{\"text\" : \"Values\"}, \"minorTickInterval\":\"auto\", \"floor\":0}"
			} ];

	for (i = 1; i <= MAX_NUM_SERIES; i++) {
		var dataSource = {
			"name" : "series" + i,
			"display_name" : "Series " + i + " - Datasource",
			"type" : "calculated"
		};

		var xField = {
			"name" : "series" + i + "X",
			"display_name" : "Series " + i + " - X Field Name",
			"type" : "text"
		};

		var yField = {
			"name" : "series" + i + "Y",
			"display_name" : "Series " + i + " - Y Field Name",
			"type" : "text"
		};
		highchartsLineWidgetSettings.push(dataSource);
		highchartsLineWidgetSettings.push(xField);
		highchartsLineWidgetSettings.push(yField);
	}

	freeboard
			.loadWidgetPlugin({
				"type_name" : "highcharts-timeseries",
				"display_name" : "Time series (Highcharts)",
				"description" : "Time series line chart.",
				"external_scripts" : [
						"http://code.highcharts.com/highcharts.js",
						"http://code.highcharts.com/modules/exporting.js",
						"js/freeboard/plugins/plugin_highcharts_theme.js" ],
				"fill_size" : true,
				"settings" : highchartsLineWidgetSettings,
				newInstance : function(settings, newInstanceCallback) {
					newInstanceCallback(new highchartsTimeseriesWidgetPlugin(
							settings));
				}
			});

	var highchartsTimeseriesWidgetPlugin = function(settings) {

		var self = this;
		var currentSettings = settings;

		var thisWidgetId = "highcharts-widget-timeseries-" + HIGHCHARTS_ID++;
		var thisWidgetContainer = $('<div class="highcharts-widget" id="'
				+ thisWidgetId + '"></div>');

		function createWidget() {

			// Get widget configurations
			var thisWidgetXAxis = JSON.parse(currentSettings.xaxis);
			var thisWidgetYAxis = JSON.parse(currentSettings.yaxis);
			var thisWidgetTitle = currentSettings.title;
			var thisWidgetSeries = [];

			for (i = 1; i <= MAX_NUM_SERIES; i++) {
				var datasource = currentSettings['series' + i];
				if (datasource) {
					var label = getDatasourceName(datasource);
					var newSeries = {
						id : 'series' + i,
						name : label,
						data : [],
						connectNulls : true
					};
					thisWidgetSeries.push(newSeries);
				}
			}

			// Create widget
			thisWidgetContainer
					.css('height', 60 * self.getHeight() - 10 + 'px');
			thisWidgetContainer.css('width', '100%');

			thisWidgetContainer.highcharts({
				chart : {
					type : 'spline',
					animation : Highcharts.svg,
					marginRight : 20
				},
				title : {
					text : thisWidgetTitle
				},
				xAxis : thisWidgetXAxis,
				yAxis : thisWidgetYAxis,
				tooltip : {
					formatter : function() {
						return '<b>'
								+ this.series.name
								+ '</b><br/>'
								+ Highcharts.dateFormat('%Y-%m-%d %H:%M:%S',
										this.x) + '<br/>'
								+ Highcharts.numberFormat(this.y, 2);
					}
				},
				series : thisWidgetSeries
			});
		}

		self.render = function(containerElement) {
			$(containerElement).append(thisWidgetContainer);
			createWidget();
		}

		self.getHeight = function() {
			return currentSettings.blocks;
		}

		self.onSettingsChanged = function(newSettings) {
			currentSettings = newSettings;
			createWidget();
		}

		self.onCalculatedValueChanged = function(settingName, newValue) {
			var chart = thisWidgetContainer.highcharts();
			var series = chart.get(settingName);
			if (series) {
				var timeframeMS = currentSettings.timeframe*ONE_SECOND_IN_MILIS;
				var seriesno = settingName;
				var len = series.data.length;
				var shift = false;
				
				// Check if it should shift the series
				if (series.data.length > 1) {
					var first = series.data[0].x;
					//var last = series.data[series.data.length-1].x;
					var last = new Date().getTime();
					// Check if time frame is complete
					if (last-first>timeframeMS) {
						shift = true;
					}
				}
				
				series.addPoint(xy(newValue,
						[ currentSettings[seriesno + "X"] ],
						[ currentSettings[seriesno + "Y"] ]), true,
						shift, true);
			}
		}

		self.onDispose = function() {
			return;
		}
	}

	//
	// PIE CHARTS
	//

	var highchartsPieWidgetSettings = [ {
		"name" : "blocks",
		"display_name" : "Height Blocks",
		"type" : "text",
		"default_value" : 5
	}, {
		"name" : "title",
		"display_name" : "Title",
		"type" : "text"
	}, {
		"name" : "showLabel",
		"display_name" : "Show Labels",
		"type" : "option",
		"options" : [ {
			"name" : "Yes",
			"value" : true
		}, {
			"name" : "No",
			"value" : false
		} ]
	}, {
		"name" : "showLegend",
		"display_name" : "Show Bottom Legends",
		"type" : "option",
		"options" : [ {
			"name" : "Yes",
			"value" : true
		}, {
			"name" : "No",
			"value" : false
		} ]
	}, {
		"name" : "datasource",
		"display_name" : "Datasource",
		"type" : "calculated"
	}, {
		"name" : "seriesLabel",
		"display_name" : "Label Field Name",
		"type" : "text"
	}, {
		"name" : "seriesValue",
		"display_name" : "Value Field Name",
		"type" : "text"
	} ];

	freeboard.loadWidgetPlugin({
		"type_name" : "highcharts-pie",
		"display_name" : "Pie chart (Highcharts)",
		"description" : "Pie chart with legends.",
		"external_scripts" : [ "http://code.highcharts.com/highcharts.js",
				"http://code.highcharts.com/modules/exporting.js",
				"js/freeboard/plugins/plugin_highcharts_theme.js" ],
		"fill_size" : true,
		"settings" : highchartsPieWidgetSettings,
		newInstance : function(settings, newInstanceCallback) {
			newInstanceCallback(new highchartsPieWidgetPlugin(settings));
		}
	});

	var highchartsPieWidgetPlugin = function(settings) {

		var self = this;
		var currentSettings = settings;

		var thisWidgetId = "highcharts-widget-pie-" + HIGHCHARTS_ID++;
		var thisWidgetContainer = $('<div class="highcharts-widget" id="'
				+ thisWidgetId + '"></div>');

		function createWidget() {

			// Get widget configurations
			var thisWidgetTitle = currentSettings.title;
			var thisWidgetSeries = [];
			var thisWidgetLabels = (currentSettings.showLabel === "true");
			var thisWidgetLegends = (currentSettings.showLegend === "true");

			for (i = 1; i <= MAX_NUM_SERIES; i++) {
				var datasource = currentSettings['series' + i];
				if (datasource) {
					var label = getDatasourceName(datasource);
					var newSeries = {
						id : 'series' + i,
						name : label,
						data : [],
						connectNulls : true
					};
					thisWidgetSeries.push(newSeries);
				}
			}

			// Create widget
			thisWidgetContainer
					.css('height', 60 * self.getHeight() - 10 + 'px');
			thisWidgetContainer.css('width', '100%');

			thisWidgetContainer
					.highcharts({
						chart : {
							plotBackgroundColor : null,
							plotBorderWidth : null,
							plotShadow : false,
							margin : 40
						},
						title : {
							text : thisWidgetTitle
						},
						tooltip : {
							pointFormat : '<b>{point.percentage:.1f}%</b>'
						},
						plotOptions : {
							pie : {
								allowPointSelect : true,
								cursor : 'pointer',
								dataLabels : {
									enabled : thisWidgetLabels,
									distance: 5,
									format : '<b>{point.name}</b><br>{point.percentage:.1f} %',
									style : {
										color : (Highcharts.theme && Highcharts.theme.contrastTextColor)
												|| 'black'
									}
								},
								showInLegend : thisWidgetLegends
							}
						},
						legend : {
							enabled : thisWidgetLegends
						},
						series : [ {
							id : 'series',
							type : 'pie',
							data : [ [ 'Loading...', 100 ] ]
						} ]
					});
		}

		self.render = function(containerElement) {
			$(containerElement).append(thisWidgetContainer);
			createWidget();
		}

		self.getHeight = function() {
			return currentSettings.blocks;
		}

		self.onSettingsChanged = function(newSettings) {
			currentSettings = newSettings;
			createWidget();
		}

		self.onCalculatedValueChanged = function(settingName, newValue) {

			var chart = thisWidgetContainer.highcharts();
			var series = chart.get('series');

			if (series && newValue instanceof Array) {
				var data = [];
				var labelField = currentSettings.seriesLabel;
				var valueField = currentSettings.seriesValue;
				if (!_.isUndefined(labelField) && !_.isUndefined(valueField)) {
					_.each(newValue, function(ranking) {
						data.push(xy(ranking, labelField, valueField));
					});
				}
				var redraw = true;
				var animation = true;
				var updatePoints = true;
				series.setData(data, redraw, animation, updatePoints);
			}

		}

		self.onDispose = function() {
			return;
		}
	}

}());