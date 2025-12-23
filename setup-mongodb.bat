@echo off
echo ============================================================
echo   URL Shortener - MongoDB Setup Helper
echo ============================================================
echo.
echo This script will help you set up your MongoDB connection.
echo.
echo Choose your MongoDB option:
echo.
echo   1. Local MongoDB (Recommended for development)
echo   2. MongoDB Atlas (Cloud database)
echo.
set /p choice="Enter your choice (1 or 2): "

if "%choice%"=="1" goto local
if "%choice%"=="2" goto atlas
echo Invalid choice. Please run the script again.
goto end

:local
echo.
echo ============================================================
echo   Setting up LOCAL MongoDB
echo ============================================================
echo.
echo Creating .env file with local MongoDB connection...
(
echo # Server Configuration
echo PORT=3000
echo NODE_ENV=development
echo.
echo # MongoDB Local Configuration
echo MONGODB_URI=mongodb://127.0.0.1:27017/urlshortener
echo.
echo # JWT Configuration
echo JWT_SECRET=beshu-url-shortener-secret-key-2025
echo JWT_EXPIRE=7d
echo.
echo # Application Configuration
echo BASE_URL=http://localhost:3000
echo DEFAULT_EXPIRY_DAYS=30
) > .env

echo.
echo ✅ .env file created with local MongoDB settings!
echo.
echo 📋 Next steps:
echo    1. Make sure MongoDB is installed and running
echo    2. Run: npm run test-db (to test connection)
echo    3. Run: npm run dev (to start the server)
echo.
echo 💡 If MongoDB is not installed:
echo    Download from: https://www.mongodb.com/try/download/community
echo.
goto end

:atlas
echo.
echo ============================================================
echo   Setting up MongoDB Atlas (Cloud)
echo ============================================================
echo.
echo Please enter your MongoDB Atlas connection string.
echo.
echo Example:
echo mongodb+srv://beshu:beshu@cluster0.xxxxx.mongodb.net/urlshortener?retryWrites=true^&w=majority
echo.
set /p atlas_uri="Enter your MongoDB Atlas URI: "

if "%atlas_uri%"=="" (
    echo.
    echo ❌ Error: No URI provided
    echo.
    goto end
)

echo.
echo Creating .env file with MongoDB Atlas connection...
(
echo # Server Configuration
echo PORT=3000
echo NODE_ENV=development
echo.
echo # MongoDB Atlas Configuration
echo MONGODB_URI=%atlas_uri%
echo.
echo # JWT Configuration
echo JWT_SECRET=beshu-url-shortener-secret-key-2025
echo JWT_EXPIRE=7d
echo.
echo # Application Configuration
echo BASE_URL=http://localhost:3000
echo DEFAULT_EXPIRY_DAYS=30
) > .env

echo.
echo ✅ .env file created with MongoDB Atlas settings!
echo.
echo 📋 Next steps:
echo    1. Run: npm run test-db (to test connection)
echo    2. Run: npm run dev (to start the server)
echo.
goto end

:end
echo.
echo ============================================================
echo   Setup Complete!
echo ============================================================
echo.
echo For more help, see:
echo    - QUICK_SETUP.md (detailed setup guide)
echo    - MONGODB_SETUP.md (MongoDB Atlas guide)
echo.
pause
