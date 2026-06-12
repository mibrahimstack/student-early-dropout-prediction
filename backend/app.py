from flask import Flask, request, jsonify
from flask_cors import CORS 
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "*"}}) 

# Load the NEW lean model
model = joblib.load('lean_dropout_model.pkl')

@app.route('/predict', methods=['POST'])
def predict_dropout():
    try:
        student_data = request.json
        
        ui_columns = [
            'Curricular units 1st sem (approved)',
            'Curricular units 1st sem (grade)',
            'Curricular units 2nd sem (approved)',
            'Curricular units 2nd sem (grade)',
            'Tuition fees up to date',
            'Debtor'
        ]
        
        filtered_data = {key: student_data[key] for key in ui_columns}
        df = pd.DataFrame([filtered_data])
        
        prediction = model.predict(df)
        result = "High Risk: Dropout" if prediction[0] == 0 else "Low Risk: Graduate"
        
        # ---------------------------------------------------------
        # THE CALIBRATED XAI MATH (This is the section that was updated)
        # ---------------------------------------------------------
       # ---------------------------------------------------------
        # THE FINAL BULLETPROOF XAI MATH
        # ---------------------------------------------------------
        weights = model.coef_[0]
        inputs = df.iloc[0].values
        
        baselines = [6.0, 13.0, 6.0, 13.0, 1.0, 0.0]
        
        clean_names = [
            "Sem 1 Passed", "Sem 1 GPA", 
            "Sem 2 Passed", "Sem 2 GPA", 
            "Fees Paid", "Defaulter"
        ]
        
        # We explicitly define the logical direction for the UI
        # 1 means "Higher is Good" (GPA, Passed Subjects)
        # -1 means "Higher is Bad" (Defaulter status)
        directions = [1, 1, 1, 1, 1, -1]
        
        contributions = []
        for i in range(len(ui_columns)):
            # Difference from the average student
            diff = inputs[i] - baselines[i]
            
            # THE FIX: Absolute Weight × Logical Direction × Difference
            impact = float(abs(weights[i]) * directions[i] * diff)
            
            contributions.append({
                "factor": clean_names[i],
                "impact": round(impact, 3)
            })
        # ---------------------------------------------------------
        # ---------------------------------------------------------

        return jsonify({
            "status": "success",
            "prediction": result,
            "explanation": contributions 
        })

    except Exception as e:
        print("MODEL ERROR:", str(e)) 
        return jsonify({"status": "error", "message": str(e)})

if __name__ == '__main__':
    # The cloud platform will inject its own PORT, so we must catch it
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)