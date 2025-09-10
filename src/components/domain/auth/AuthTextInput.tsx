// src/components/domain/auth/authTextInput.tsx

import React, { useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';
import { Ionicons } from '@expo/vector-icons';

interface IAuthTextInputProps {
  value: string;
  placeholder: string;
  maxLength?: number;
  isPassword?: boolean;
  onChangeText: (text: string) => void;
}

const AuthTextInput = ({
  value,
  placeholder,
  maxLength,
  onChangeText,
  isPassword = false,
}: IAuthTextInputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <Container>
      <StyledInput
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        secureTextEntry={isPassword && !isPasswordVisible}
        onChangeText={onChangeText}
        placeholderTextColor={theme.colors.gray500}
      />
      <RightView>
        {isPassword ? (
          <IconWrapper onPress={() => setIsPasswordVisible((prev) => !prev)}>
            <Ionicons
              name={isPasswordVisible ? 'eye' : 'eye-off'}
              size={24}
              color={theme.colors.gray400}
            />
          </IconWrapper>
        ) : maxLength ? (
          <CharCounter>
            {value.length} / {maxLength}
          </CharCounter>
        ) : null}
      </RightView>
    </Container>
  );
};

export default AuthTextInput;

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-color: ${theme.colors.gray300};
  width: 100%;
`;

const StyledInput = styled.TextInput`
  flex: 1;
  padding: 14px 0;
  font-size: ${theme.fonts.body}px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray900};
`;

const RightView = styled.View`
  flex-direction: row;
  align-items: center;
`;

const IconWrapper = styled.TouchableOpacity``;

const CharCounter = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: ${theme.fonts.caption}px;
  color: ${theme.colors.gray500};
  margin-left: 8px;
`;
