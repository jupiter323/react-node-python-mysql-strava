from flask import Flask,jsonify, request
from modifier import Process

app = Flask(__name__)


@app.route('/', methods=['POST', 'GET'])
def index():
    if request.method=='GET':
        try:
            result = Process(user=request.args['user'])
        except Exception as e:
            return jsonify(status='failed', message=str(e))
        if result:
            return jsonify(status='success', message='Successfully Finished!')
        else:
            return jsonify(status='failed', message='There is not files')


if __name__=='__main__':
    app.run(debug=True)