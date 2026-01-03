@echo off
echo Optional: initializing git if not present
git init

echo Appending Title to README
echo "# Shopping-website-VogueX" >> README.md

echo Configuring Git Identity...
git config user.email "admin@voguex.com"
git config user.name "VogueX Admin"

echo Adding all files...
git add .

echo Committing...
git commit -m "First Commit: VogueX Advanced E-Commerce Platform (Production Ready)"

echo Renaming branch to main...
git branch -M main

echo Adding Remote...
git remote remove origin 2>nul
git remote add origin https://github.com/Angrajkarn/Shopping-website-VogueX.git

echo Pushing to GitHub...
git push -u origin main
