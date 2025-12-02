import React from 'react';
import styled from 'styled-components/native';
import { Image, type ImageSourcePropType } from 'react-native';
import { theme } from '../../../styles/theme';

interface IGroupRoutineCardProps {
  onPress: () => void;
  iconSource?: ImageSourcePropType;
}

const GroupRoutineCard = ({ onPress, iconSource }: IGroupRoutineCardProps) => {
  return (
    <Container onPress={onPress}>
      <TextWrapper>
        <Title>함께 도전할</Title>
        <Subtitle>루틴 그룹</Subtitle>
      </TextWrapper>
      {iconSource ? (
        <RightIcon source={iconSource} resizeMode="contain" />
      ) : null}
    </Container>
  );
};

export default GroupRoutineCard;

const Container = styled.TouchableOpacity`
  background-color: #c2d2ff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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
