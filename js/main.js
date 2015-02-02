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
			link: function link(scope) {
				scope.myTechs = {
					techs: [],
					numberOfTechs: 0,
					keys: Object.keys(new newTech())
					};

					function newTech(name) {
						this.name = name || '';
						this.general_ability = '';
						this.general_effect = '';
						this.has_prerequisites = '';
						this.is_prerequisite_for = '';
						this.resource_ability = '';
						this.unlocks_buildings = '';
						this.unlocks_units = '';
					};
				var getEditorKeys = function() {
					var techKeys = Object.keys(new newTech());
					var myKeys = [];
					for (key in techKeys) {
						key = techKeys[key]
						if (key !== 'has_prerequisites') {
							console.log('has_prerequisites !== ' + key)
							myKeys.push(key);
						}
					}
					console.log(myKeys);
					return myKeys;
				}
				scope.editorKeys = getEditorKeys();
				console.log(scope.editorKeys);

				var techIndices = {};

				var indexTechs = function() {
					for (tech in scope.myTechs.techs) {
						techIndices[scope.myTechs.techs[tech].name] = parseInt(tech);
					}
				};

				var createDescendants = function() {
					if (scope.editor && scope.editor.is_prerequisite_for) {
						var descendantTechs = scope.editor.is_prerequisite_for.split(',');
						for (descendantTech in descendantTechs) {
							descendantTech = descendantTechs[descendantTech].trim();
							indexTechs();
							activeDescendant = {};
							if (Object.keys(techIndices).indexOf(descendantTech.trim()) === -1) {
								activeDescendant = createNewTechImplicit(descendantTech);
							} else {
								activeDescendant = scope.myTechs.techs[techIndices[descendantTech]];
							}
							prerequisites = activeDescendant.has_prerequisites.split(',').slice();
							for (each in prerequisites) {
								prerequisites[each] = prerequisites[each].trim();
							}
							if (prerequisites[0] === '') { prerequisites.shift(); }
							if (prerequisites.indexOf(scope.editor.name) === -1) {
								prerequisites.push(scope.editor.name);
								prerequisites = prerequisites.join(', ');
								activeDescendant.has_prerequisites = prerequisites;
							}
						}
						
					}
				};

				var createNewTechImplicit = function(name) {
					scope.myTechs.techs.push(new newTech(name));
					scope.myTechs.numberOfTechs++;
					return scope.myTechs.techs[scope.myTechs.numberOfTechs -1];
				}

				scope.createNewTech = function() {
					indexTechs();
					createDescendants();
					createNewTechImplicit();
					scope.rebindTech(scope.myTechs.techs[scope.myTechs.numberOfTechs - 1]);
				};

				scope.rebindTech = function(selectedTech) {
					createDescendants();
					scope.editor = selectedTech;
					scope.visualize();
				};

				scope.createNewTree = function () {
					scope.nav = 'create';
				};

				scope.exportTree = function() {
					scope.nav = 'export';
					createDescendants();
					scope.visualize();
					scope.treeShare = {};
					scope.treeShare.name = scope.myTechs.name;
					scope.treeShare.technologies = []
					for (techKey in scope.myTechs.techs) {
						tech = scope.myTechs.techs[techKey];
						scope.treeShare.technologies[techKey] = {};
						for (key in scope.myTechs.keys) {
							key = scope.myTechs.keys[key];
							scope.treeShare.technologies[techKey][key] = tech[key];
						}
					}
					scope.treeShare = JSON.stringify(scope.treeShare, undefined, 4)
				};

			}
		};

	}]);

})();