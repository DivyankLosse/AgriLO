@echo off
echo ===================================================
echo Agri-Lo Setup Script
echo ===================================================
echo.



echo 2. Setting up Server Environment...
cd server
if not exist .venv (
    echo Creating virtual environment...
    python -m venv .venv
)
call .venv\Scripts\activate
echo Upgrading pip...
python -m pip install --upgrade pip
echo Installing Python dependencies...
pip install -r requirements.txt
cd ..
echo.

echo 3. Setting up Client Environment...
cd client
if exist node_modules (
    echo Node modules found, skipping install.
) else (
    echo Installing Node dependencies...
    npm install
)
cd ..
echo.



echo ===================================================
echo Setup Complete!
echo You can now run 'start_app.bat' to launch the application.
echo ===================================================
pause
