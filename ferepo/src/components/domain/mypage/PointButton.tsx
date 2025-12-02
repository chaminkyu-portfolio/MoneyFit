import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';

/**
 * PointButton의 props 인터페이스
 */
interface IPointButtonProps {
  /** 버튼 텍스트 */
  text: string;
  /** 버튼 클릭 핸들러 */
  onPress: () => void;
  /** 버튼 너비 비율 (기본값: 1) */
  flex?: number;
}

/**
 * 개별 포인트 버튼 컴포넌트
 * @param props - 컴포넌트 props
 * @returns 포인트 버튼 컴포넌트
 */
const PointButton = ({ text, onPress, flex = 1 }: IPointButtonProps) => {
  return (
    <ButtonContainer flex={flex} onPress={onPress}>
      <ButtonText>{text}</ButtonText>
    </ButtonContainer>
  );
};

export default PointButton;

// 스타일 컴포넌트 정의
const ButtonContainer = styled.TouchableOpacity<{ flex: number }>`
  flex: ${(props) => props.flex};
  padding: 12px 8px;
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.primary};
  border-radius: 8px;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.primary};
`;
