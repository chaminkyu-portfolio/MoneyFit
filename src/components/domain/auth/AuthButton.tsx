import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';

interface IAuthButtonProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
}

const AuthButton = ({ text, onPress, disabled = false }: IAuthButtonProps) => {
  return (
    <Container onPress={onPress} disabled={disabled}>
      <ButtonText active={!disabled}>{text}</ButtonText>
    </Container>
  );
};

export default AuthButton;

const Container = styled.TouchableOpacity`
  width: 100%;
  padding: 18px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;

  background-color: ${(props: { disabled: boolean }) =>
    props.disabled ? theme.colors.gray200 : theme.colors.primary};
`;

const ButtonText = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 16px;

  color: ${(props: { disabled: boolean }) =>
    props.disabled ? theme.colors.gray500 : theme.colors.white};
`;
