@echo off
echo ========================================================
echo Starting TrueTransit Backend and Frontend Services
echo ========================================================
echo.
echo [1/2] Launching Backend Server on http://localhost:5000 ...
start "TrueTransit Backend (Port 5000)" cmd /k "cd backend && npm run dev"

echo [2/2] Launching Frontend Web App on http://localhost:5173 ...
start "TrueTransit Frontend (Port 5173)" cmd /k "cd frontend && npm run dev"

echo.
echo TrueTransit is running!
echo Backend:  http://localhost:5000/api/v1/health
echo Frontend: http://localhost:5173
echo ========================================================
