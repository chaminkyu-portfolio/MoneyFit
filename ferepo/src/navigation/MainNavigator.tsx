import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { HomeStack, ProfileStack, AnalysisStack } from './stack';
import { theme } from '../styles/theme';
import { useMyInfo } from '../hooks/user/useUser';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  const insets = useSafeAreaInsets();

  // 앱 시작 시 내 정보 조회 API 호출
  useMyInfo();

  // 탭 바를 숨길 화면 이름 목록 (공통으로 관리)
  const hideOnScreens = [
    'Result',
    'ActiveRoutine',
    'PersonalRoutineDetail',
    'Loading',
    'RoutineSuggestion',
    'FinancialProduct',
    'CreateRoutine',
    'CreateRoutineDetail',
    'CreateGroupRoutine',
    'CreateGroupRoutineDetail',
    'AIRecommendation',
    'AIRecommendationResult',
    'GifticonProduct',
  ];

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Analysis') {
            iconName = focused ? 'bulb' : 'bulb-outline';
          } else if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray500,
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          backgroundColor: theme.colors.white,
          borderTopWidth: 1,
          borderTopColor: theme.colors.gray200,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: theme.fonts.Regular,
        },
      })}
    >
      <Tab.Screen
        name="Analysis"
        component={AnalysisStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Analysis';

          return {
            tabBarStyle: {
              display: hideOnScreens.includes(routeName) ? 'none' : 'flex',
              height: 60 + insets.bottom,
              paddingBottom: insets.bottom,
              paddingTop: 8,
              backgroundColor: theme.colors.white,
              borderTopWidth: 1,
              borderTopColor: theme.colors.gray200,
            },
            tabBarLabel: '분석',
          };
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';

          return {
            tabBarStyle: {
              display: hideOnScreens.includes(routeName) ? 'none' : 'flex',
              height: 60 + insets.bottom,
              paddingBottom: insets.bottom,
              paddingTop: 8,
              backgroundColor: theme.colors.white,
              borderTopWidth: 1,
              borderTopColor: theme.colors.gray200,
            },
            tabBarLabel: '홈',
          };
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={({ route }) => {
          // ProfileStack 안의 현재 화면 이름을 가져옵니다.
          // 초기 화면일 경우를 대비해 기본값으로 'MyPage'를 설정합니다.
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'MyPage';

          // 탭 바를 숨길 화면 이름 목록
          const hideOnScreens = [
            'AccountRegistration',
            'AccountVerification',
            'Result',
            'EmailVerification',
            'PointCashoutComplete',
            'NicknameSetting',
            'PasswordSetting',
            'GifticonProduct',
            'PointCashout',
          ];

          return {
            // hideOnScreens 목록에 현재 화면 이름이 포함되어 있으면 탭 바를 숨깁니다.
            tabBarStyle: {
              display: hideOnScreens.includes(routeName) ? 'none' : 'flex',
              height: 60 + insets.bottom,
              paddingBottom: insets.bottom,
              paddingTop: 8,
              backgroundColor: theme.colors.white,
              borderTopWidth: 1,
              borderTopColor: theme.colors.gray200,
            },
            tabBarLabel: '내 정보',
          };
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
