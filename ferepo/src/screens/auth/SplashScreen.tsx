import React, { ReactNode } from 'react';
import { SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../styles/theme';
interface IProps {
  children: ReactNode;
}

const GradientContainer = ({ children }: IProps) => {
  return (
    <LinearGradient
      colors={[theme.colors.landing.start, theme.colors.landing.end]}
      style={{ flex: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

const Wrapper = styled(SafeAreaView)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const TopContent = styled.View`
  flex: 2;
  align-items: center;
  justify-content: flex-end;
`;

const MiddleContent = styled.View`
  flex: 3;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const BottomContent = styled.View`
  flex: 2;
  align-items: center;
  justify-content: center;
`;

const SubTitle = styled.Text`
  font-size: ${theme.fonts.subtitle}px;
  font-weight: 600;
  line-height: 28px;
  letter-spacing: 0.1px;
  word-wrap: break-word;
  color: ${theme.colors.white};
`;

const Title = styled.Text`
  font-size: 40px;
  font-family: ${theme.fonts.SchoolsafeBold};
  color: #ffffff;
`;

const CharacterImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const LogoImage = styled.Image`
  width: 120px;
  height: 40px;
`;

const SplashScreen = () => {
  return (
    <GradientContainer>
      <Wrapper>
        <TopContent>
          <SubTitle>소비 습관 플래너</SubTitle>
          <Title>머니핏</Title>
        </TopContent>

        <MiddleContent>
          <CharacterImage
            source={require('../../assets/images/home_pig.png')}
            resizeMode="contain"
          />
        </MiddleContent>

      </Wrapper>
    </GradientContainer>
  );
};

export default SplashScreen;
