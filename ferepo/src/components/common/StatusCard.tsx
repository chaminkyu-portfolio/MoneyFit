import React from 'react';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

interface StatusCardProps {
  text: string;
  status: 'completed' | 'pending';
  isActive?: boolean;
}

const StatusCard = ({ text, status, isActive = false }: StatusCardProps) => {
  const getIconName = () => {
    switch (status) {
      case 'completed':
        return 'checkmark';
      case 'pending':
        return 'checkmark';
      default:
        return 'checkmark';
    }
  };

  const getIconColor = () => {
    return theme.colors.white;
  };

  const getBackgroundColor = () => {
    if (status === 'completed') return theme.colors.primary;
    return theme.colors.gray600;
  };

  const getTextColor = () => {
    if (status === 'completed') return theme.colors.gray900;
    return theme.colors.gray500;
  };

  return (
    <Container>
      <IconContainer backgroundColor={getBackgroundColor()}>
        <Ionicons
          name={getIconName() as any}
          size={16}
          color={getIconColor()}
        />
      </IconContainer>
      <Text color={getTextColor()}>{text}</Text>
    </Container>
  );
};

export default StatusCard;

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #fafafa;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 8px;
`;

const IconContainer = styled.View<{ backgroundColor: string }>`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${(props) => props.backgroundColor};
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

const Text = styled.Text<{ color: string }>`
  font-size: 16px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  flex: 1;
`;
