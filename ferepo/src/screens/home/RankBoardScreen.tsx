import React, { useMemo, useState } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native';

import Header from '../../components/common/Header';
import { theme } from '../../styles/theme';
import { useUserStore } from '../../store';
import { useGetRanking } from '../../hooks/ranking/useRankList';

// 나이대별 점수 관리 유틸리티 함수
const getAgeGroup = (age: number): string => {
  const ageGroup = Math.floor(age / 10) * 10;
  return `${ageGroup}대`;
};

const updateAgeGroupScore = (age: number, points: number) => {
  const ageGroup = getAgeGroup(age);
  // TODO: 해당 나이대 그룹의 점수를 서버에 업데이트
  console.log(`${ageGroup}에 ${points}점 추가`);
};

// 화면 표시용 아이템 타입 (API 응답 매핑 후 사용)
interface UiRankItem {
  id: string;
  name: string;
  score: number;
  rank: number;
}

const RankBoardScreen = ({ navigation }: any) => {
  const { userInfo } = useUserStore();
  
  // 나이대별 랭킹 데이터 조회
  const { data: ageGroupRankingData, isLoading, error } = useGetRanking();
  
  // 디버깅: API 응답 데이터 확인
  console.log('🔍 랭킹 API 응답:', {
    ageGroupRankingData,
    isLoading,
    error,
    items: ageGroupRankingData?.result?.items,
  });

  // 나이대별 랭킹 데이터 변환
  const userRankData = useMemo<UiRankItem[]>(() => {
    // CORS 에러로 인해 임시로 더미 데이터 사용
    if (error) {
      console.log('CORS 에러로 인해 더미 데이터 사용');
      return [
        { id: 'age-20대', name: '20대', score: 0, rank: 1 },
        { id: 'age-30대', name: '30대', score: 0, rank: 1 },
        { id: 'age-10대', name: '10대', score: 0, rank: 1 },
        { id: 'age-40대', name: '40대', score: 0, rank: 1 },
      ];
    }

    if (!ageGroupRankingData?.result?.items) {
      return [];
    }

    const transformedData = ageGroupRankingData.result.items
      .map((item) => ({
        id: `age-${item.name}`,
        name: `${item.name}대`, // "20대", "30대" 등으로 표시
        score: item.score, // 실제 점수 사용
        rank: item.rank,
      }))
      .sort((a, b) => a.rank - b.rank); // 랭크 순으로 정렬
    
    console.log('🔍 변환된 랭킹 데이터:', transformedData);
    return transformedData;
  }, [ageGroupRankingData, error]);

  const listData = userRankData;

  // 고정 제목과 부제목
  const top3TitleText = '🏆 TOP 3 소비 플래너';
  const top3SubTitleText = '이번 주 최고의 성과를 달성한 나이대의 갓생 소비러는?';
  return (
    <Container edges={['top', 'left', 'right']}>
      <Header title="실시간 랭킹" onBackPress={() => navigation.goBack()} />
      <Content>
        <Top3Container>
          <Top3Title>{top3TitleText}</Top3Title>
          <Top3SubTitle>{top3SubTitleText}</Top3SubTitle>
          <Top3Row>
            {/* 2위 */}
            {listData[1] && (
              <TopItem style={{ marginTop: 8 }}>
                <LogoWrapper size={64} variant="silver">
                  <LogoImage
                    source={require('../../assets/images/default_profile.png')}
                  />
                  <RankBadge variant="silver">
                    <RankBadgeText>2</RankBadgeText>
                  </RankBadge>
                </LogoWrapper>
                <SchoolName numberOfLines={1}>{listData[1].name}</SchoolName>
                <ScoreBadge variant="silver">
                  <ScoreText>{listData[1].score}점</ScoreText>
                </ScoreBadge>
              </TopItem>
            )}

            {/* 1위 (중앙 강조) */}
            {listData[0] && (
              <TopItem style={{ marginHorizontal: 12, marginTop: -6 }}>
                <LogoWrapper size={88} variant="gold">
                  <LogoImage
                    source={require('../../assets/images/default_profile.png')}
                  />
                  <RankBadge variant="gold">
                    <RankBadgeText>1</RankBadgeText>
                  </RankBadge>
                </LogoWrapper>
                <SchoolName numberOfLines={1}>{listData[0].name}</SchoolName>
                <ScoreBadge variant="gold">
                  <ScoreText>{listData[0].score}점</ScoreText>
                </ScoreBadge>
              </TopItem>
            )}

            {/* 3위 */}
            {listData[2] && (
              <TopItem style={{ marginTop: 8 }}>
                <LogoWrapper size={64} variant="bronze">
                  <LogoImage
                    source={require('../../assets/images/default_profile.png')}
                  />
                  <RankBadge variant="bronze">
                    <RankBadgeText>3</RankBadgeText>
                  </RankBadge>
                </LogoWrapper>
                <SchoolName numberOfLines={1}>{listData[2].name}</SchoolName>
                <ScoreBadge variant="bronze">
                  <ScoreText>{listData[2].score}점</ScoreText>
                </ScoreBadge>
              </TopItem>
            )}
          </Top3Row>
        </Top3Container>
        <FlatList
          data={listData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Row>
              <Rank>{item.rank}</Rank>
              <Name>{item.name}</Name>
              <Points>{item.score} P</Points>
            </Row>
          )}
          ItemSeparatorComponent={() => <Separator />}
          ListEmptyComponent={() => (
            <EmptyText>
              {isLoading ? '랭킹 데이터를 불러오는 중...' : 
               error ? '랭킹 데이터를 불러올 수 없습니다.' : 
               '아직 랭킹 데이터가 없어요.'}
            </EmptyText>
          )}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      </Content>
    </Container>
  );
};

