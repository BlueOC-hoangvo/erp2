@echo off
echo Starting ERP System...
echo.

echo Starting Backend Server...
cd be
start "Backend" cmd /k "npm run dev"
cd ..

echo Starting Frontend Server...
cd frontend  
start "Frontend" cmd /k "npm run dev"
cd ..

echo.
echo Both servers are starting...
echo Backend: http://localhost:4000
echo Frontend: http://localhost:3000
echo.
pause
