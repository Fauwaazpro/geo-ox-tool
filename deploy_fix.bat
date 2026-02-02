@echo off
echo ===========================================
echo      GEO OX Deployment Helper
echo ===========================================
echo.
echo Adding all changed files...
git add .

echo.
echo Committing changes...
git commit -m "Fix auth callback logic and survey page syntax"

echo.
echo Pushing to GitHub (this triggers Vercel)...
git push origin main

echo.
echo ===========================================
echo DONE! Vercel should be redeploying now.
echo You can close this window.
echo ===========================================
pause
