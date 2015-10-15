(function () {

  var d3ArcPlotWidget = function (settings) {

    var self = this;    
    var currentSettings = settings;
    var chartElement;
    var data;
    var options;
    var chartHeight = 300;
    var chartWidth = 300;
    var rootElement = null;
    var selectOrderElement;
    var selectPaletteElement;

    //seems to be called once (or after settings change)
    this.render = function (element) {
            $(element).append('<link rel="stylesheet" href="/css/arcStyle.css" />');
      rootElement = element;

    /* selectOrderElement = $('<select id="order_' + currentSettings.id + '" > ' +
     '<option value="null" selected> ----- </option>  ' +
     '<option value="sortinit_col_row">Initial order on columns and rows</option> ' +
     '<option value="sortinit_row">Initial order on rows</option> '+
     '<option value="sortinit_col">Initial order on columns</option> </select>');
    $(rootElement).append(selectOrderElement);


    selectPaletteElement = $('<select id="palette_' + currentSettings.id + '" > ' +
     '<option value="RdYlGn">RdYlGn</option> ' +
     '<option value="Spectral" selected>Spectral</option> ' +
     '<option value="RdYlBu">RdYlBu</option> ' +
     '<option value="RdGy">RdGy</option> ' +
     '<option value="RdBu">RdBu</option> ' +
     '<option value="PiYG">PiYG</option> ' +
     '<option value="PRGn">PRGn</option> ' +
     '<option value="BrBG">BrBG</option> ' +
     '<option value="PuOr">PuOr</option> ' +
     '</select>');
    $(rootElement).append(selectPaletteElement); */

      chartElement = $('<div id="' + currentSettings.id + '" ></div>');
      $(rootElement).append(chartElement);
    }

    this.onSettingsChanged = function (newSettings) {
      currentSettings = newSettings;
    }

    //seems to be called after render whenever a calculated value changes
    this.onCalculatedValueChanged = function (settingName, newValue) {
      

      if (settingName == 'data')
      {
          var data = newValue;
          self.myChartRender(currentSettings); 
          console.log('onCalculatedValueChanged for ' + settingName);
      }
        
      if (settingName == 'options')
        options = newValue;

      //render the chart
      //chartElement.empty();
//      $.jqplot(currentSettings.id, data, options);

      
        
    }

    this.myChartRender = function (currentSettings) {
      $(chartElement).empty();
      console.log('arc_diagram');
      DrawArcDiagram("myData.json", currentSettings.id);
    }

    this.onDispose = function () {
    }

    this.getHeight = function () {
      return Number(currentSettings.height);
    }

    this.onSettingsChanged(settings);
  };

  freeboard.loadWidgetPlugin({
    "type_name": "d3ArcPlotWidget",
    "display_name": "d3ArcPlot",    
    "fill_size": true,
    "external_scripts": [
      "http://d3js.org/d3.v3.js",
	  "plugins/thirdparty/d3.tip.v0.6.3.js",
      "http://d3js.org/colorbrewer.v1.min.js",
      //"http://code.jquery.com/jquery-1.11.0.min.js"
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
      newInstanceCallback(new d3ArcPlotWidget(settings));
    }
  });

}());