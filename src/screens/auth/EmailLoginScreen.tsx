import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Alert, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { theme } from '../../styles/theme';

import AuthTextInput from '../../components/domain/auth/AuthTextInput';
import AuthButton from '../../components/domain/auth/AuthButton';
import { FormGroup, Label } from '../../components/domain/auth/authFormStyles';

const EmailLoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isFormValid = email.length > 0 && password.length > 0;

  const handleLogin = () => {
    if (!isFormValid) return;
    // TODO: 로그인 API 연동
    Alert.alert('로그인 시도', `이메일: ${email}`);
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackButtonText> &lt; </BackButtonText>
        </BackButton>
        <ScreenTitle>이메일로 로그인</ScreenTitle>
        <RightPlaceholder />
      </Header>

      <ContentWrapper>
        <TitleWrapper>
          <SubTitle>소비 습관 플래너</SubTitle>
          <MainTitle>
            <HighlightText>머니핏</HighlightText>
          </MainTitle>
        </TitleWrapper>

        <FormContainer>
          <FormGroup>
            <Label>이메일</Label>
            <AuthTextInput
              value={email}
              onChangeText={setEmail}
              placeholder="example@example.com"
            />
          </FormGroup>

          <FormGroup>
            <Label>비밀번호</Label>
            <AuthTextInput
              value={password}
              onChangeText={setPassword}
              placeholder="비밀번호를 입력해주세요."
              isPassword={true}
            />
          </FormGroup>

          <AuthButton
            text="로그인"
            onPress={handleLogin}
            disabled={!isFormValid}
          />
        </FormContainer>

        <Footer>
          <FooterLink onPress={() => navigation.navigate('EmailInput')}>
            회원가입
          </FooterLink>
          <Separator>|</Separator>
          <FooterLink onPress={() => navigation.navigate('FindId')}>
            아이디 찾기
          </FooterLink>
          <Separator>|</Separator>
          <FooterLink onPress={() => navigation.navigate('FindPassword')}>
            비밀번호 찾기
          </FooterLink>
        </Footer>
      </ContentWrapper>
    </Container>
  );
};

export default EmailLoginScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
`;

const BackButton = styled.TouchableOpacity`
  flex: 1;
`;

const BackButtonText = styled.Text`
  font-size: 20px;
`;

const ScreenTitle = styled.Text`
  flex: 2;
  text-align: center;
  font-size: 16px;
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray800};
`;

const RightPlaceholder = styled.View`
  flex: 1;
`;

const ContentWrapper = styled.ScrollView.attrs({
  contentContainerStyle: {
    padding: 24,
    flexGrow: 1,
  },
  keyboardShouldPersistTaps: 'handled',
})``;

const TitleWrapper = styled.View`
  align-items: flex-start;
  margin-top: 40px;
  margin-bottom: 60px;
`;

const SubTitle = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 32px;
  color: ${theme.colors.gray900};
`;

const MainTitle = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 32px;
  color: ${theme.colors.gray900};
`;

const HighlightText = styled.Text`
  color: ${theme.colors.primary};
`;

const FormContainer = styled.View`
  width: 100%;
`;

const Footer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 24px;
`;

const FooterLink = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
`;

const Separator = styled.Text`
  margin: 0 12px;
  color: ${theme.colors.gray300};
`;
