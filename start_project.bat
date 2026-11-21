@echo off
cd /d "%~dp0"
title Ticket Booking System - Launcher
echo ========================================================
echo        Starting Ticket Booking System
echo ========================================================
echo.

REM 1. Ensure MongoDB service is running
echo [1/3] Checking MongoDB...
net start MongoDB >nul 2>&1

REM 2. Launch Backend in separate window
echo [2/3] Starting Backend Server (Port 8080)...
start "Backend Server (8080)" powershell -NoExit -Command "cd 'code\server'; Write-Host '--- BACKEND SERVER (Port 8080) ---' -ForegroundColor Cyan; npm start"

REM 3. Launch Frontend in separate window
echo [3/3] Starting Frontend Client (Port 3000)...
start "Frontend Client (3000)" powershell -NoExit -Command "cd 'code\client'; Write-Host '--- FRONTEND REACT CLIENT (Port 3000) ---' -ForegroundColor Green; npm start"

echo.
echo ========================================================
echo Both Backend and Frontend are launching!
echo App will open at: http://localhost:3000
echo ========================================================
timeout /t 6 >nul
start http://localhost:3000
exit

