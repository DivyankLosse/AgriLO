@echo off
setlocal enabledelayedexpansion

:: ==================================================
::           Agri-Lo One-Click Setup
:: ==================================================
echo.
echo [STEP 1/6] Checking Prerequisites...
echo.

:: Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python 3.9 or higher: https://www.python.org/
    pause
    exit /b 1
)
echo [OK] Python detected.

:: Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js detected.

:: Check npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed.
    pause
    exit /b 1
)
echo [OK] npm detected.

echo.
echo [STEP 2/6] Setting up Environment Variables...
echo.

if not exist .env (
    if exist .env.example (
        echo [INFO] Creating .env from .env.example...
        copy .env.example .env >nul
        echo [OK] .env created. Please update it with your actual keys if needed.
    ) else (
        echo [WARNING] .env.example not found. Creating a basic .env file...
        (
            echo DATABASE_URL=sqlite+aiosqlite:///./farming.db
            echo SECRET_KEY=your-secret-key-change-in-production
            echo ALGORITHM=HS256
            echo DEBUG=True
        ) > .env
        echo [OK] Basic .env created.
    )
) else (
    echo [INFO] .env already exists. Skipping.
)

echo.
echo [STEP 3/6] Setting up Backend (Python)...
echo.

if not exist .venv (
    echo [INFO] Creating virtual environment (.venv)...
    python -m venv .venv
    if !errorlevel! neq 0 (
        echo [ERROR] Failed to create virtual environment.
        pause
        exit /b 1
    )
    echo [OK] .venv created.
) else (
    echo [INFO] .venv already exists. Skipping creation.
)

echo [INFO] Installing/Updating backend dependencies...
call .venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r server/requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies.
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed.

echo.
echo [STEP 4/6] Setting up Frontend (Node.js)...
echo.

if exist client (
    echo [INFO] Entering client directory...
    cd client
    echo [INFO] Installing frontend dependencies...
    call npm install
    if !errorlevel! neq 0 (
        echo [ERROR] Failed to install frontend dependencies.
        cd ..
        pause
        exit /b 1
    )
    echo [OK] Frontend dependencies installed.
    cd ..
) else (
    echo [ERROR] 'client' directory not found.
    pause
    exit /b 1
)

echo.
echo [STEP 5/6] Finalizing Service Directories...
echo.

if not exist server\mqtt_data (
    echo [INFO] Creating server\mqtt_data for Mosquitto persistence...
    mkdir server\mqtt_data
    echo [OK] directory created.
)

echo.
echo [STEP 6/6] External Services Verification...
echo.

:: Check Mosquitto
where mosquitto >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] 'mosquitto' command not found in PATH.
    echo Please ensure Eclipse Mosquitto is installed for MQTT functionality.
) else (
    echo [OK] Mosquitto detected.
)

:: Check MongoDB
where mongod >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] 'mongod' command not found in PATH.
    echo If you plan to use MongoDB, please ensure it is installed and running.
    echo Note: Default config also supports SQLite.
) else (
    echo [OK] MongoDB detected.
)

echo.
echo ==================================================
echo           SETUP COMPLETE!
echo ==================================================
echo.
echo 1. Update the .env file with your API keys if necessary.
echo 2. Run 'start_app.bat' to launch the application.
echo.
pause
