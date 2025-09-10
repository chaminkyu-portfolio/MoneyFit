import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { theme } from '../../../styles/theme';
import AuthTextInput from '../../../components/domain/auth/AuthTextInput';
import AuthButton from '../../../components/domain/auth/AuthButton';
import {
  FormGroup,
  Label,
} from '../../../components/domain/auth/authFormStyles';

const PasswordScreen = ({ navigation, route }: any) => {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [doPasswordsMatch, setDoPasswordsMatch] = useState(false);

  // 비밀번호 유효성 검사를 위한 useEffect
  useEffect(() => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[0-9]).{8,20}$/;
    const isValid = passwordRegex.test(password);
    setIsPasswordValid(isValid);

    const isMatch = password === passwordConfirm;
    setDoPasswordsMatch(isMatch);

    if (password && !isValid) {
      setErrorMessage(
        '비밀번호는 영문 소문자, 숫자를 포함하여 8~20자여야 합니다.',
      );
    } else {
      setErrorMessage('');
    }
  }, [password, passwordConfirm]);

  const handleNext = () => {
    navigation.navigate('Nickname');
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackButtonText>&lt;</BackButtonText>
        </BackButton>
        <ProgressText>2/5</ProgressText>
      </Header>

      <Content>
        <Title>
          안전한 사용을 위해{'\n'}
          비밀번호를 입력해주세요.
        </Title>
        {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}

        <FormGroup>
          <Label>비밀번호</Label>
          <AuthTextInput
            value={password}
            onChangeText={setPassword}
            placeholder="비밀번호를 입력해주세요."
            isPassword
            maxLength={20}
          />
        </FormGroup>

        <FormGroup>
          <Label>비밀번호 확인</Label>
          <AuthTextInput
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            placeholder="비밀번호를 입력해주세요."
            isPassword
            maxLength={20}
          />
        </FormGroup>
      </Content>

      <ButtonWrapper>
        <AuthButton
          text="다음"
          onPress={handleNext}
          disabled={!isPasswordValid || !doPasswordsMatch}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default PasswordScreen;

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
  margin-bottom: 12px;
`;

const ErrorMessage = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.error};
  margin-bottom: 24px;
`;

const ButtonWrapper = styled.View`
  padding: 24px;
`;
