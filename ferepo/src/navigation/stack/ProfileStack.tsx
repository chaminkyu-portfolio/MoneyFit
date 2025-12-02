import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyPageScreen from '../../screens/mypage/MyPageScreen';
import ProfileEditScreen from '../../screens/mypage/ProfileEditScreen';
import AccountRegistrationScreen from '../../screens/mypage/AccountRegistrationScreen';
import AccountVerificationScreen from '../../screens/mypage/AccountVerificationScreen';
import ResultScreen from '../../screens/common/ResultScreen';
import EmailVerificationScreen from '../../screens/auth/email-signup/EmailVerificationScreen';
import PointGifticonScreen from '../../screens/mypage/PointGifticonScreen';
import GifticonProductScreen from '../../screens/mypage/GifticonProductScreen';
import PointCashoutScreen from '../../screens/mypage/PointCashoutScreen';
import PointCashoutCompleteScreen from '../../screens/mypage/PointCashoutCompleteScreen';
import NicknameSettingScreen from '../../screens/mypage/NicknameSettingScreen';
import PasswordSettingScreen from '../../screens/mypage/PasswordSettingScreen';

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyPage" component={MyPageScreen} />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <Stack.Screen
        name="AccountRegistration"
        component={AccountRegistrationScreen}
      />
      <Stack.Screen
        name="AccountVerification"
        component={AccountVerificationScreen}
      />
      <Stack.Screen name="Result" component={ResultScreen} />
      <Stack.Screen
        name="EmailVerification"
        component={EmailVerificationScreen}
      />
      <Stack.Screen name="PointGifticon" component={PointGifticonScreen} />
      <Stack.Screen name="GifticonProduct" component={GifticonProductScreen} />
      <Stack.Screen name="PointCashout" component={PointCashoutScreen} />
      <Stack.Screen
        name="PointCashoutComplete"
        component={PointCashoutCompleteScreen}
      />
      <Stack.Screen name="NicknameSetting" component={NicknameSettingScreen} />
      <Stack.Screen name="PasswordSetting" component={PasswordSettingScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
