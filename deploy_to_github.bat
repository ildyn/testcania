@echo off
echo ===========================
echo 🚀 Railway GitHub Deployer
echo ===========================

REM Step 1: Init repo
git init

REM Step 2: Remove old remote if it exists
git remote remove origin 2>NUL

REM Step 3: Add your GitHub remote
git remote add origin https://github.com/ildyn/testcania.git

REM Step 4: Add all files
git add .

REM Step 5: Commit changes
git commit -m "Initial Railway deploy"

REM Step 6: Force push to master
git push -u origin master --force

echo ===========================
echo ✅ Готово! Проверь в Railway
echo ===========================
pause
