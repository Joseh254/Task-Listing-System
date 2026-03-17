@echo off

echo ===============================
echo Resetting local changes...
echo ===============================

git fetch origin
git reset --hard origin/main
git clean -fd

echo ===============================
echo Pulling latest code...
echo ===============================

git pull origin main

echo ===============================
echo Starting SERVER...
echo ===============================

start cmd /k "cd server && npm run dev"

timeout /t 3 > nul

echo ===============================
echo Starting CLIENT...
echo ===============================

start cmd /k "cd client && npm run dev"

timeout /t 5 > nul

echo ===============================
echo Opening browser...
echo ===============================

start http://localhost:5173

echo Done.
pause