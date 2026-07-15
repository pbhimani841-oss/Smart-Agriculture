@echo off
echo Pushing latest code to GitHub...
git add .
git commit -m "Update database configuration and fix lint errors for deployment"
git push
echo.
echo Done! Railway will now deploy your changes.
pause
