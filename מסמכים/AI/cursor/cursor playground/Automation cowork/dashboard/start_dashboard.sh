#!/bin/bash

echo "================================================"
echo "  Automation Cowork Dashboard Launcher"
echo "================================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python is not installed"
    echo "Please install Python 3.12 or higher"
    exit 1
fi

echo "[OK] Python is installed"
echo ""

# Check if database is running
echo "Checking if database is running..."
if docker ps | grep -q automation-db; then
    echo "[OK] Database is running"
else
    echo "[WARNING] Database is not running"
    echo "Starting database..."
    docker-compose up -d
    sleep 5
fi
echo ""

# Check if FastAPI is installed
if ! python3 -c "import fastapi" &> /dev/null; then
    echo "[INFO] Installing required packages..."
    pip3 install fastapi uvicorn
fi

echo "================================================"
echo "  Starting Dashboard Server..."
echo "================================================"
echo ""
echo "Dashboard will be available at:"
echo "  http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo "================================================"
echo ""

# Start the dashboard
python3 dashboard_api.py
