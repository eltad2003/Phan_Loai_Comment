from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import re

app = Flask(__name__)
CORS(app)  # Bật CORS cho toàn bộ app

# Load model và vectorizer đã train
model = joblib.load("logistic_model.pkl")
# Đảm bảo đã lưu vectorizer khi train
vectorizer = joblib.load("tfidf_vectorizer.pkl")

# Hàm tiền xử lý giống lúc train


def preprocess_text(text):
    text = re.sub(r'<.*?>', ' ', str(text))
    text = re.sub(r'[^a-zA-ZÀ-ỹ0-9\s]', ' ', text)
    text = text.lower()
    text = re.sub(r'\s+', ' ', text).strip()
    return text


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    comment = data.get('comment', '')
    cleaned = preprocess_text(comment)
    X_new = vectorizer.transform([cleaned])
    prediction = model.predict(X_new)
    return jsonify({'prediction': int(prediction[0])})


if __name__ == '__main__':
    app.run(debug=True)
