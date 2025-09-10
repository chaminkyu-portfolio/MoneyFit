import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../styles/theme';
import AuthTextInput from '../../components/domain/auth/AuthTextInput';
import AuthButton from '../../components/domain/auth/AuthButton';

const NicknameScreen = ({ navigation }: any) => {
  const [nickname, setNickname] = useState('');
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 닉네임 유효성 검사 (한글, 영어, 숫자만 허용)
  useEffect(() => {
    const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,10}$/;
    const isValid = nicknameRegex.test(nickname);
    setIsNicknameValid(isValid);

    // 에러 메시지 처리
    if (nickname.length > 0 && !isValid) {
      setErrorMessage('닉네임에는 한글, 영어, 숫자만 사용 가능합니다.');
    } else {
      setErrorMessage('');
    }
  }, [nickname]);

  const handleNext = () => {
    navigation.navigate('ProfileImage', { nickname });
  };

  const clearNickname = () => {
    setNickname('');
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackButtonText>&lt;</BackButtonText>
        </BackButton>
        <ProgressText>3/5</ProgressText>
      </Header>

      <TopContent>
        <Title>
          사용자님을{'\n'}
          어떻게 불러드리면 될까요?
        </Title>
        {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
      </TopContent>

      <MiddleContent>
        <InputContainer>
          <AuthTextInput
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임을 입력해주세요."
            maxLength={10}
          />
          {nickname.length > 0 && (
            <ClearButton onPress={clearNickname}>
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.colors.gray300}
              />
            </ClearButton>
          )}
        </InputContainer>
      </MiddleContent>

      <ButtonWrapper>
        <AuthButton
          text="다음"
          onPress={handleNext}
          disabled={!isNicknameValid}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default NicknameScreen;

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
  font-size: ${theme.fonts.caption}px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
`;

const TopContent = styled.View`
  padding: 24px;
`;

const MiddleContent = styled.View`
  flex: 1;
  padding: 0 24px;
  justify-content: center;
`;

const Title = styled.Text`
  font-size: ${theme.fonts.title}px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.gray900};
  line-height: 34px;
  margin-top: 16px;
  margin-bottom: 12px;
`;

const ErrorMessage = styled.Text`
  font-size: ${theme.fonts.caption}px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.error};
  position: absolute;
  top: 120px;
  left: 24px;
`;

const InputContainer = styled.View`
  position: relative;
  width: 100%;
`;

const ClearButton = styled.TouchableOpacity`
  position: absolute;
  right: 40px;
  top: 15px;
`;

const ButtonWrapper = styled.View`
  padding: 24px;
`;
