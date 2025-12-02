import React, { useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';

/**
 * CustomInput의 props 인터페이스
 */
interface ICustomInputProps {
  /** 입력값 */
  value: string;
  /** 플레이스홀더 */
  placeholder: string;
  /** 최대 길이 */
  maxLength?: number;
  /** 비밀번호 입력 여부 */
  isPassword?: boolean;
  /** 텍스트 변경 핸들러 */
  onChangeText: (text: string) => void;
  /** 텍스트 클리어 핸들러 */
  onClear?: () => void;
  /** 우측 접미사 (예: P) */
  suffix?: string;
  /** 문자 카운터 표시 여부 */
  showCharCounter?: boolean;
  /** 선택 상태 (테두리 색상 변경용) */
  isSelected?: boolean;
  /** 키보드 타입 */
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
}

/**
 * 공통 커스텀 텍스트 입력 컴포넌트
 * @param props - 컴포넌트 props
 * @returns 커스텀 텍스트 입력 컴포넌트
 */
const CustomInput = ({
  value,
  placeholder,
  maxLength,
  onChangeText,
  isPassword = false,
  onClear,
  suffix,
  showCharCounter = true,
  isSelected = false,
  keyboardType = 'default',
}: ICustomInputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <Container isSelected={isSelected}>
      <StyledInput
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        secureTextEntry={isPassword && !isPasswordVisible}
        onChangeText={onChangeText}
        placeholderTextColor={theme.colors.gray500}
        keyboardType={keyboardType}
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
        ) : (
          <>
            {suffix && <SuffixText>{suffix}</SuffixText>}
            {maxLength && showCharCounter && (
              <CharCounter>
                {value.length} / {maxLength}
              </CharCounter>
            )}
            {onClear && value.length > 0 && (
              <ClearButton onPress={onClear}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={theme.colors.gray300}
                />
              </ClearButton>
            )}
          </>
        )}
      </RightView>
    </Container>
  );
};

export default CustomInput;

// 스타일 컴포넌트 정의
const Container = styled.View<{ isSelected: boolean }>`
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-color: ${({ isSelected }) =>
    isSelected ? theme.colors.primary : theme.colors.gray300};
  width: 100%;
`;

const StyledInput = styled.TextInput`
  flex: 1;
  padding: 8px 0;
  font-size: ${theme.fonts.body}px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray900};
`;

const RightView = styled.View`
  flex-direction: row;
  align-items: center;
`;

const IconWrapper = styled.TouchableOpacity``;

const SuffixText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: ${theme.fonts.body}px;
  color: ${theme.colors.gray900};
  margin-right: 8px;
`;

const CharCounter = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: ${theme.fonts.caption}px;
  color: ${theme.colors.gray500};
  margin-right: 8px;
`;

const ClearButton = styled.TouchableOpacity``;
