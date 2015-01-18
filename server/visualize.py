import flask

import techtree

app = flask.Flask(__name__, static_folder='../client/')

@app.route("/")
@app.route("/<tree_name>")
@app.route("/json")
@app.route("/json/<tree_name>")
def json_tree(tree_name="Unnamed Tree"):
    return flask.jsonify(techtree.TechTree().build_dictionary())

if __name__ == "__main__":
    app.run(debug=True)
