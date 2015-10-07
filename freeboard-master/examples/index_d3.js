(function () {

  var d3PlotWidget = function (settings) {

    var self = this;    
    var currentSettings = settings;
    var htmlElement;
    var data;
    var options;
    var chartHeight = 300;
    var chartWidth = 300;

    //seems to be called once (or after settings change)
    this.render = function (element) {
      console.log('render');

      //add the chart div to the dom
      var chartDiv = '<div id="' + currentSettings.id + '" style="height:' + currentSettings.chartHeight + 'px;width:' + currentSettings.chartWidth + 'px;"></div>';
      console.log(chartDiv);
      htmlElement = $(chartDiv);
      $(element).append(htmlElement);

      self.myChartRender(currentSettings);
    }

    this.onSettingsChanged = function (newSettings) {
      currentSettings = newSettings;
    }

    //seems to be called after render whenever a calculated value changes
    this.onCalculatedValueChanged = function (settingName, newValue) {
      console.log('onCalculatedValueChanged for ' + settingName);

      if (settingName == 'data')
        data = newValue;
        
      if (settingName == 'options')
        options = newValue;

      //render the chart
      htmlElement.empty();
//      $.jqplot(currentSettings.id, data, options);

      console.log("test_chart");
      self.myChartRender(currentSettings);     
    }

    this.myChartRender = function (currentSettings) {
       heatmap_display("http://localhost:3000/db", currentSettings.id, "Spectral");
    }

    this.onDispose = function () {
    }

    this.getHeight = function () {
      return Number(currentSettings.height);
    }

    this.onSettingsChanged(settings);
  };

  freeboard.loadWidgetPlugin({
    "type_name": "d3PlotWidget",
    "display_name": "d3Plot",    
    "fill_size": true,
    "external_scripts": [
      "http://d3js.org/d3.v3.js",
      "http://d3js.org/colorbrewer.v1.min.js",
      "http://code.jquery.com/jquery-1.11.0.min.js",
    ],    
    "settings": [
      {
        "name": "id",
        "display_name": "id",
        "default_value": "chart1",
        "description": "dom element id of the chart (must be unique for multiple charts)"
      },        
      {
        "name": "data",
        "display_name": "Chart Data",
        "type": "calculated",
        "description": "The data to plot"
      },    
      {
        "name": "options",
        "display_name": "Chart Options",
        "type": "calculated",
        "description": "js object containing jqPlot options for chart"
      },
      {
        "name": "chartHeight",
        "display_name": "Chart Height (px)",
        "type": "number",
        "default_value": 300,
        "description": "chart height in pixels"
      },
      {
        "name": "chartWidth",
        "display_name": "Chart Widgth (px)",
        "type": "number",
        "default_value": 300,
        "description": "chart width in pixels"
      },      
      {
        "name": "height",
        "display_name": "Height Blocks",
        "type": "number",
        "default_value": 5,
        "description": "A height block is around 60 pixels"
      }
    ],
    newInstance: function (settings, newInstanceCallback) {
      newInstanceCallback(new d3PlotWidget(settings));
    }
  });

}());