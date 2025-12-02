import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import Header from '../../components/common/Header';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import { theme } from '../../styles/theme';
import { useAuthStore } from '../../store';
import { validateNickname } from '../../utils/validation';
import { useCheckNicknameDuplicate } from '../../hooks/user/useUser';
import { useErrorHandler } from '../../hooks/common/useErrorHandler';

const NicknameScreen = ({ navigation, route }: any) => {
  const [nickname, setNickname] = useState('');
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [shouldCheckDuplicate, setShouldCheckDuplicate] = useState(false);

  // Zustand 회원가입 스토어에서 닉네임 설정 함수 가져오기
  const { setSignupNickname } = useAuthStore();

  // 공통 에러 처리 훅
  const { handleApiError } = useErrorHandler();

  // 닉네임 중복 확인 API hook
  const {
    data: duplicateCheckData,
    isLoading: isCheckingDuplicate,
    error: duplicateCheckError,
    refetch: refetchDuplicateCheck,
  } = useCheckNicknameDuplicate(nickname, shouldCheckDuplicate);

  // 닉네임 유효성 검사 (한글, 영어, 숫자만 허용, 2~10자)
  useEffect(() => {
    const isValid = validateNickname(nickname);
    setIsNicknameValid(isValid);

    // 에러 메시지 처리 (중복체크 중이거나 중복 에러가 있을 때는 유효성 검사 에러만 표시)
    if (nickname.length > 0 && !shouldCheckDuplicate && !duplicateCheckError) {
      if (nickname.length < 2) {
        setErrorMessage('닉네임은 2자 이상 입력해주세요.');
      } else if (nickname.length > 10) {
        setErrorMessage('닉네임은 10자 이하로 입력해주세요.');
      } else if (!/^[가-힣a-zA-Z0-9]+$/.test(nickname)) {
        setErrorMessage('닉네임에는 한글, 영어, 숫자만 사용 가능합니다.');
      } else {
        setErrorMessage('');
      }
    } else if (nickname.length === 0) {
      setErrorMessage('');
    }
  }, [nickname, shouldCheckDuplicate, duplicateCheckError]);

  // 닉네임 중복 확인 결과 처리
  useEffect(() => {
    if (shouldCheckDuplicate && !isCheckingDuplicate) {
      if (duplicateCheckError) {
        // 간단한 에러 처리
        const message = handleApiError(duplicateCheckError, false); // Alert 표시 안함
        setErrorMessage(message);
        setShouldCheckDuplicate(false);
      } else if (duplicateCheckData) {
        // 중복 확인 성공 - 사용 가능한 닉네임
        setErrorMessage('');
        setShouldCheckDuplicate(false);
        // 자동으로 다음 화면으로 이동
        handleNicknameVerified();
      }
    }
  }, [
    shouldCheckDuplicate,
    isCheckingDuplicate,
    duplicateCheckData,
    duplicateCheckError,
    handleApiError,
  ]);

  const handleNext = () => {
    if (isNicknameValid) {
      // 닉네임 중복 확인 실행
      setShouldCheckDuplicate(true);
      refetchDuplicateCheck();
    }
  };

  // 중복 확인이 성공했을 때만 다음 화면으로 이동
  const handleNicknameVerified = () => {
    if (isNicknameValid && !errorMessage && !isCheckingDuplicate) {
      // Zustand 스토어에 닉네임 저장
      setSignupNickname(nickname);

      // route.params로 이메일, 비밀번호, 닉네임 전달
      const { email, password } = route.params || {};
      navigation.navigate('Age', { email, password, nickname, provider: 'LOCAL', providerId: email });
    }
  };

  const clearNickname = () => {
    setNickname('');
  };

  return (
    <Container>
      <Header
        onBackPress={() => navigation.goBack()}
        rightComponent={<ProgressText>4/7</ProgressText>}
      />

      <Content>
        <Title>
          사용자님을{'\n'}
          어떻게 불러드리면 될까요?
        </Title>
        {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
      </Content>

      <CenterContent>
        <InputContainer>
          <CustomInput
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임을 입력해주세요."
            maxLength={10}
            onClear={clearNickname}
          />
        </InputContainer>
      </CenterContent>

      <ButtonWrapper>
        <CustomButton
          text={isCheckingDuplicate ? '확인 중...' : '다음'}
          onPress={handleNext}
          disabled={!isNicknameValid || isCheckingDuplicate}
          backgroundColor={
            isNicknameValid && !isCheckingDuplicate
              ? theme.colors.primary
              : theme.colors.gray200
          }
          textColor={
            isNicknameValid && !isCheckingDuplicate
              ? theme.colors.white
              : theme.colors.gray500
          }
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

const ProgressText = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
`;

const Content = styled.View`
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
  margin-top: 8px;
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

const ClearButton = styled.TouchableOpacity`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-10px);
`;

const ButtonWrapper = styled.View`
  padding: 24px;
`;
