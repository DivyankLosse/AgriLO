class TreatmentService:
    def get_treatment(self, disease_name: str):
        # Dictionary of treatments
        # This can be moved to a JSON file or DB later
        treatments = {
            "Apple___Apple_scab": {
                "severity": "Medium",
                "immediate": ["Remove infected leaves", "Apply Fungicide"],
                "preventive": ["Clean fall leaves", "Prune for airflow"],
                "pesticides": ["Captan", "Sulfur"]
            },
            "Apple___Black_rot": {
                "severity": "High",
                "immediate": ["Prune infected parts", "Remove mummified fruit"],
                "preventive": ["Sanitize tools", "Remove dead wood"],
                "pesticides": ["Thiophanate-methyl"]
            },
            "Apple___Cedar_apple_rust": {
                "severity": "Medium",
                "immediate": ["Prune galls from cedar"],
                "preventive": ["Plant resistant varieties"],
                "pesticides": ["Myclobutanil"]
            },
            "Apple___healthy": {
                "severity": "None",
                "immediate": ["Monitor regularly"],
                "preventive": ["Maintain good irrigation"],
                "pesticides": []
            },
            "Blueberry___healthy": {
                "severity": "None",
                "immediate": ["Monitor regularly"],
                "preventive": ["Maintain good irrigation"],
                "pesticides": []
            },
            "Cherry_(including_sour)___Powdery_mildew": {
                "severity": "Medium",
                "immediate": ["Prune infected branches", "Apply fungicide"],
                "preventive": ["Improve air circulation"],
                "pesticides": ["Myclobutanil", "Sulfur"]
            },
            "Cherry_(including_sour)___healthy": {
                "severity": "None",
                "immediate": ["Monitor regularly"],
                "preventive": ["Maintain good irrigation"],
                "pesticides": []
            },
            "Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot": {
                "severity": "High",
                "immediate": ["Rotate crops", "Use resistant hybrids"],
                "preventive": ["Plow under crop debris"],
                "pesticides": ["Azoxystrobin"]
            },
            "Corn_(maize)___Common_rust_": {
                "severity": "Medium",
                "immediate": ["Apply fungicide early"],
                "preventive": ["Plant resistant varieties"],
                "pesticides": ["Mancozeb"]
            },
            "Corn_(maize)___Northern_Leaf_Blight": {
                "severity": "High",
                "immediate": ["Use resistant hybrids"],
                "preventive": ["Crop rotation"],
                "pesticides": ["Propiconazole"]
            },
            "Corn_(maize)___healthy": {
                "severity": "None",
                "immediate": ["Monitor regularly"],
                "preventive": ["Maintain good irrigation"],
                "pesticides": []
            },
            "Grape___Black_rot": {
                "severity": "High",
                "immediate": ["Remove infected berries"],
                "preventive": ["Proper pruning", "Sun exposure"],
                "pesticides": ["Mancozeb"]
            },
            "Grape___Esca_(Black_Measles)": {
                "severity": "High",
                "immediate": ["Remove infected vines"],
                "preventive": ["Avoid large pruning wounds"],
                "pesticides": []
            },
            "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
                "severity": "Medium",
                "immediate": ["Fungicide spray"],
                "preventive": ["Manage canopy"],
                "pesticides": ["Copper-based"]
            },
            "Grape___healthy": {
                "severity": "None",
                "immediate": ["Monitor regularly"],
                "preventive": ["Maintain good irrigation"],
                "pesticides": []
            },
            "Orange___Haunglongbing_(Citrus_greening)": {
                "severity": "Critical",
                "immediate": ["Remove infected tree", "Control psyllids"],
                "preventive": ["Use disease-free nursery trees"],
                "pesticides": ["Imidacloprid (for vectors)"]
            },
            "Peach___Bacterial_spot": {
                "severity": "High",
                "immediate": ["Copper spray", "Avoid overhead watering"],
                "preventive": ["Plant resistant varieties"],
                "pesticides": ["Copper fungicide", "Oxytetracycline"]
            },
            "Peach___healthy": {
                "severity": "None",
                "immediate": ["Monitor regularly"],
                "preventive": ["Maintain good irrigation"],
                "pesticides": []
            },
            "Pepper,_bell___Bacterial_spot": {
                "severity": "High",
                "immediate": ["Remove infected plants", "Copper spray"],
                "preventive": ["Use disease-free seeds", "Crop rotation"],
                "pesticides": ["Copper hydroxide"]
            },
            "Pepper,_bell___healthy": {
                "severity": "None",
                "immediate": ["Monitor regularly"],
                "preventive": ["Maintain good irrigation"],
                "pesticides": []
            },
            "Potato___Early_blight": {
                "severity": "Medium",
                "immediate": ["Remove infected leaves", "Fungicide application"],
                "preventive": ["Crop rotation", "Drip irrigation"],
                "pesticides": ["Chlorothalonil", "Mancozeb"]
            },
            "Potato___Late_blight": {
                "severity": "Critical",
                "immediate": ["Destroy infected plants", "Fungicide application"],
                "preventive": ["Use certified seed potatoes"],
                "pesticides": ["Mancozeb", "Chlorothalonil"]
            },
            "Potato___healthy": {
                "severity": "None",
                "immediate": ["Monitor regularly"],
                "preventive": ["Maintain good irrigation"],
                "pesticides": []
            },
            "Raspberry___healthy": {
                "severity": "None",
                "immediate": ["Monitor regularly"],
                "preventive": ["Maintain good irrigation"],
                "pesticides": []
            },
            "Soybean___healthy": {
                "severity": "None",
                "immediate": ["Monitor regularly"],
                "preventive": ["Maintain good irrigation"],
                "pesticides": []
            },
            "Squash___Powdery_mildew": {
                "severity": "Medium",
                "immediate": ["Remove infected leaves", "Apply sulfur"],
                "preventive": ["Plant resistant varieties"],
                "pesticides": ["Sulfur", "Potassium bicarbonate"]
            },
            "Strawberry___Leaf_scorch": {
                "severity": "Medium",
                "immediate": ["Remove infected leaves"],
                "preventive": ["Plant resistant varieties"],
                "pesticides": ["Captan", "Thiram"]
            },
            "Strawberry___healthy": {
                "severity": "None",
                "immediate": ["Monitor regularly"],
                "preventive": ["Maintain good irrigation"],
                "pesticides": []
            },
            "Tomato___Bacterial_spot": {
                "severity": "High",
                "immediate": ["Copper spray", "Remove infected plants"],
                "preventive": ["Use disease-free seeds"],
                "pesticides": ["Copper hydroxide"]
            },
            "Tomato___Early_blight": {
                "severity": "Medium",
                "immediate": ["Trim lower leaves", "Mulch soil"],
                "preventive": ["Crop rotation", "Stake plants"],
                "pesticides": ["Chlorothalonil"]
            },
            "Tomato___Late_blight": {
                "severity": "Critical",
                "immediate": ["Destroy infected plants immediately"],
                "preventive": ["Avoid overhead watering"],
                "pesticides": ["Mancozeb", "Chlorothalonil"]
            },
            "Tomato___Leaf_Mold": {
                "severity": "Medium",
                "immediate": ["Improve ventilation"],
                "preventive": ["Reduce humidity"],
                "pesticides": ["Copper fungicide"]
            },
            "Tomato___Septoria_leaf_spot": {
                "severity": "Medium",
                "immediate": ["Remove infected leaves"],
                "preventive": ["Mulch base of plant"],
                "pesticides": ["Chlorothalonil"]
            },
            "Tomato___Spider_mites Two-spotted_spider_mite": {
                "severity": "Medium",
                "immediate": ["Spray water", "Use miticide"],
                "preventive": ["Avoid dusty conditions"],
                "pesticides": ["Neem oil"]
            },
            "Tomato___Target_Spot": {
                "severity": "Medium",
                "immediate": ["Improve airflow"],
                "preventive": ["Remove crop debris"],
                "pesticides": ["Chlorothalonil"]
            },
            "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
                "severity": "High",
                "immediate": ["Control whiteflies", "Use reflective mulch"],
                "preventive": ["Weed control"],
                "pesticides": ["Imidacloprid (for vectors)"]
            },
            "Tomato___Tomato_mosaic_virus": {
                "severity": "High",
                "immediate": ["Remove infected plants", "Wash hands"],
                "preventive": ["Sanitize tools"],
                "pesticides": []
            },
            "Tomato___healthy": {
                "severity": "None",
                "immediate": ["Monitor regularly"],
                "preventive": ["Maintain good irrigation"],
                "pesticides": []
            }
        }
        
        # Default fallback
        return treatments.get(disease_name, {
            "severity": "Unknown",
            "immediate": ["Consult local agricultural expert"],
            "preventive": ["Isolate plant"],
            "pesticides": []
        })

treatment_service = TreatmentService()
