@echo off
echo ==================================================
echo           Starting Agri-Lo Application
echo           (Press Ctrl+C to Stop)
echo ==================================================

echo Checking Backend Environment...
cd server
if not exist .venv (
    echo Creating virtual environment...
    python -m venv .venv
)
call .venv\Scripts\activate

echo Installing Python Dependencies...
pip install -r requirements.txt

echo Starting Backend Server...
start "Agri-Lo Backend" /min uvicorn main:app --reload --port 5000
cd ..

echo Checking Frontend Environment...
cd client
if not exist node_modules (
    echo Installing Node Modules...
    call npm install
)

echo Starting Frontend Dev Server...
start "Agri-Lo Frontend" npm run dev

echo ==================================================
echo           Application is Running!
echo           Backend: http://localhost:5000
echo           Frontend: http://localhost:5173
echo ==================================================
pause
