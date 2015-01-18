import flask

import techtree

app = flask.Flask(__name__, static_folder='../client/')

@app.route("/json")
@app.route("/json/<tree_name>")
def json_tree(tree_name="Unnamed Tree"):
    return flask.jsonify(techtree.TechTree().build_dictionary())


@app.route("/pretty/")
@app.route("/pretty/<tree_name>")
def pretty_view(tree_name="Unnamed Tree"):
    return flask.render_template('pretty_view.html',
                                 json_content=flask.Markup(
                                     techtree.TechTree().jsonify()),
                                 tree_name=tree_name)

@app.route("/editor")
@app.route("/editor/<tree_name>")
def editor(tree_name="Unnamed Tree"):
    return flask.render_template('editor.html',
                                 tree_name=tree_name)

@app.route("/<path:p>")
def angular(p):
    return app.send_static_file('index.html')

if __name__ == "__main__":
    app.run(debug=True)
