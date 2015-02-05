(function() {
	var app = angular.module('techTreeify', ['myVisualization']);

	app.directive('myBanner', [function() {
		return {
			restrict: 'E',
			templateUrl: 'directives/banner.html'
		};
	}]);

	app.directive('myUpload', [function() {
		return {
			restrict: 'E',
			templateUrl: 'directives/upload.html'
		};
	}]);

	app.directive('myEditor', [function() {
		return {
			restrict: 'E',
			templateUrl: 'directives/tech_editor.html'
		};
	}]);

	app.directive('myTreeList', [function() {
		return {
			restrict: 'E',
			templateUrl: 'directives/tech_list.html'
		};
	}]);

	app.directive('myExport', [function(treeShare) {
		return {
			restrict: 'E',
			templateUrl: 'directives/export.html',
		};
	}]);

	app.directive('myCreate', [function(treeShare) {
		return {
			restrict: 'E',
			templateUrl: 'directives/create.html',
			controller: function($scope, $http) {
				$http.get('sample_tech_tree.json')
					.success(function(data) {
						$scope.sampleTechTree = data;
					})
					.error(function(data) {
						alert('Cannot access sample file');
					});
			},
			link: function link(scope) {
				var prepareMyTechs = function() {
					var myTechs = {
						technologies: [],
						numberOfTechs: 0,
						keys: Object.keys(new newTech()),
						name: ''
					};
					return myTechs;
				};
				if (!scope.myTechs) {
					scope.myTechs = prepareMyTechs();
				}

					function newTech(name, general_ability, general_effect, has_prerequisites, is_prerequisite_for, resource_ability, unlocks_buildings, unlocks_units) {
						this.name = name || '';
						this.general_ability = general_ability || '';
						this.general_effect = general_effect || '';
						this.has_prerequisites = has_prerequisites || [];
						this.is_prerequisite_for = is_prerequisite_for || [];
						this.resource_ability = resource_ability || '';
						this.unlocks_buildings = unlocks_buildings || '';
						this.unlocks_units = unlocks_units || '';
					};

				var getEditorKeys = function() {
					var techKeys = Object.keys(new newTech());
					var myKeys = [];
					for (key in techKeys) {
						key = techKeys[key]
						if (key !== 'has_prerequisites') {
							myKeys.push(key);
						}
					}
					return myKeys;
				}
				scope.editorKeys = getEditorKeys();

				var techIndices = {};

				var indexTechs = function() {
					for (tech in scope.myTechs.technologies) {
						techIndices[scope.myTechs.technologies[tech].name] = parseInt(tech);
					}
				};

				var parseJson = function(myJson) {
					scope.myTechs = prepareMyTechs();
					for (tech in myJson.technologies) {
						myTech = myJson.technologies[tech];
						scope.myTechs.technologies.push(new newTech(myTech.name, myTech.general_ability, myTech.general_effect, myTech.has_prerequisites, myTech.is_prerequisite_for, myTech.resource_ability, myTech.unlocks_buildings, myTech.unlocks_units));
						scope.myTechs.name = scope.sampleTechTree.name;
					}
					scope.editor = scope.myTechs.technologies[-1];
				}

				scope.showSample = function() {
					scope.nav = 'create';
					parseJson(scope.sampleTechTree);
					scope.visualize();
				}

				var createDescendants = function() {
					if (scope.editor && scope.editor.is_prerequisite_for) {
						var descendantTechs = scope.editor.is_prerequisite_for;
						for (descendantTech in descendantTechs) {
							descendantTech = descendantTechs[descendantTech];
							indexTechs();
							var activeDescendant = {};
							if (Object.keys(techIndices).indexOf(descendantTech) === -1) {
								activeDescendant = createNewTechImplicit(descendantTech);
							} else {
								activeDescendant = scope.myTechs.technologies[techIndices[descendantTech]];
							}
							prerequisites = activeDescendant.has_prerequisites.slice();
							if (prerequisites.indexOf(scope.editor.name) === -1) {
								if (!Array.isArray(prerequisites)) {prerequisites = prerequisites.split(', ');}
								if (prerequisites[0] === '') {prerequisites = [];}
								prerequisites.push(scope.editor.name);
								activeDescendant.has_prerequisites = prerequisites;
							}
						}
						
					}
				};

				var createNewTechImplicit = function(name) {
					scope.myTechs.technologies.push(new newTech(name));
					if (!scope.myTechs.numberOfTechs) {scope.myTechs.numberOfTechs = 0;} 
					scope.myTechs.numberOfTechs++;
					return scope.myTechs.technologies[scope.myTechs.numberOfTechs -1];
				}

				scope.createNewTech = function() {
					indexTechs();
					createDescendants();
					createNewTechImplicit();
					scope.rebindTech(scope.myTechs.technologies[scope.myTechs.numberOfTechs - 1]);
				};

				scope.deleteTech = function(selectedTechName) {
					indexTechs();
					scope.myTechs.technologies.splice(techIndices[selectedTechName], 1);
					delete techIndices[selectedTechName];
					scope.myTechs.technologies.map(function(e) {
						if (Array.isArray(e.has_prerequisites)) {
							e.has_prerequisites = e.has_prerequisites.filter(function(p) {return p !== selectedTechName;})
						}
						if (Array.isArray(e.is_prerequisite_for)) {
							e.is_prerequisite_for = e.is_prerequisite_for.filter(function(p) {return p !== selectedTechName;})	
						}
					})
					scope.visualize();
				}

				scope.removeAllPrerequisites = function() {
					scope.myTechs.technologies = scope.myTechs.technologies.map(function(e) {
						e.is_prerequisite_for = [];
						e.has_prerequisites = [];
						return e;
					});
					scope.visualize();
				}

				var toArray = function(s) {
					s = s.split(',');
					s = s.filter(function(e) {return e.trim() !== '';});
					s = s.map(function(e) {return e.trim();});
					return s;
				}

				scope.printKey = function(key) {
					if (Array.isArray(key)) {
						key = key.join(', ');
					}
					return key;
				}

				scope.rebindTech = function(selectedTech) {
					if (scope.editor !== undefined && scope.editor.is_prerequisite_for && !Array.isArray(scope.editor.is_prerequisite_for)) {
						scope.editor.is_prerequisite_for = toArray(scope.editor.is_prerequisite_for);
					}
					createDescendants();
					scope.editor = selectedTech;
					scope.visualize();
				};

				scope.createNewTree = function() {
					scope.nav = 'create';
					scope.editor = undefined;
					scope.myTechs.name = undefined;
					scope.myTechs = prepareMyTechs();
					scope.visualize();
				};

				scope.uploadNewTree = function() {
					scope.nav = 'create';
					scope.upload = true;
				};

				scope.processUploaded = function(myJson) {
					parseJson(JSON.parse(myJson));
					scope.visualize();
					scope.upload = false;
				}

				scope.exportTree = function() {
					scope.nav = 'export';
					createDescendants();
					scope.visualize();
					scope.treeShare = {};
					scope.treeShare.name = scope.myTechs.name;
					scope.treeShare.technologies = scope.myTechs.technologies.slice();
					scope.treeShare.technologies.map(function(e) {
						for (property in e) {
							if (Object.keys(new newTech()).indexOf(property) === -1) {delete e[property];}
						}
					})
					scope.treeShare = JSON.stringify(scope.treeShare, undefined, 2);
				};
			}
		};

	}]);

})();