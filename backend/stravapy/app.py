from flask import Flask, jsonify
from predict import convert
app = Flask(__name__)

@app.route('/convert', methods=['POST', 'GET'])
def convert():
    data = []
    return jsonify(data=data)

if __name__ == '__main__':
    app.run(debug=True)
