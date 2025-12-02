import React from 'react';
import styled from 'styled-components/native';

import { theme } from '../../../styles/theme';

/**
 * ToggleSwitch의 props 인터페이스
 */
interface IToggleSwitchProps {
  /** 토글 상태 */
  isEnabled: boolean;
  /** 토글 상태 변경 핸들러 */
  onToggle: (value: boolean) => void;
  /** 비활성화 여부 */
  disabled?: boolean;
}

/**
 * 토글 스위치 컴포넌트
 * @param props - 컴포넌트 props
 * @returns 토글 스위치 컴포넌트
 */
const ToggleSwitch = ({
  isEnabled,
  onToggle,
  disabled = false,
}: IToggleSwitchProps) => {
  const handlePress = () => {
    if (!disabled) {
      onToggle(!isEnabled);
    }
  };

  return (
    <Container onPress={handlePress} disabled={disabled}>
      <Track isEnabled={isEnabled} disabled={disabled}>
        <Thumb isEnabled={isEnabled} disabled={disabled} />
      </Track>
    </Container>
  );
};

export default ToggleSwitch;

// 스타일 컴포넌트 정의
const Container = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;

const Track = styled.View<{ isEnabled: boolean; disabled: boolean }>`
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background-color: ${(props) => {
    if (props.disabled) return theme.colors.gray300;
    return props.isEnabled ? theme.colors.primary : theme.colors.gray300;
  }};
  padding: 2px;
  justify-content: center;
`;

const Thumb = styled.View<{ isEnabled: boolean; disabled: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: ${theme.colors.white};
  transform: translateX(${(props) => (props.isEnabled ? 20 : 0)}px);
`;
