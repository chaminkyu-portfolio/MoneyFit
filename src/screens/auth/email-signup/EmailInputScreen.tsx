import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { theme } from '../../../styles/theme';
import AuthTextInput from '../../../components/domain/auth/AuthTextInput';
import AuthButton from '../../../components/domain/auth/AuthButton';

const EmailInputScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');

  // 간단한 이메일 형식 유효성 검사
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  const handleNext = () => {
    if (isEmailValid) {
      navigation.navigate('EmailVerification', { email });
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackButtonText>&lt;</BackButtonText>
        </BackButton>
        <ProgressText>1/5</ProgressText>
      </Header>

      <Content>
        <Title>
          만나서 반가워요.{'\n'}
          이메일을 입력해주세요!
        </Title>
        <AuthTextInput
          value={email}
          onChangeText={setEmail}
          placeholder="example@example.com"
          maxLength={30}
        />
      </Content>

      <ButtonWrapper>
        <AuthButton text="다음" onPress={handleNext} disabled={!isEmailValid} />
      </ButtonWrapper>
    </Container>
  );
};

export default EmailInputScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
`;

const BackButton = styled.TouchableOpacity``;

const BackButtonText = styled.Text`
  font-size: 24px;
`;

const ProgressText = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
`;

const Content = styled.View`
  flex: 1;
  padding: 24px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.gray900};
  line-height: 34px;
  margin-top: 16px;
  margin-bottom: 48px;
`;

const ButtonWrapper = styled.View`
  padding: 24px;
`;
