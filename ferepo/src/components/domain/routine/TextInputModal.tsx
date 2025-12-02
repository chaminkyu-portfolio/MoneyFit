import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { TextInput, TouchableOpacity } from 'react-native';
import { theme } from '../../../styles/theme';
import BottomSheetDialog from '../../common/BottomSheetDialog';

interface TextInputModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onSubmit: (text: string) => void;
  initialValue?: string;
}

const TextInputModal = ({
  visible,
  onRequestClose,
  onSubmit,
  initialValue = '',
}: TextInputModalProps) => {
  const [text, setText] = useState(initialValue);

  useEffect(() => {
    setText(initialValue);
  }, [initialValue]);

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim());
    }
  };

  return (
    <BottomSheetDialog visible={visible} onRequestClose={onRequestClose}>
      <Container>
        <InputContainer>
          <StyledTextInput
            value={text}
            onChangeText={setText}
            placeholder="루틴을 입력해주세요"
            placeholderTextColor={theme.colors.gray400}
            multiline={false}
            autoFocus={true}
          />
        </InputContainer>
        <ButtonContainer>
          <CancelButton onPress={onRequestClose}>
            <CancelButtonText>취소</CancelButtonText>
          </CancelButton>
          <SubmitButton onPress={handleSubmit}>
            <SubmitButtonText>확인</SubmitButtonText>
          </SubmitButton>
        </ButtonContainer>
      </Container>
    </BottomSheetDialog>
  );
};

export default TextInputModal;

const Container = styled.View`
  padding: 24px;
`;

const InputContainer = styled.View`
  margin-bottom: 24px;
`;

const StyledTextInput = styled(TextInput)`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.gray800};
  padding: 16px;
  background-color: ${theme.colors.gray50};
  border-radius: 12px;
  min-height: 48px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const CancelButton = styled(TouchableOpacity)`
  flex: 1;
  padding: 16px;
  background-color: ${theme.colors.gray100};
  border-radius: 12px;
  align-items: center;
`;

const CancelButtonText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.gray600};
`;

const SubmitButton = styled(TouchableOpacity)`
  flex: 1;
  padding: 16px;
  background-color: ${theme.colors.primary};
  border-radius: 12px;
  align-items: center;
`;

const SubmitButtonText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.white};
`;
