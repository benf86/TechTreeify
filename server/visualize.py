import flask

import techtree

app = flask.Flask(__name__, static_folder='../client/')

@app.route("/gettechtree/<tree_name>", methods=['GET'])
def get_tree(tree_name="Unnamed Tree"):
    return flask.jsonify(techtree.TechTree(tree_name).build_dictionary())

@app.route("/posttechtree/", methods=['POST'])
def post_tree():
    print flask.request.data
    return flask.jsonify({'message': 'success'})

if __name__ == "__main__":
    app.run(debug=True)
