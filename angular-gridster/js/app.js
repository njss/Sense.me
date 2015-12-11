(function() {
	angular.module('app', ['gridster', 'ui.bootstrap', 'ngRoute'])
		.config(['$routeProvider',
			function($routeProvider) {
				$routeProvider
					.when('/main', {
						templateUrl: 'templates/main.html',
						controller: 'MainCtrl'
					})
					.when('/histograms', {
						templateUrl: 'templates/histograms.html',
//        						controller: 'HistogramCtrl'
					})
					.when('/analysis', {
						templateUrl: 'templates/analysis.html',
						controller: 'AnalysisCtrl'
					})
					.otherwise({
						redirectTo: '/main'
					});
			}
		])
		.controller('RootCtrl', function($scope) {
			$scope.$on('$locationChangeStart', function(e, next, current) {
				$scope.page = next.split('/').splice(-1);
				$scope.styleUrl = 'css/' + $scope.page + '.css'
			});
		});
})();
