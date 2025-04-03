from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load the trained model
model = joblib.load("milk_quality_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        
        # Extract features from request data
        features = [
            float(data["pH"]),
            float(data["temperature"]),
            float(data["turbidity"]),
            float(data["color"]),
            float(data["fat"]),
            float(data["taste"]),
            float(data["odor"])
        ]
        
        # Convert to numpy array and reshape for model input
        features = np.array(features).reshape(1, -1)
        
        # Make prediction
        prediction = model.predict(features)
        
        # Return response
        return jsonify({"quality": int(prediction[0])})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True, port=8000)
