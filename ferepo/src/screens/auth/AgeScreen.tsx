import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import CustomButton from '../../components/common/CustomButton';
import CustomInput from '../../components/common/CustomInput';
import { useAuthStore } from '../../store';

const AgeScreen = ({ navigation, route }: any) => {
  const [age, setAge] = useState('');
  const { email, password, nickname, provider, providerId } = route.params || {};

  // Zustand 스토어에서 나이 설정 함수 가져오기
  const { setSignupAge, signupData } = useAuthStore();

  // 나이 유효성 검사
  const validateAge = (inputAge: string) => {
    const ageNum = parseInt(inputAge, 10);
    return !isNaN(ageNum) && ageNum >= 1 && ageNum <= 120;
  };

  // 나이 입력 핸들러
  const handleAgeChange = (text: string) => {
    // 숫자만 입력 허용
    const numericText = text.replace(/[^0-9]/g, '');
    setAge(numericText);
  };

  const handleNext = () => {
    if (!validateAge(age)) {
      Alert.alert('알림', '올바른 나이를 입력해주세요 (1-120세)');
      return;
    }

    // 나이 정보를 스토어에 저장
    setSignupAge(parseInt(age, 10));

    // route.params로 모든 데이터 전달
    navigation.navigate('ProfileImage', {
      email,
      password,
      nickname,
      provider,
      providerId,
      age: parseInt(age, 10),
    });
  };

  const isButtonEnabled = validateAge(age);

  return (
    <Container>
      <Header
        onBackPress={() => navigation.goBack()}
        rightComponent={<ProgressText>5/7</ProgressText>}
      />

      <Content>
        <Title>
          <HighlightText>나이</HighlightText>를{'\n'}
          알려주세요.
        </Title>
        <SubTitle>정확한 나이 정보는 맞춤형 서비스 제공에 도움이 됩니다.</SubTitle>
      </Content>

      <CenterContent>
        <InputContainer>
          <CustomInput
            value={age}
            placeholder="나이를 입력해주세요"
            onChangeText={handleAgeChange}
            keyboardType="number-pad"
            maxLength={3}
            showCharCounter={false}
            isSelected={validateAge(age)}
          />
        </InputContainer>
      </CenterContent>

      <ButtonWrapper>
        <CustomButton
          text="다음"
          onPress={handleNext}
          backgroundColor={
            isButtonEnabled ? theme.colors.primary : theme.colors.gray200
          }
          textColor={
            isButtonEnabled ? theme.colors.white : theme.colors.gray500
          }
          disabled={!isButtonEnabled}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default AgeScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const ProgressText = styled.Text`
  font-size: ${theme.fonts.caption}px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
`;

const Content = styled.View`
  flex: 1;
  padding: 24px;
`;

const Title = styled.Text`
  font-size: ${theme.fonts.title}px;
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray900};
  line-height: 34px;
  margin-top: 16px;
`;

const HighlightText = styled.Text`
  color: ${theme.colors.primary};
`;

const SubTitle = styled.Text`
  font-size: ${theme.fonts.body}px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  margin-top: 8px;
  margin-bottom: 24px;
`;

const CenterContent = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 0 24px;
`;

const InputContainer = styled.View`
  width: 100%;
  position: relative;
`;

const ButtonWrapper = styled.View`
  padding: 24px;
`;
