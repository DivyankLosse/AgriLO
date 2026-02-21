# 🌱 Agri-Lo — AI-Powered Smart Farming Assistant

![Agri-Lo Banner](https://img.shields.io/badge/Agri--Lo-Smart%20Farming-forestgreen?style=for-the-badge&logo=leaf)
![License](https://img.shields.io/github/license/DivyankLosse/AgriLO?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20Python-blue?style=for-the-badge)

> **Agri-Lo** is an end-to-end **AI + IoT powered smart farming platform** that enables farmers to make **data-driven decisions** using real-time soil data, plant disease detection, and intelligent agricultural recommendations.

---

## 🌾 Why Agri-Lo?

Modern farming often depends on guesswork, delayed lab reports, and fragmented tools.  
Agri-Lo bridges this gap by combining **IoT sensors, AI models, and real-time analytics** into one unified platform for precision agriculture.

---

## 🚀 Core Features

### 🌱 Soil Health Monitoring (IoT)
- Live NPK (Nitrogen, Phosphorus, Potassium) readings  
- pH, moisture & temperature tracking  
- ESP32-based sensor integration using MQTT  

### 🧪 Expert Soil Testing
- Book professional soil testing services  
- Razorpay payment integration (₹199)  
- Digital soil health reports  

### 🍂 AI Disease Detection
- Upload leaf or root images  
- CNN-based deep learning disease classification  
- Instant results with treatment suggestions  

### 💬 Multilingual AI Agri-Chatbot
- AI-powered farming assistant  
- Supports English, Hindi & Marathi  
- Crop-specific recommendations  

### 📊 Smart Analytics Dashboard
- Interactive charts and trends  
- Historical soil & crop health data  
- Decision-support visuals  

### 🛒 Market Insights
- Real-time crop prices  
- Local mandi trends  
- Smarter selling decisions  

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Material Symbols
- Recharts

### Backend & AI
- FastAPI
- MongoDB with Beanie ODM
- TensorFlow / Keras
- Razorpay API

### IoT & Hardware
- ESP32
- MQTT Protocol

---

## 📦 Installation & Setup

### ⚡ Quick Start (Recommended)
```bash
setup.bat
````

This script verifies dependencies, sets up the backend and frontend, and prepares the environment automatically.

---

### 🔧 Manual Setup

#### Prerequisites

* Python 3.9+
* Node.js & npm
* MongoDB (optional)
* Mosquitto MQTT (optional)

#### Backend Setup

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r server/requirements.txt
```

Create a `.env` file using `.env.example`.

#### Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## ▶️ Running the Application

```bash
start_app.bat
```

Starts both FastAPI backend and React frontend.

---

## 📸 Screenshots

### Landing Page

<img src="https://github.com/user-attachments/assets/9c77d066-2544-4f88-9510-1ffd8fdc39e5" width="100%" />

### Dashboard

<img src="https://github.com/user-attachments/assets/a78055a5-2966-4575-861a-0ed1f90825ae" width="100%" />

### Leaf Disease Detection

<img src="https://github.com/user-attachments/assets/056c12a7-6ab9-45d9-9e31-7730879a6540" width="100%" />

### Root Disease Detection

<img src="https://github.com/user-attachments/assets/1f229fa0-1ad5-456e-af1a-d4376a639a38" width="100%" />

### Soil Analysis (NPK Sensor)

<img src="https://github.com/user-attachments/assets/db384e1e-af91-449f-9d16-14f09b08a530" width="100%" />

### AI Chatbot

<img src="https://github.com/user-attachments/assets/c1b13b83-67b5-4e8c-9487-63ddfe2d4726" width="100%" />

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch

   ```bash
   git checkout -b feature/YourFeature
   ```
3. Commit your changes

   ```bash
   git commit -m "Add YourFeature"
   ```
4. Push to the branch and open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.
See the `LICENSE` file for more information.

---

<p align="center">
  🌾 Built for farmers, powered by AI  
  <br/>
  <strong>Made with ❤️ by Divyank Losse</strong>
</p>
```
