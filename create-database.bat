@echo off
echo ================================================
echo Creating PostgreSQL Database: rfp_management
echo ================================================
echo.
echo This will prompt you for the PostgreSQL password.
echo Password should be: saurabh9140
echo.

"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE DATABASE rfp_management;"

IF %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================
    echo SUCCESS! Database created successfully!
    echo ================================================
    echo.
    echo Now you can run: npm run seed
    echo.
) ELSE (
    echo.
    echo ================================================
    echo ERROR! Failed to create database
    echo ================================================
    echo.
    echo Troubleshooting:
    echo 1. Make sure PostgreSQL service is running
    echo 2. Check your password is correct: saurabh9140
    echo 3. Try using pgAdmin instead (GUI method)
    echo.
)

pause
