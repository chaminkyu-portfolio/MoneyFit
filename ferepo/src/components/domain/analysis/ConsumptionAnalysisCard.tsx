import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../../styles/theme';

/**
 * ConsumptionAnalysisCard의 props 인터페이스
 */
interface IConsumptionAnalysisCardProps {
  /** 로봇 이미지 소스 */
  robotImageSource: any;
  /** 카드 제목 */
  title: string;
  /** 카드 부제목 */
  subtitle: string;
  /** 클릭 핸들러 */
  onPress?: () => void;
}

/**
 * 소비패턴 분석 카드 컴포넌트
 * @param props - 컴포넌트 props
 * @returns 소비패턴 분석 카드 컴포넌트
 */
const ConsumptionAnalysisCard = ({
  robotImageSource,
  title,
  subtitle,
  onPress,
}: IConsumptionAnalysisCardProps) => {
  return (
    <Container onPress={onPress} disabled={!onPress}>
      <LeftSection>
        <RobotIconContainer>
          <RobotImage source={robotImageSource} />
        </RobotIconContainer>
        <TextSection>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </TextSection>
      </LeftSection>
      <RightSection>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.colors.gray500}
        />
      </RightSection>
    </Container>
  );
};

export default ConsumptionAnalysisCard;

const Container = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: #f2f6ff;
  border-radius: 12px;
  margin-bottom: 16px;
`;

const LeftSection = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const RobotIconContainer = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: #f2f6ff;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
`;

const RobotImage = styled(Image)`
  width: 32px;
  height: 32px;
`;

const TextSection = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  font-size: 16px;
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.primary};
  margin-bottom: 4px;
`;

const Subtitle = styled.Text`
  font-size: 12px;
  font-family: ${theme.fonts.Light};
  color: ${theme.colors.gray500};
  line-height: 16px;
`;

const RightSection = styled.View`
  margin-left: 16px;
`;
