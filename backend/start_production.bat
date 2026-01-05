@echo off
setlocal

echo ========================================================
echo   VOGUEX - STARTING IN PRODUCTION MODE (MANUAL WINDOWS)
echo ========================================================
echo.

:: 1. Set Critical Production Variables
set DEBUG=False
set SECRET_KEY=voguex-production-secret-key-change-this-remote-deploy
set ALLOWED_HOSTS=*
set DJANGO_SETTINGS_MODULE=config.settings

:: Use SQLite for now since Docker/Postgres is not available
:: In real production, this would be a Postgres URL
echo [INFO] Using Local SQLite Database for simulation...
set DATABASE_URL=sqlite:///db_new.sqlite3
set SECURE_SSL_REDIRECT=False

echo.
echo [STEP 1] Collecting Static Files (WhiteNoise)...
python manage.py collectstatic --noinput
if %errorlevel% neq 0 (
    echo [ERROR] Failed to collect static files.
    pause
    exit /b %errorlevel%
)

echo.
echo [STEP 2] Applying Migrations...
python manage.py migrate
if %errorlevel% neq 0 (
    echo [ERROR] Migration failed.
    pause
    exit /b %errorlevel%
)

echo.
echo [STEP 3] Starting Uvicorn ASGI Server (Production-Grade)...
echo        Serving on http://127.0.0.1:8080
echo.

:: Run Uvicorn without hot-reload (True Production Mode)
:: Note: Multi-workers (-w 4) might be limited on Windows, using default worker configuration
uvicorn config.asgi:application --host 0.0.0.0 --port 8080 --log-level info

endlocal
