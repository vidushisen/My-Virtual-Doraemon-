@echo off
title Doraemon Language Academy Launcher
color 0b
echo ========================================================
echo   DORAEMON'S LANGUAGE ADVENTURE (ドラえもん 言語アドベンチャー)
echo ========================================================
echo.
echo Launching your 22nd-Century Language Learning App...
echo.
start "" "%~dp0index.html"
echo App opened in your default web browser!
timeout /t 3 >nul
exit
