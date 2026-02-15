@echo off
echo Starting Agri-Lo Deployment...

REM Check for Docker
docker --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Docker is not installed or not in PATH. Please install Docker Desktop.
    pause
    exit /b 1
)

REM Check for Docker Compose
docker-compose --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Docker Compose is not installed or not in PATH.
    pause
    exit /b 1
)

echo Building and starting containers...
docker-compose up -d --build

IF %ERRORLEVEL% NEQ 0 (
    echo deployment failed. Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo Deployment Successful!
echo Access the application at: http://localhost
echo.
pause
