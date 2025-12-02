import React from 'react';
import styled from 'styled-components/native';
import { Image, type ImageSourcePropType } from 'react-native';
import { theme } from '../../../styles/theme';

interface RankBoardCardProps {
  onPress: () => void;
  iconSource?: ImageSourcePropType;
}

const RankBoardCard = ({ onPress, iconSource }: RankBoardCardProps) => {
  return (
    <Container onPress={onPress}>
      <TextWrapper>
        <Title>실시간</Title>
        <Subtitle>랭킹</Subtitle>
      </TextWrapper>
      {iconSource ? (
        <RightIcon source={iconSource} resizeMode="contain" />
      ) : null}
    </Container>
  );
};

export default RankBoardCard;

const Container = styled.TouchableOpacity`
  background-color: #ffe6b3;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const TextWrapper = styled.View``;

const Title = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${theme.colors.white};
  margin-bottom: 4px;
`;

const Subtitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${theme.colors.white};
`;

const RightIcon = styled(Image)`
  width: 64px;
  height: 64px;
`;
