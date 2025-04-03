from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib  # Load ML model

app = Flask(__name__)
CORS(app)  # Allow requests from React

# Load trained ML model
model = joblib.load("milk_quality_model.pkl")  # Ensure the model file exists

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        print("📥 Received Data:", data)

        # Extract values
        pH = float(data['pH'])
        temperature = int(data['temperature'])
        turbidity = int(data['turbidity'])
        color = int(data['color'])
        fat = int(data['fat'])
        taste = int(data['taste'])
        odor = int(data['odor'])

        # Convert to numpy array
        features = np.array([[pH, temperature, turbidity, color, fat, taste, odor]])
        print("🔍 Model Input Features:", features)

        # Make prediction
        prediction = model.predict(features)
        print("✅ Prediction:", prediction[0])

        return jsonify({"quality": str(prediction[0])})


    except Exception as e:
        print("❌ Error:", str(e))
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True, port=8000)
