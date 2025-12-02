import React from 'react';
import styled from 'styled-components/native';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../../styles/theme';

/**
 * AchievementCard의 props 인터페이스
 */
interface IAchievementCardProps {
  /** 성취 제목 (예: "최대 연속") */
  title: string;
  /** 성취 수치 (예: "6일 달성") */
  achievement: string;
  /** 루틴 이름 (예: "아침루틴") */
  routineName: string;
  /** 포인트 */
  points: number;
  /** 진행률 (0-100) */
  progress: number;
  /** 남은 일수 */
  daysLeft: number;
  /** 포인트 아이콘 색상 */
  pointIconColor?: string;
}

/**
 * 성취 카드 컴포넌트
 * @param props - 컴포넌트 props
 * @returns 성취 카드 컴포넌트
 */
const AchievementCard = ({
  title,
  achievement,
  routineName,
  points,
  progress,
  daysLeft,
  pointIconColor = '#FFD700',
}: IAchievementCardProps) => {
  return (
    <Container>
      <TopSection>
        <LeftSection>
          <TitleText>{title}</TitleText>
          <AchievementText>{achievement}</AchievementText>
          <RoutineName>{routineName}</RoutineName>
        </LeftSection>
        <RightSection>
          <PointIconContainer>
            <PointImage source={require('../../../assets/images/point.png')} />
          </PointIconContainer>
          <PointText>+100 p</PointText>
        </RightSection>
      </TopSection>
      <BottomSection>
        <ProgressContainer>
          <ProgressBar>
            <ProgressFill progress={progress} />
            <ProgressText>{daysLeft}일 남음</ProgressText>
          </ProgressBar>
        </ProgressContainer>
      </BottomSection>
    </Container>
  );
};

export default AchievementCard;

const Container = styled.View`
  padding: 24px 24px 0 24px;
  background-color: ${theme.colors.white};
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid ${theme.colors.gray200};
`;

const TopSection = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const LeftSection = styled.View`
  flex: 1;
`;

const BottomSection = styled.View`
  width: 100%;
`;

const TitleText = styled.Text`
  font-size: 24px;
  font-family: ${theme.fonts.Light};
  color: ${theme.colors.gray600};
  margin-bottom: 4px;
`;

const AchievementText = styled.Text`
  font-size: 24px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.primary};
  margin-bottom: 8px;
`;

const RoutineName = styled.Text`
  font-size: 12px;
  font-family: ${theme.fonts.Light};
  color: ${theme.colors.gray600};
  margin-bottom: 16px;
`;

const ProgressContainer = styled.View`
  width: 100%;
  padding-bottom: 24px;
`;

const ProgressBar = styled.View`
  height: 16px;
  background-color: ${theme.colors.gray200};
  border-radius: 8px;
  position: relative;
  overflow: hidden;
`;

const ProgressFill = styled.View<{ progress: number }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${(props) => props.progress}%;
  background-color: ${theme.colors.primary};
  border-radius: 8px;
`;

const ProgressText = styled.Text`
  position: absolute;
  top: 0;
  right: 8px;
  font-size: 12px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.white};
  line-height: 16px;
`;

const RightSection = styled.View`
  align-items: center;
  margin-left: 16px;
  background-color: ${theme.colors.white};
`;

const PointIconContainer = styled.View`
  width: 60px;
  height: 60px;
  border-radius: 24px;
  background-color: ${theme.colors.white};
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
`;

const PointImage = styled(Image)`
  width: 60px;
  height: 60px;
`;

const PointText = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.SemiBold};
  color: #ffd700;
`;
