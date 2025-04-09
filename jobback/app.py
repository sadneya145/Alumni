from flask import Flask, request, jsonify
import joblib
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# Load model and vectorizer
model = joblib.load('model.pkl')
vectorizer = joblib.load('vectorizer.pkl')

# Connect to MongoDB
client = MongoClient('mongodb+srv://sadneyasam05:root@cluster0.7gxwyxh.mongodb.net/?retryWrites=true&w=majority')
db = client['test']
users_collection = db['profiles']

# Convert profile to text string for model input
def profile_to_text(user):
    if not user:
        return ""

    parts = []
    parts.append(user.get("department", ""))
    parts.append(user.get("batch", ""))
    
    achievements = [a['title'] + ' ' + a['description'] for a in user.get("achievements", [])]
    activities = [f"{a['type']} {a['title']}" for a in user.get("activities", [])]

    parts += achievements
    parts += activities

    stats = user.get("stats", {})
    parts.append(f"{stats.get('internshipsCompleted', 0)} internships")
    parts.append(f"{stats.get('projectsCompleted', 0)} projects")
    parts.append(f"{stats.get('eventsAttended', 0)} events attended")

    return ' '.join(parts)

# New API to recommend based on email (or you can use ID too)
@app.route('/recommend-by-email/<email>', methods=['GET'])
def recommend_by_email(email):
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    user_text = profile_to_text(user)
    vectorized = vectorizer.transform([user_text])
    prediction = model.predict(vectorized)

    return jsonify({'recommended_job': prediction[0]})

if __name__ == '__main__':
    app.run(debug=True, port=8080)
