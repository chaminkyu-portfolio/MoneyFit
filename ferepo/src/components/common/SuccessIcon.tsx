import React from 'react';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

interface SuccessIconProps {
  size?: number;
  iconColor?: string;
  backgroundColor?: string;
  borderColor?: string;
}

const SuccessIcon = ({
  size = 80,
  iconColor = theme.colors.primary,
  backgroundColor = theme.colors.white,
  borderColor = theme.colors.primary,
}: SuccessIconProps) => {
  return (
    <IconContainer
      size={size}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
    >
      <Ionicons name="checkmark" size={size * 0.5} color={iconColor} />
    </IconContainer>
  );
};

export default SuccessIcon;

const IconContainer = styled.View<{
  size: number;
  backgroundColor: string;
  borderColor: string;
}>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: ${(props) => props.size / 2}px;
  background-color: ${(props) => props.backgroundColor};
  border: 2px solid ${(props) => props.borderColor};
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
`;
