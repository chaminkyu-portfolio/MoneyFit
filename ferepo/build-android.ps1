# Android 빌드 스크립트 (JDK 17)
Write-Host "Android 빌드 시작..." -ForegroundColor Green

# JDK 17 환경변수 설정
$javaPath = (Get-Command java).Source
$javaHome = Split-Path (Split-Path $javaPath -Parent) -Parent
$env:JAVA_HOME = $javaHome
$env:PATH = "$javaHome\bin;$env:PATH"

# Android 환경변수 설정
$env:ANDROID_HOME = "C:\Users\SSAFY\AppData\Local\Android\Sdk"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME
$env:ANDROID_SDK_HOME = $env:ANDROID_HOME

Write-Host "환경변수 설정 완료:" -ForegroundColor Yellow
Write-Host "ANDROID_HOME: $env:ANDROID_HOME"
Write-Host "ANDROID_SDK_ROOT: $env:ANDROID_SDK_ROOT"

# SDK 경로 확인
if (Test-Path $env:ANDROID_HOME) {
    Write-Host "Android SDK 경로 확인됨: $env:ANDROID_HOME" -ForegroundColor Green
} else {
    Write-Host "Android SDK 경로를 찾을 수 없습니다: $env:ANDROID_HOME" -ForegroundColor Red
    exit 1
}

# Gradle 캐시 정리
Write-Host "Gradle 캐시 정리 중..." -ForegroundColor Yellow
cd android
./gradlew clean --stop
cd ..

# 빌드 실행
Write-Host "Android 빌드 시작..." -ForegroundColor Green
npx expo run:android --clear

Write-Host "빌드 완료!" -ForegroundColor Green
