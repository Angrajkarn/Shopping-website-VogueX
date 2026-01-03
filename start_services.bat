@echo off
title Fashion Advance Launcher
echo ==========================================
echo   Starting Fashion Advance Services
echo ==========================================
echo.
echo [INFO] Please ensure MongoDB is running on 127.0.0.1:27017
echo [INFO] You can read MONGODB_GUIDE.md for help.
echo.
echo Starting Backend (Django)...
start "Backend Server" cmd /k "cd backend && echo Applying Migrations... && python manage.py migrate && echo Starting Server... && python manage.py runserver 8080"

echo Starting Frontend (Next.js)...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Services launched in separate windows.
echo Check the "Backend Server" window for database connection errors.
pause
