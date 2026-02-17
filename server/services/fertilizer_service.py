import models

class FertilizerService:
    def predict_fertilizer(self, data: dict):
        """
        Simple rule-based fertilizer recommendation.
        Data expected: N, P, K, crop, soil_type (optional)
        """
        n = data.get('nitrogen', 0)
        p = data.get('phosphorus', 0)
        k = data.get('potassium', 0)
        crop = data.get('crop', '').lower()

        # Simplified Logic (Can be expanded or replaced with ML)
        recommendation = "General Purpose NPK 19-19-19"
        
        if n < 50:
            recommendation = "Urea (46% N) - Needs high Nitrogen"
        elif p < 20:
             recommendation = "DAP (Di-ammonium Phosphate) - Needs Phosphorus"
        elif k < 20:
            recommendation = "MOP (Muriate of Potash) - Needs Potash"
        
        # Crop specific adjustments (heuristic)
        if 'rice' in crop or 'paddy' in crop:
            if n < 80: recommendation = "Urea + Zinc Sulfate"
        elif 'potato' in crop:
             recommendation = "NPK 12-32-16"
        elif 'sugarcane' in crop:
             recommendation = "Urea + DAP"
        
        return {
            "fertilizer": recommendation,
            "description": f"Based on N: {n}, P: {p}, K: {k} for {crop}.",
            "usage": "Apply during early growth stage.",
            "disclaimer": "IMPORTANT: This is an AI-generated recommendation based on current sensor data. Always cross-verify with a certified soil laboratory or local agricultural expert before bulk application.",
            "next_steps": [
                "Verify dosage with a professional",
                "Check weather forecast before application",
                "Ensure proper soil moisture before fertilizing"
            ]
        }

fertilizer_service = FertilizerService()
