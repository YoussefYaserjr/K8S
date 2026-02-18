from flask import Flask, request, jsonify
import redis, json, os

app = Flask(__name__)
r = redis.Redis(host=os.getenv("REDIS_HOST", "localhost"), port=6379, db=0)

@app.route('/vote', methods=['POST'])
def vote():
    data = request.json
    option = data.get('option')
    if option not in ['Java', 'C++']:
        return jsonify({"error": "Option must be Java or C++"}), 400
    r.lpush('votes_queue', json.dumps({"option": option}))
    return jsonify({"status": f"Vote for {option} submitted!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
