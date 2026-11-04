@echo off
setlocal

for %%I in ("%~dp0..\..") do set "PROJECT_ROOT=%%~fI"
pushd "%PROJECT_ROOT%" || exit /b 1

set "SELECTED_VENV="
if exist ".venv\Scripts\activate.bat" (
  call ".venv\Scripts\activate.bat"
  set "SELECTED_VENV=%PROJECT_ROOT%\.venv"
) else if exist "venv\Scripts\activate.bat" (
  call "venv\Scripts\activate.bat"
  set "SELECTED_VENV=%PROJECT_ROOT%\venv"
) else if defined VIRTUAL_ENV (
  set "SELECTED_VENV=%VIRTUAL_ENV%"
)

if defined SELECTED_VENV (
  if not exist "%SELECTED_VENV%\Scripts\zensical.exe" (
    echo Zensical is not installed in the selected environment. 1>&2
    echo Install this project's documentation dependencies, then run this script again. 1>&2
    set "RESULT=127"
    goto finish
  )
  set "ZENSICAL=%SELECTED_VENV%\Scripts\zensical.exe"
) else (
  where zensical >nul 2>nul
  if errorlevel 1 (
    echo Zensical was not found in a project virtual environment or on PATH. 1>&2
    echo Follow this project's documentation setup instructions, then run this script again. 1>&2
    set "RESULT=127"
    goto finish
  )
  set "ZENSICAL=zensical"
)

if /I "%~1"=="clean-serve" goto clean_serve
if "%~1"=="" (
  call "%ZENSICAL%" serve
) else (
  call "%ZENSICAL%" %*
)
set "RESULT=%ERRORLEVEL%"
goto finish

:clean_serve
shift
call "%ZENSICAL%" build --help | findstr /l /c:"--clean" >nul
if errorlevel 1 (
  echo This Zensical version does not advertise build --clean; clean preview was not started. 1>&2
  set "RESULT=2"
  goto finish
)
call "%ZENSICAL%" build --clean
set "RESULT=%ERRORLEVEL%"
if not "%RESULT%"=="0" goto finish
if "%~1"=="" (
  call "%ZENSICAL%" serve
) else (
  call "%ZENSICAL%" serve %*
)
set "RESULT=%ERRORLEVEL%"

:finish
popd
exit /b %RESULT%
