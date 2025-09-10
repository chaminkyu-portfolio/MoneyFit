import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';

interface IButtonProps {
  type: 'kakao' | 'naver';
  onPress: () => void;
}

interface IStyleProps {
  backgroundColor: string;
}

interface ITextProps {
  color: string;
}

const ButtonContainer = styled(TouchableOpacity)<IStyleProps>`
  background-color: ${(props: IStyleProps) => props.backgroundColor};
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
`;

const ButtonIcon = styled.Image`
  width: 24px;
  height: 24px;
  position: absolute;
  left: 20px;
`;

const ButtonText = styled.Text<ITextProps>`
  font-size: ${theme.fonts.body}px;
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.white};
`;

const socialConfig = {
  kakao: {
    backgroundColor: '#FEE500',
    textColor: theme.colors.gray900,
    text: '카카오 로그인',
    icon: require('../../assets/images/Kakao.png'),
  },
  naver: {
    backgroundColor: '#03C75A',
    textColor: theme.colors.white,
    text: '네이버 로그인',
    icon: require('../../assets/images/Naver.png'),
  },
};

// --- 최종 컴포넌트 ---
const SocialLoginButton = ({ type, onPress }: IButtonProps) => {
  const config = socialConfig[type];

  return (
    <ButtonContainer backgroundColor={config.backgroundColor} onPress={onPress}>
      <ButtonIcon source={config.icon} />
      <ButtonText color={config.textColor}>{config.text}</ButtonText>
    </ButtonContainer>
  );
};

export default SocialLoginButton;
