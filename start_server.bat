@echo off
title Backend Server (Port 8080)
echo Starting Backend Server...
cd /d "%~dp0code\server"
npm start
pause

