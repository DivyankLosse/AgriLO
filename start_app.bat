@echo off
setlocal
cd /d "%~dp0"
echo ==================================================
echo           Starting Agri-Lo Application
echo           (Press Ctrl+C to Stop)
echo ==================================================

:: Environment variables
set TF_ENABLE_ONEDNN_OPTS=0
set PYTHONPATH=%PYTHONPATH%;%CD%\server

echo [1/3] Cleaning up existing processes...
:: Kill node and python processes to ensure ports are free
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM python.exe /T 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul

echo [2/3] Checking Environment...
if not exist .venv (
    echo [INFO] Creating virtual environment...
    python -m venv .venv
)

echo [3/3] Launching App...

:: Start Backend
echo Starting Backend Server...
start "Agri-Lo Backend" cmd /k "call .venv\Scripts\activate && cd server && uvicorn main:app --reload --port 8000"

:: Start Frontend
echo Starting Frontend Dev Server...
if not exist client\node_modules (
    echo [INFO] Installing frontend dependencies...
    cd client && call npm install && cd ..
)
:: Start in client directory
start "Agri-Lo Frontend" /d client cmd /k "npm run dev"

echo ==================================================
echo           Application Is Running!
echo           Backend:  http://localhost:8000
echo           Frontend: http://localhost:5173
echo ==================================================
echo You can close this window.
pause
