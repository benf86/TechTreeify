(function() {
	var app = angular.module('techTreeify', []);

	app.controller('TechTreeCtrl', ['$scope', '$http', function($scope, $http) {
		var techTreeList = this;
		techTreeList.techs = [];
		$http.get('/api/json')
			.success(function(data) {
				techTreeList.techs = data;
				techTreeList.techsNoArrays = techTreeList.DisArrayed(data);
			});
		techTreeList.DisArrayed = function(ttl) {
			for (item in ttl) {
					for (item_prop in ttl[item]) {
						if (ttl[item][item_prop].constructor === Array) {
							ttl[item][item_prop] = ttl[item][item_prop].join(', ');
						}
					}
				}
			return ttl;
		};
	}]);

	app.directive('headerAndNav', function() {
		return {
			restrict: 'E',
			templateUrl:'directives/header-and-nav.html',
			controller: function() {},
			controllerAs: 'nav'
		}
	});

	app.directive('mainContent', function() {
		return {
			restrict: 'E',
			templateUrl:'directives/main-content.html'
		}
	});

	app.directive('techTreeList', function() {
		return {
			restrict: 'E',
			templateURL:'directives/tech-tree-list.html'
		}
	});

	app.directive('visualization', function() {
		return {
			restrict: 'E',
			templateURL:'directives/visualization.html'
		}
	});
})();