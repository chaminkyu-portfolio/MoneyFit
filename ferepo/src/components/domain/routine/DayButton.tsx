import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Text } from 'react-native';
import { theme } from '../../../styles/theme';

interface DayButtonProps {
  day: string;
  isSelected: boolean;
  onPress: () => void;
  disabled?: boolean;
  buttonSize?: number;
  borderRadius?: number;
}

const DayButton = ({
  day,
  isSelected,
  onPress,
  disabled = false,
  buttonSize = 28,
  borderRadius = 14,
}: DayButtonProps) => {
  return (
    <Button
      onPress={disabled ? undefined : onPress}
      isSelected={isSelected}
      disabled={disabled}
      buttonSize={buttonSize}
      borderRadius={borderRadius}
    >
      <ButtonText isSelected={isSelected}>{day}</ButtonText>
    </Button>
  );
};

export default DayButton;

const Button = styled(TouchableOpacity)<{
  isSelected: boolean;
  buttonSize: number;
  borderRadius: number;
}>`
  flex: 1;
  aspect-ratio: 1;
  max-width: ${({ buttonSize }) => buttonSize}px;
  max-height: ${({ buttonSize }) => buttonSize}px;
  border-radius: ${({ borderRadius }) => borderRadius}px;
  background-color: ${({ isSelected }) =>
    isSelected ? theme.colors.primary : theme.colors.gray100};
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled(Text)<{ isSelected: boolean }>`
  font-family: ${theme.fonts.Medium};
  font-size: 12px;
  font-weight: 500;
  color: ${({ isSelected }) =>
    isSelected ? theme.colors.white : theme.colors.gray600};
`;
