# JDK 17 환경변수 설정 스크립트

Write-Host "JDK 17 환경변수 설정 중..." -ForegroundColor Green

# JDK 17 경로 찾기
$javaPath = (Get-Command java).Source
$javaHome = Split-Path (Split-Path $javaPath -Parent) -Parent

Write-Host "Java 경로: $javaPath" -ForegroundColor Yellow
Write-Host "JAVA_HOME: $javaHome" -ForegroundColor Yellow

# 환경변수 설정
$env:JAVA_HOME = $javaHome
$env:PATH = "$javaHome\bin;$env:PATH"

# Android 환경변수도 함께 설정
$env:ANDROID_HOME = "C:\Users\SSAFY\AppData\Local\Android\Sdk"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME
$env:PATH = "$env:PATH;$env:ANDROID_HOME\emulator;$env:ANDROID_HOME\platform-tools"

Write-Host "환경변수 설정 완료:" -ForegroundColor Green
Write-Host "JAVA_HOME: $env:JAVA_HOME"
Write-Host "ANDROID_HOME: $env:ANDROID_HOME"
Write-Host "ANDROID_SDK_ROOT: $env:ANDROID_SDK_ROOT"

# Java 버전 확인
Write-Host "`nJava 버전 확인:" -ForegroundColor Cyan
java -version

Write-Host "`n환경변수가 현재 세션에만 적용됩니다." -ForegroundColor Yellow
Write-Host "영구적으로 설정하려면 시스템 환경변수에 추가하세요." -ForegroundColor Yellow