export default RankBoardScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  flex: 1;
  padding: 16px 24px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 8px;
`;

const Rank = styled.Text`
  width: 36px;
  text-align: center;
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${theme.colors.gray800};
`;

const Name = styled.Text`
  flex: 1;
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.gray800};
`;

const Points = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${theme.colors.primary};
`;

const Separator = styled.View`
  height: 1px;
  background-color: ${theme.colors.gray200};
`;

const EmptyText = styled.Text`
  text-align: center;
  padding: 24px 0;
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray500};
`;

// TOP3 섹션 스타일
const Top3Container = styled.View`
  padding: 12px 0 8px 0;
`;

const Top3Title = styled.Text`
  text-align: center;
  font-family: ${theme.fonts.SemiBold};
  font-size: 18px;
  color: ${theme.colors.gray800};
`;

const Top3SubTitle = styled.Text`
  text-align: center;
  margin-top: 4px;
  margin-bottom: 12px;
  font-family: ${theme.fonts.Regular};
  font-size: 12px;
  color: ${theme.colors.gray600};
`;

const Top3Row = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const TopItem = styled.View`
  flex: 1;
  align-items: center;
`;

const LogoWrapper = styled.View<{
  size: number;
  variant: 'gold' | 'silver' | 'bronze';
}>`
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  border-radius: ${(p) => p.size / 2}px;
  overflow: visible;
  align-items: center;
  justify-content: center;
  border-width: 3px;
  border-color: ${(p) =>
    p.variant === 'gold'
      ? '#F4C542'
      : p.variant === 'silver'
        ? '#C0C4CC'
        : '#D88C4E'};
  background-color: ${theme.colors.gray100};
`;

const LogoImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 9999px;
`;

const RankBadge = styled.View<{ variant: 'gold' | 'silver' | 'bronze' }>`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 26px;
  height: 26px;
  border-radius: 13px;
  align-items: center;
  justify-content: center;
  background-color: ${(p) =>
    p.variant === 'gold'
      ? '#F4C542'
      : p.variant === 'silver'
        ? '#C0C4CC'
        : '#D88C4E'};
  border-width: 2px;
  border-color: ${theme.colors.white};
  z-index: 10;
`;

const RankBadgeText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 12px;
  color: ${theme.colors.white};
`;

const SchoolName = styled.Text`
  margin-top: 8px;
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.gray800};
`;

const ScoreBadge = styled.View<{ variant: 'gold' | 'silver' | 'bronze' }>`
  margin-top: 6px;
  padding: 6px 10px;
  border-radius: 18px;
  background-color: ${(p) =>
    p.variant === 'gold'
      ? '#F4C542'
      : p.variant === 'silver'
        ? '#69707A'
        : '#F97316'};
`;

const ScoreText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 12px;
  color: ${theme.colors.white};
`;
