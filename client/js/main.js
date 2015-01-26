(function() {
	var app = angular.module('techTreeify', []);
	

	app.directive('myTechTreeEditor', ['$http', '$compile', function($http, $compile) {
		return {
			restrict: 'E',
			templateUrl:'directives/tech-tree-list.html',

			/* Fetch data from API */
			controller: function ($scope, $http) {
				var techTreeList = this;
				techTreeList.technologies;
				$scope.techsExist = false;
				var APIPrefix = '/api/'
				var getURL = APIPrefix + 'gettechtree/';
				var postURL = APIPrefix + 'posttechtree/';
				var demoTechTreeSrc = 'sample_tech_tree.json';

				/* HTTP GET request to the API to get the tech tree */
				$scope.getTechTree = function(treeName) {
					techTreeList.technologies = {};
					$scope.techsExist = false;
					$scope.editor = {};
					$scope.searchTech = '';
					$scope.editing = false;
					$http.get(getURL + treeName)
						.success(function(data) {
							techTreeList.technologies = techTreeList.DisArrayed(data.technologies);
							if (data.message === 'success') {
								techTreeList.name = data.name;
								if (techTreeList.technologies[0]) {
									$scope.techsExist = true;
									$scope.visualize();
								}
							} else {
								techTreeList.name = data.name;
							}
						});
				};

				/* Return names of all currently existing techs in an array or false */
				$scope.currentTechNames = function() {
					var currentTechNames = [];
					for (each in $scope.Ttc.technologies) {
						currentTechNames.push(techTreeList.technologies[each].name);
					}
					if (currentTechNames.length > 0) {
						return currentTechNames;
					}
					return false;
				};

				/* HTTP POST request to the API to upload the tech tree */
				$scope.sendTechTree = function() {
					var newTechTree = angular.toJson(techTreeList, true);
					$http.post(postURL, newTechTree)
						.error(function(data, status, headers, config) {
							alert('Upload unsuccessful');
							console.log(data);
							console.log(status);
							console.log(headers);
						});
				};

				/* Convert arrays in techs' properties to comma-separated strings */
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


			link: function link(scope, element, attrs) {
				scope.editor = {};
				scope.editing = false;
				scope.previousEdit = {'element': '', 'values': ''};

				/* Add new tech data to the controllers array of techs */
				scope.createTech = function() {
					scope.Ttc.name = scope.getTech;
					var existingTechs = scope.currentTechNames();
					if (!scope.editor.name || (existingTechs && existingTechs.indexOf(scope.editor.name) !== -1)) {
						alert("Invalid name - none or already exists!");
						scope.searchTech = scope.editor.name;
					} else {
						scope.searchTech = scope.editor.name;
						var newTech = function() {
							var newTech = {};
							for (key in scope.editor) {
								newTech[key] = scope.editor[key];
							}
							return newTech;
						}
						scope.Ttc.technologies.push(newTech());
						scope.editor = {}
						scope.techsExist = true;
					}
					scope.visualize();
				};

				/* When a tech is clicked in the list, populate the form fields and rebind
				its values to the form's fields' models */
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
						scope.visualize();
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
							if (techObject.hasOwnProperty(key) && key !== '$$hashKey' && key !== 'px' && key !== 'py' && key !== 'x' && key !== 'y' && key !== 'weight' && key !== 'image_path' && key !== 'index' ) {
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

	app.directive('myVisualization', [function() {
		return {
			restrict: 'E',
			templateUrl:'directives/visualization.html',
			link: function link(scope, element, attrs) {
				var w = 1100,
					h = 900;

				var svg = d3.select("#visualization").append("svg:svg")
						.attr("width", w)
						.attr("height", h)
						.attr("float", 'right');

				scope.visualize = function() {
					var technologies = scope.Ttc.technologies;
					var json_content = {}
					var techIndices = {};
					for (tech in technologies) {
						techIndices[technologies[tech].name] = parseInt(tech);
					}

					json_content = technologies;

					var nodes = d3.values(json_content);
					console.log(nodes);

					var links = [];

					for (source in json_content) {
						if (json_content[source].is_prerequisite_for) {
							var ipf = json_content[source].is_prerequisite_for.split(',');
							for (target in ipf) {
								links.push({'source': parseInt(source), 'target': techIndices[ipf[target].trim()]});
							}
						}
					}

					console.log(links);


					if (svg !== {}) {
						d3.select("#visualization svg").html("");
					}

					var force = d3.layout.force()
						.nodes(nodes)
						.links(links)
						.size([w, h])
						.charge(-500)
						.start();

					var link = svg.selectAll("line.link")
						.data(links)
						.enter()
							.append("svg:line")
								.attr("class", "link")
								.attr("marker-end", "url(#end)");;

					// build the arrow.
					svg.append("svg:defs").selectAll("marker")
						.data(["end"])      // Different link/path types can be defined here
						.enter()
							.append("svg:marker")    // This section adds in the arrows
								.attr("id", String)
								.attr("viewBox", "0 -5 10 10")
								.attr("refX", 15)
								.attr("refY", 0)
								.attr("markerWidth", 6)
								.attr("markerHeight", 6)
								.attr("orient", "auto")
							.append("svg:path")
								.attr("d", "M0,-5L10,0L0,5")
								.attr("fill", "orange")
								.attr("stroke", "black");

					var node = svg.selectAll(".node")
						.data(nodes)
						.enter()
							.append("g")
								.attr("class", "node")
								.call(force.drag);

					//node.append("image")
					//  .attr("xlink:href", "https://github.com/favicon.ico")
					//  .attr("x", -8)
					//  .attr("y", -8)
					//  .attr("width", 16)
					//  .attr("height", 16);

					node.append("circle")
						.attr("r", 5)
						.attr("fill", function(d) {
							if(!d.has_prerequisites || d.has_prerequisites.length === 0)
								{ return "orange"; }
							return "black";
						})
						.attr("stroke", function(d) {
							if (!d.has_prerequisites || !d.has_prerequisites.length) { return "black"; }
						});

					node.append("text")
					  .attr("dx", 7)
					  .attr("dy", ".35em")
					  .text(function(d) { return d.name });

					force.on("tick", function() {
						link.attr("x1", function(d) { return d.source.x; })
							.attr("y1", function(d) { return d.source.y; })
							.attr("x2", function(d) { return d.target.x; })
							.attr("y2", function(d) { return d.target.y; });

						node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
					});
				};
			}
		}
	}]);
})();