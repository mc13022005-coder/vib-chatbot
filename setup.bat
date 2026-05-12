@echo off
echo === VIB Chatbot Setup ===
echo.

echo [1/2] Installing missing dependencies...
npm install @base-ui/react class-variance-authority
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo [2/2] Dependencies installed successfully!
echo.
echo ================================
echo NEXT STEPS:
echo ================================
echo 1. Edit file .env.local and add your Gemini API key:
echo    GOOGLE_GENERATIVE_AI_API_KEY=your_real_api_key_here
echo.
echo 2. Run the dev server:
echo    npm run dev
echo.
echo 3. Open browser at http://localhost:3000
echo ================================
pause
