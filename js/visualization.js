(function() {
	var app = angular.module('myVisualization', []);

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
					var technologies = scope.myTechs.techs;
					var json_content = {}
					var techIndices = {};
					for (tech in technologies) {
						techIndices[technologies[tech].name] = parseInt(tech);
					}

					json_content = technologies;
					//console.log(JSON.stringify(json_content, undefined, 4));

					var nodes = d3.values(json_content);
					//console.log(nodes);

					var links = [];

					for (source in json_content) {
						if (json_content[source].is_prerequisite_for) {
							var ipf = json_content[source].is_prerequisite_for.split(',');
							for (target in ipf) {
								links.push({'source': parseInt(source), 'target': techIndices[ipf[target].trim()]});
							}
						}
					}

					//console.log(links);


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