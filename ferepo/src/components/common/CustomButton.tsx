import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';

/**
 * CustomButton의 props 인터페이스
 */
interface ICustomButtonProps {
  /** 버튼 텍스트 */
  text: string;
  /** 클릭 핸들러 */
  onPress: () => void;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 배경 색상 */
  backgroundColor?: string;
  /** 글자 색상 */
  textColor?: string;
  /** 테두리 색상 */
  borderColor?: string;
  /** 테두리 두께 */
  borderWidth?: number;
}

/**
 * 공통 커스텀 버튼 컴포넌트
 * @param props - 컴포넌트 props
 * @returns 커스텀 버튼 컴포넌트
 */
const CustomButton = ({
  text,
  onPress,
  disabled = false,
  backgroundColor,
  textColor,
  borderColor,
  borderWidth = 0,
}: ICustomButtonProps) => {
  return (
    <Container
      onPress={onPress}
      disabled={disabled}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      borderWidth={borderWidth}
    >
      <ButtonText disabled={disabled} textColor={textColor}>
        {text}
      </ButtonText>
    </Container>
  );
};

export default CustomButton;

// 스타일 컴포넌트 정의
const Container = styled.TouchableOpacity<{
  disabled: boolean;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth: number;
}>`
  width: 100%;
  padding: 18px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  border-width: ${(props) => props.borderWidth}px;
  border-color: ${(props) => {
    if (props.disabled) return theme.colors.gray300;
    return props.borderColor || 'transparent';
  }};

  background-color: ${(props) => {
    if (props.disabled) return theme.colors.gray200;
    return props.backgroundColor || theme.colors.primary;
  }};
`;

const ButtonText = styled.Text<{ disabled: boolean; textColor?: string }>`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;

  color: ${(props) => {
    if (props.disabled) return theme.colors.gray500;
    return props.textColor || theme.colors.white;
  }};
`;
