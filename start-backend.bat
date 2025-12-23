@echo off
title ERP System
color 0A

echo ==============================================
echo    ERP SYSTEM - BACKEND & FRONTEND
echo ==============================================
echo.

echo [1/4] Checking Node.js installation...
node --version
npm --version
echo.

echo [2/4] Starting Backend Server...
cd be
echo Starting on port 4000...
npm run dev
pause
