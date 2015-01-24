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
				var APIPrefix = '/api/'
				var getURL = APIPrefix + 'gettechtree/';
				var postURL = APIPrefix + 'posttechtree/';
				var demoTechTreeSrc = 'sample_tech_tree.json';

				$scope.getTechTree = function(treeName) {
					techTreeList.techsNoArrays = {};
					$http.get(getURL + treeName)
						.success(function(data) {
							techTreeList.techsNoArrays = techTreeList.DisArrayed(data.technologies);
							if (data.message === 'success') {
								techTreeList.name = data.name;
							} else {
								techTreeList.name = data.name + ' not found';
							}
						});
				};

				$scope.sendTechTree = function() {
					newTechTree = angular.toJson(techTreeList, true);
					$http.post(postURL, newTechTree)
						.success(function(data, status, headers, config) {
						alert(data.message)
						})

						.error(function(data, status, headers, config) {
							alert('Upload unsuccessful');
							console.log(data);
							console.log(status);
							console.log(headers);
						});
				};

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
				scope.editing = false;
				scope.previousEdit = {'element': '', 'values': ''};
				scope.reconnectEditedTech = function (event, techObject) {
					scope.editing = true;

					/* Reset tech to last saved state */
					var resetTech = function (techToResetElement, techHtml) {
							techToResetElement.html(techHtml);
							techToResetElement.append($compile(techToResetElement.contents())(scope));
					};

					/* Save tech if button pressed */
					scope.saveEdits = function () {
						if (scope.editor) {
							var newHtml = '';
							for (key in scope.editor) {
								currentlyEditedTechObjectReference[key] = scope.editor[key];
								newHtml += '<div class="' + key + '">' + scope.editor[key] + '</div>'
							}
							scope.previousEdit.values = newHtml;
						}
					};

					/* Reset tech if another clicked while editing previous*/
					if (scope.previousEdit.element) {
						resetTech(scope.previousEdit.element, scope.previousEdit.values);

					}

					/* Get the clicked tech */
					var techElement = angular.element(event.currentTarget);
					var currentlyEditedTechObjectReference = techObject;
					scope.previousEdit.element = techElement;
					scope.previousEdit.values = techElement.html();
					
					scope.editor = {};

					/* populate the editor form */
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