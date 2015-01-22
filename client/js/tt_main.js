(function() {
	var app = angular.module('techTreeify', []);
	

	app.controller('TechTreeCtrl', ['$scope', '$compile', '$http', function($scope, $compile, $http) {
		this.editedTech = {};
		this.previousEdit = {'element': '', 'values': ''};
		var techTreeList = this;
		techTreeList.techs = [];

		$http.get('/api/json')
			.success(function(data) {
				techTreeList.techs = data.technologies;
				techTreeList.techsNoArrays = techTreeList.DisArrayed(data.technologies);
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

		$scope.reconnectEditedTech = function (event, tech) {
			$scope.editor = tech;
			console.log(tech);
			var techElement = angular.element(event.currentTarget);
			
			var resetTech = function (techToResetElement, techHtml) {
				techToResetElement.html(techHtml);
				techToResetElement.append($compile(techToResetElement.contents())($scope));
			};

			if (techTreeList.previousEdit.element) {
				resetTech(techTreeList.previousEdit.element, techTreeList.previousEdit.values);
			}

			var reconnectTech = function (scope) {
				techElement.html("");
				var newHtml = "";
				for (key in tech) {
					if (key !== '$$hashKey') {
						newHtml += "<div class=" + key + ">{{editor." + key + "}}</div>"
					}
				}
				techElement.html(newHtml);
				techElement.append($compile(techElement.contents())($scope));
			};

			techTreeList.previousEdit.element = techElement;
			techTreeList.previousEdit.values = techElement.html();
			techTreeList.editedTech = tech;

			reconnectTech();
			
			

		};
	}]);

	app.directive('hdNav', function() {
		return {
			restrict: 'E',
			templateUrl:'directives/header-and-nav.html'
		}
	});

	app.directive('techTreeList', function() {
		return {
			restrict: 'E',
			templateUrl:'directives/tech-tree-list.html'
		}
	});

	app.directive('visualization', function() {
		return {
			restrict: 'E',
			templateUrl:'directives/visualization.html'
		}
	});
})();