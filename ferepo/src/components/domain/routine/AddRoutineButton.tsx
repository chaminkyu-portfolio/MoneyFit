import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';
import { Ionicons } from '@expo/vector-icons';

interface AddRoutineButtonProps {
  onPress: () => void;
}

const AddRoutineButton = ({ onPress }: AddRoutineButtonProps) => {
  return (
    <Container onPress={onPress}>
      <Ionicons name="add" size={24} color={theme.colors.white} />
    </Container>
  );
};

export default AddRoutineButton;

const Container = styled.TouchableOpacity`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${theme.colors.primary};
  align-items: center;
  justify-content: center;
`;
