import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';

interface RoutineItemProps {
  icon: string;
  title: string;
  duration: string;
}

const RoutineItem = ({ icon, title, duration }: RoutineItemProps) => {
  return (
    <Container>
      <IconContainer>
        <IconText>{icon}</IconText>
      </IconContainer>
      <ContentContainer>
        <Title>{title}</Title>
      </ContentContainer>
      <DurationContainer>
        <DurationText>{duration}</DurationText>
      </DurationContainer>
    </Container>
  );
};

export default RoutineItem;

const Container = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  padding: 16px;
  flex-direction: row;
  align-items: center;
`;

const IconContainer = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${theme.colors.gray100};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const IconText = styled.Text`
  font-size: 20px;
`;

const ContentContainer = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.gray800};
`;

const DurationContainer = styled.View`
  align-items: flex-end;
`;

const DurationText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
`;
