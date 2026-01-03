@echo off
echo ========================================================
echo   VOGUEX FRONTEND - PRODUCTION BUILD & START
echo ========================================================
echo.

echo [STEP 1] Building Next.js Project (Optimized)...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed.
    pause
    exit /b %errorlevel%
)

echo.
echo [STEP 2] Starting Production Server...
echo        Serving on http://localhost:3000
echo.
call npm start
