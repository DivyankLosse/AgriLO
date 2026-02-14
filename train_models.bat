@echo off
echo Starting Agri-Lo Model Training...
echo ===================================

echo.
echo [1/2] Training Soil Model...
python server/training/train_soil.py
if %errorlevel% neq 0 (
    echo Error training soil model!
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] Training Leaf Model (This may take 10-15 minutes)...
echo WARNING: The application is currently configured to use 'model.pkl' (FastAI).
echo This script trains 'leaf_model.h5' (TensorFlow) which is NOT currently used by the app.
echo To use this trained model, update 'config.py' to point to 'leaf_model.h5' and revert 'disease_service.py'.
python server/training/train_leaf.py
if %errorlevel% neq 0 (
    echo Error training leaf model!
    pause
    exit /b %errorlevel%
)

echo.
echo ===================================
echo All models trained successfully!
echo You can now run the application using run_app.bat
echo ===================================
pause
