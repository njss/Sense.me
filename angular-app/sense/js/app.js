(function () {
    var app = angular.module('sense', []);

    app.controller('PanelController', function () {
        this.tab = 1;

        this.selectTab = function(selectedTab){
            this.tab = selectedTab;
        };

        this.isSet = function(checkTab){
            return this.tab === checkTab;
        };
    });

    app.directive('panelAnalysis', function(){
        return{
            restrict: 'E',
            templateUrl: './templates/panel-analysis.html'
        };
    });

    app.directive('panelHistograms', function(){
        return{
            restrict: 'E',
            templateUrl: './templates/panel-histograms.html'
        };
    });


})();