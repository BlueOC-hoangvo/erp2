@echo off
title ERP Backend Server
color 0A

echo ==============================================
echo    ERP SYSTEM - BACKEND SERVER
echo ==============================================
echo.

echo [1/2] Starting Backend Server...
cd be
echo Current directory: %CD%
echo Starting on port 4000...
npm run dev

pause
