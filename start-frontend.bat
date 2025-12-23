@echo off
title ERP System - Frontend
color 0B

echo ==============================================
echo    ERP SYSTEM - FRONTEND (React + Vite)
echo ==============================================
echo.

echo [1/4] Checking Node.js installation...
node --version
npm --version
echo.

echo [2/4] Installing frontend dependencies...
cd frontend
npm install
echo.

echo [3/4] Starting Frontend Development Server...
echo Starting on port 3000...
npm run dev
pause
