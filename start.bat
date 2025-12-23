@echo off
echo ========================================
echo   URL Shortener - Quick Start
echo ========================================
echo.
echo Checking MongoDB Atlas connection...
echo.
echo IMPORTANT: Make sure you have updated the .env file
echo with your MongoDB Atlas connection string!
echo.
echo See MONGODB_SETUP.md for instructions.
echo.
pause
echo.
echo Starting server...
echo.
npm run dev
