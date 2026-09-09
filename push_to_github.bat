@echo off
echo ===================================================
echo Pushing METROCHECK to github.com/prateekgupta88821-create/sihs
echo ===================================================
git add .
git commit -m "Update vercel deployment config and all components"
git branch -M main
git push -u origin main
echo ===================================================
echo Push complete! Press any key to exit.
echo ===================================================
pause
