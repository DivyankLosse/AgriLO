@echo off
echo ===================================================
echo Stopping Agri-Lo Application
echo ===================================================

echo 1. Stopping Backend and Frontend processes...
taskkill /FI "WINDOWTITLE eq Agri-Lo Backend*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Agri-Lo Frontend*" /T /F >nul 2>&1
echo Closed application windows.
echo.



echo ===================================================
echo Application Stopped Successfully.
echo ===================================================
pause
