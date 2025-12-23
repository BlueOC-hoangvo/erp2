@echo off
echo Restarting frontend server...
cd /d "%~dp0"
cd frontend

echo Killing existing Node processes...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM npm.cmd 2>nul

echo Starting frontend server...
npm run dev

pause

