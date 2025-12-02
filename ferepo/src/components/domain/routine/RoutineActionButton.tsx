import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../styles/theme';

interface RoutineActionButtonProps {
  type: 'pause' | 'complete' | 'skip' | 'play';
  onPress: () => void;
  disabled?: boolean;
}

const RoutineActionButton = ({
  type,
  onPress,
  disabled = false,
}: RoutineActionButtonProps) => {
  const getButtonConfig = () => {
    switch (type) {
      case 'pause':
        return {
          icon: 'pause' as const,
          backgroundColor: theme.colors.gray200,
          iconColor: theme.colors.gray600,
        };
      case 'play':
        return {
          icon: 'play' as const,
          backgroundColor: theme.colors.primary,
          iconColor: theme.colors.white,
        };
      case 'complete':
        return {
          icon: 'checkmark' as const,
          backgroundColor: theme.colors.primary,
          iconColor: theme.colors.white,
        };
      case 'skip':
        return {
          icon: 'chevron-forward' as const,
          backgroundColor: theme.colors.gray200,
          iconColor: theme.colors.gray600,
        };
    }
  };

  const config = getButtonConfig();

  return (
    <ButtonContainer
      backgroundColor={config.backgroundColor}
      onPress={onPress}
      disabled={disabled}
    >
      <Ionicons name={config.icon} size={24} color={config.iconColor} />
    </ButtonContainer>
  );
};

export default RoutineActionButton;

const ButtonContainer = styled(TouchableOpacity)<{ backgroundColor: string }>`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${(props) => props.backgroundColor};
  justify-content: center;
  align-items: center;
  margin: 0 12px;
`;
