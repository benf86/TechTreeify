(function() {
	var app = angular.module('techTreeify', []);
	

	app.directive('myTechTreeEditor', ['$http', '$compile', function($http, $compile) {
		return {
			restrict: 'E',
			templateUrl:'directives/tech-tree-list.html',
			scope: {},

			/* Fetch data from API */
			controller: function ($scope, $http) {
				var techTreeList = this;
				techTreeList.techs = [];

				$http.get('/api/json')
					.success(function(data) {
						techTreeList.techs = data.technologies;
						techTreeList.techsNoArrays = techTreeList.DisArrayed(data.technologies);
					});

				techTreeList.DisArrayed = function(techTreeList) {
					for (item in techTreeList) {
							for (item_prop in techTreeList[item]) {
								if (techTreeList[item][item_prop].constructor === Array) {
									techTreeList[item][item_prop] = techTreeList[item][item_prop].join(', ');
								}
							}
						}
					return techTreeList;
				};

			},
			controllerAs: 'Ttc',

			/* When a tech is clicked in the list, populate the form fields and rebind
			its values to the form's fields' models */
			link: function link(scope, element, attrs) {
				scope.editor = {};
				scope.previousEdit = {'element': '', 'values': ''};
				scope.reconnectEditedTech = function (event, techObject) {

					/* Reset tech to last saved state */
					var resetTech = function (techToResetElement, techHtml) {
							techToResetElement.html(techHtml);
							techToResetElement.append($compile(techToResetElement.contents())(scope));
					};

					/* Reset tech if button pressed */
					scope.resetCurrentlyEdited = function () {
						resetTech(scope.previousEdit.element, scope.previousEdit.values);
					};

					/* Save tech if button pressed */
					scope.saveEdits = function () {
						for (key in scope.editor) {
							currentlyEditedTechObjectReference[key] = scope.editor[key];
						}	
					};

					/* Reset tech if another clicked while editing previous*/
					if (scope.previousEdit.element) {
						console.log("Resetting on default");
						resetTech(scope.previousEdit.element, scope.previousEdit.values);
					}

					
					/* Get the clicked tech */
					var techElement = angular.element(event.currentTarget);
					var currentlyEditedTechObjectReference = techObject;
					scope.previousEdit.element = techElement;
					scope.previousEdit.values = techElement.html();
					
					scope.editor = {};

					/* populate the editor form - auto-execute */
					var populateEditor = function() {
						for (key in techObject) {
							if (techObject.hasOwnProperty(key) && key !== '$$hashKey') {
								scope.editor[key] = techObject[key];		
						}
					}
					};

					/* Re-render the tech with bindings to the editor form - auto-executes on click */
					var bindToEditor = function () {
						populateEditor();
						techElement.html("");
						var newHtml = "";
						for (key in scope.editor) {
							newHtml += '<div class="' + key + '">{{editor.' + key + '}}</div>'
						}
						techElement.html(newHtml);
						techElement.append($compile(techElement.contents())(scope));
					}();

					/* Re-render the tech with bindings to controller */
					var unBindFromEditor = function () {
						techElement.html("");
						var newHtml = "";
						for (key in scope.editor) {
							newHtml += '<div class="' + key + '">{{Ttc.techsNoArrays[editor["indexOf"]]["' + key + '"]}}</div>'
						}
						techElement.html(newHtml);
						techElement.append($compile(techElement.contents())(scope));
					};
				};	
			}
		};
	}]);

	app.directive('myVisualization', function() {
		return {
			restrict: 'E',
			templateUrl:'directives/visualization.html'
		}
	});

	app.directive('myHeaderAndNav', function() {
		return {
			restrict: 'E',
			templateUrl:'directives/header-and-nav.html'
		}
	});
})();