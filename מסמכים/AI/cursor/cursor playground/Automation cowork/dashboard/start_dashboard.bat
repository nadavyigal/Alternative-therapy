@echo off
echo ================================================
echo   Automation Cowork Dashboard Launcher
echo ================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.12 or higher
    pause
    exit /b 1
)

echo [OK] Python is installed
echo.

REM Check if database is running
echo Checking if database is running...
docker ps | findstr automation-db >nul
if errorlevel 1 (
    echo [WARNING] Database is not running
    echo Starting database...
    docker-compose up -d
    timeout /t 5 >nul
) else (
    echo [OK] Database is running
)
echo.

REM Check if FastAPI is installed
python -c "import fastapi" >nul 2>&1
if errorlevel 1 (
    echo [INFO] Installing required packages...
    pip install fastapi uvicorn
)

echo ================================================
echo   Starting Dashboard Server...
echo ================================================
echo.
echo Dashboard will be available at:
echo   http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo ================================================
echo.

REM Start the dashboard
python dashboard_api.py

pause
