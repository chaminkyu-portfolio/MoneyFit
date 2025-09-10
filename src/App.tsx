import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';

import { ThemeProvider } from 'styled-components/native';
import { theme } from './styles/theme';

import SplashScreen from './screens/auth/SplashScreen';
import MainNavigator from './navigation/MainNavigator';
import AuthNavigator from './navigation/AuthNavigator';

export default function App() {
  // 1. 앱 로딩 상태 (폰트 등 비동기 작업 처리)
  const [isLoading, setIsLoading] = useState(true);
  // 2. 로그인 상태 (false로 초기화)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
// 2. 로그인 상태 (false로 초기화)
//   const [isLoggedIn, setIsLoggedIn] = useState(__DEV__ ? true : false);

  const [fontsLoaded] = useFonts({
    'Pretendard-Light': require('./assets/fonts/Pretendard-Light.otf'),
    'Pretendard-Regular': require('./assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-Medium': require('./assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-SemiBold': require('./assets/fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Bold': require('./assets/fonts/Pretendard-Bold.otf'),
  });

  useEffect(() => {
    // 3. 폰트 로딩 완료 후 로딩 상태 변경
    if (fontsLoaded) {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  }, [fontsLoaded]);

  // 4. 로그인 상태에 따라 다른 화면 렌더링
  return (
    <ThemeProvider theme={theme}>
      {isLoading ? (
        <SplashScreen />
      ) : (
        <NavigationContainer>
          {isLoggedIn ? <MainNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      )}
    </ThemeProvider>
  );
}
