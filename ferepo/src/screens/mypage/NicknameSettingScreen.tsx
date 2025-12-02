import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';

import Header from '../../components/common/Header';
import { theme } from '../../styles/theme';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import { useUserStore } from '../../store';
import { validateNickname } from '../../utils/validation';
import { useResetNickname } from '../../hooks/user';
import { useErrorHandler } from '../../hooks/common/useErrorHandler';

interface INicknameSettingScreenProps {
  navigation: any;
}

const NicknameSettingScreen = ({ navigation }: INicknameSettingScreenProps) => {
  const [nickname, setNickname] = useState('');
  const [isValidNickname, setIsValidNickname] = useState(false);
  const [currentNickname, setCurrentNickname] = useState(''); // 현재 사용자 닉네임
  const [validationMessage, setValidationMessage] = useState('');
  const { mutateAsync: resetNicknameMutate } = useResetNickname();

  // 공통 에러 처리 훅
  const { handleApiError } = useErrorHandler();

  // Zustand 스토어에서 사용자 정보 가져오기
  const { userInfo, updateUserInfo } = useUserStore();

  // 화면 진입 시 현재 닉네임 설정
  useEffect(() => {
    if (userInfo?.nickname) {
      setCurrentNickname(userInfo.nickname);
      setNickname(userInfo.nickname); // 입력 필드에 현재 닉네임 미리 표시
      // 초기 유효성 검사 실행 (현재 닉네임과 동일하므로 에러 메시지 표시)
      validateNicknameInput(userInfo.nickname);
    }
  }, [userInfo?.nickname]);

  const validateNicknameInput = (text: string) => {
    // 빈 문자열 체크
    if (text.length === 0) {
      setValidationMessage('');
      setIsValidNickname(false);
      return;
    }

    // 길이 체크 (2글자 이상, 10글자 이하)
    if (text.length < 2 || text.length > 10) {
      setValidationMessage('닉네임은 2글자 이상 10글자 이하여야 합니다.');
      setIsValidNickname(false);
      return;
    }

    // 한글, 영어, 숫자만 허용하는 정규식 (유틸리티 함수 사용)
    if (!validateNickname(text)) {
      setValidationMessage('닉네임은 한글, 영어, 숫자만 사용 가능합니다.');
      setIsValidNickname(false);
      return;
    }

    // 현재 닉네임과 동일한지 체크 (변경이 없는 경우)
    if (text === currentNickname) {
      setValidationMessage('현재 닉네임과 동일합니다.');
      setIsValidNickname(false);
      return;
    }

    // 모든 검증 통과
    setValidationMessage('');
    setIsValidNickname(true);
  };

  const handleNicknameChange = (text: string) => {
    setNickname(text);
    validateNicknameInput(text);
  };

  const handleComplete = async () => {
    if (!isValidNickname) return;

    try {
      const response = await resetNicknameMutate({ nickname });
      if (response.isSuccess) {
        // 닉네임 변경 완료 후 ResultScreen으로 이동
        updateUserInfo({ nickname });
        navigation.replace('Result', {
          type: 'success',
          title: '변경 완료',
          description: '닉네임을 성공적으로 변경했어요',
          nextScreen: 'ProfileEdit',
          onSuccess: () => {},
        });
      } else {
        // 실패 시 에러 메시지를 validationMessage에 표시
        const errorMessage = response.message || '닉네임 변경에 실패했어요';
        setValidationMessage(errorMessage);
      }
    } catch (error: any) {
      // 에러 시 간단한 에러 처리로 메시지 표시
      const message = handleApiError(error, false); // Alert 표시 안함
      setValidationMessage(message);
    }
  };

  const getInstructionText = () => {
    return (
      <InstructionText>
        <InstructionTextPart>* 닉네임을 재설정하면 </InstructionTextPart>
        <HighlightedText>30일간 변경할 수 없습니다.</HighlightedText>
      </InstructionText>
    );
  };

  return (
    <Container>
      <Header title="닉네임 설정" onBackPress={() => navigation.goBack()} />

      <Content>
        <NicknameSection>
          <NicknameLabel>닉네임</NicknameLabel>
          <InputContainer>
            <CustomInput
              value={nickname}
              placeholder="닉네임을 입력해주세요."
              maxLength={10}
              onChangeText={handleNicknameChange}
            />
          </InputContainer>
          {getInstructionText()}
          <ErrorContainer>
            {validationMessage ? (
              <ErrorText>{validationMessage}</ErrorText>
            ) : null}
          </ErrorContainer>
        </NicknameSection>
      </Content>

      <ButtonContainer>
        <CustomButton
          text="완료"
          onPress={handleComplete}
          disabled={!isValidNickname || nickname.length === 0}
          backgroundColor={
            isValidNickname && nickname.length > 0
              ? theme.colors.primary
              : theme.colors.gray200
          }
          textColor={
            isValidNickname && nickname.length > 0
              ? theme.colors.white
              : theme.colors.gray500
          }
        />
      </ButtonContainer>
    </Container>
  );
};

export default NicknameSettingScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  flex: 1;
  padding: 24px;
`;

const NicknameSection = styled.View`
  margin-top: 32px;
`;

const NicknameLabel = styled.Text`
  font-size: 16px;
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray900};
  margin-bottom: 12px;
`;

const InputContainer = styled.View`
  margin-bottom: 8px;
`;

const InstructionText = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const InstructionTextPart = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
`;

const HighlightedText = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.primary};
`;

const ErrorContainer = styled.View`
  height: 20px;
  justify-content: center;
`;

const ErrorText = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.error};
`;

const ButtonContainer = styled.View`
  padding: 24px;
`;
