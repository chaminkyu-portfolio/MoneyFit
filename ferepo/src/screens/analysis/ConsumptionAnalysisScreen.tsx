import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  Image,
  ImageSourcePropType,
  BackHandler,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import Header from '../../components/common/Header';
import { theme } from '../../styles/theme';
import {
  useCategoryAnalysis,
  useWeeklySpendingAnalysis,
} from '../../hooks/analysis';
import { CategorySpendingItem } from '../../types/api';

// 카테고리별 아이콘 이미지
const iconService = require('../../assets/images/category/service.png');
const iconEducation = require('../../assets/images/category/education.png');
const iconRestaurant = require('../../assets/images/category/restaurant.png');
const iconShopping = require('../../assets/images/category/shopping.png');
const iconBeauty = require('../../assets/images/category/beauty.png');
const iconTransportation = require('../../assets/images/category/transportation.png');
const iconOthers = require('../../assets/images/category/others.png');
const aiIcon = require('../../assets/images/robot.png');

type CategoryItem = {
  id: string;
  label: string;
  ratio: number;
  amount: number;
  color: string;
  icon: ImageSourcePropType;
};

const formatWon = (n: number) => `${n.toLocaleString()}원`;

const ConsumptionAnalysisScreen = ({ navigation }: any) => {
  // API 데이터 가져오기
  const { data: categoryData, isLoading, error } = useCategoryAnalysis();
  const {
    data: weeklyData,
    isLoading: isLoadingWeekly,
    error: weeklyError,
  } = useWeeklySpendingAnalysis();

  // 디버깅을 위한 로그 추가
  console.log('🔍 ConsumptionAnalysisScreen API 상태:', {
    isLoading,
    isLoadingWeekly,
    error: error?.message,
    weeklyError: weeklyError?.message,
    categoryData: categoryData?.result ? '있음' : '없음',
    weeklyData: weeklyData?.result ? '있음' : '없음',
  });

  // 하드웨어 백 버튼 처리
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // 이전 화면으로 이동
        navigation.goBack();
        return true; // 이벤트 소비
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [navigation]),
  );

  // API 데이터로 카테고리 데이터 생성
  const categories: CategoryItem[] = React.useMemo(() => {
    if (!categoryData?.result) {
      return [];
    }

    const { categorySpendings } = categoryData.result;

    // 카테고리별 아이콘 매칭 함수
    const getCategoryIcon = (categoryName: string) => {
      switch (categoryName) {
        case '서비스':
          return iconService;
        case '교육':
          return iconEducation;
        case '외식':
          return iconRestaurant;
        case '쇼핑':
          return iconShopping;
        case '미용':
          return iconBeauty;
        case '교통':
          return iconTransportation;
        default:
          return iconOthers;
      }
    };

    // 상위 3개 카테고리
    const top3Categories = categorySpendings.slice(0, 3).map((item, index) => ({
      id: `category-${index}`,
      label: item.categoryName,
      ratio: item.percentage,
      amount: item.amount,
      color: ['#F7D3D3', '#FFE4B5', '#D3D8FF'][index] || '#E6E6E8',
      icon: getCategoryIcon(item.categoryName),
    }));

    // 그 외 4개 카테고리 계산
    const top3TotalAmount = top3Categories.reduce(
      (sum, item) => sum + item.amount,
      0,
    );
    const remainingAmount =
      categoryData.result.myTotalSpending - top3TotalAmount;
    const remainingPercentage =
      (remainingAmount / categoryData.result.myTotalSpending) * 100;

    top3Categories.push({
      id: 'others',
      label: '그 외 3개 항목',
      ratio: Math.max(0, remainingPercentage),
      amount: Math.max(0, remainingAmount),
      color: '#E6E6E8',
      icon: iconOthers,
    });

    return top3Categories;
  }, [categoryData]);

  const goFinancial = () => {
    navigation.replace('Loading', {
      title: '맞춤 금융 상품 찾는중...',
      description: 'AI가 내게 잘 맞는 상품을 찾고 있어요',
      statusItems: [
        { text: '소비 내역 확인..', status: 'pending' },
        { text: '소비 패턴 분석...', status: 'pending' },
        { text: '금융 상품 매칭...', status: 'pending' },
        { text: '추천 결과 생성...', status: 'pending' },
      ],
      nextScreen: 'FinancialProduct',
    });
  };

  const goRoutine = () => {
    console.log('🔍 소비패턴 분석 화면에서 루틴 추천 버튼 클릭');
    console.log('🔍 백엔드 데이터 전체:', {
      categoryData: JSON.stringify(categoryData, null, 2),
      weeklyData: JSON.stringify(weeklyData, null, 2),
    });

    navigation.replace('Loading', {
      title: 'AI 루틴 추천 중...',
      description: '당신에게 맞는 최적의 루틴을 찾고 있어요',
      statusItems: [
        { text: '루틴 패턴 분석...', status: 'pending' },
        { text: '개인 맞춤 추천...', status: 'pending' },
        { text: '최적화된 루틴 생성...', status: 'pending' },
      ],
      nextScreen: 'RoutineSuggestion',
    });
  };

  return (
    <Container edges={['top', 'left', 'right']}>
      <Header
        title="이번 주 소비패턴 분석"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 로딩 상태 */}
        {isLoading && (
          <Card>
            <LoadingText>소비패턴 분석 중...</LoadingText>
          </Card>
        )}

        {/* 에러 상태 */}
        {error && (
          <Card>
            <ErrorText>소비패턴 분석을 불러오는데 실패했습니다.</ErrorText>
          </Card>
        )}

        {/* 주간 분석 에러 상태 */}
        {weeklyError && (
          <Card>
            <ErrorText>AI 소비패턴 분석을 불러오는데 실패했습니다.</ErrorText>
          </Card>
        )}

        {/* 데이터가 있을 때만 렌더링 */}
        {!isLoading && !error && categoryData?.result && (
          <>
            {/* 지표 카드 */}
            <Card>
              <Row>
                <Muted>20대 평균</Muted>
                <Strong>
                  {formatWon(categoryData?.result?.averageSpendingFor20s || 0)}
                </Strong>
              </Row>
              <RowSpaced>
                <MutedSmall>내 지출</MutedSmall>
                <StrongMutedSmall>
                  {formatWon(categoryData?.result?.myTotalSpending || 0)}
                </StrongMutedSmall>
              </RowSpaced>

              <ProgressWrap>
                <ProgressBg />
                <ProgressFill
                  style={{
                    width: `${Math.min(((categoryData?.result?.myTotalSpending || 0) / (categoryData?.result?.averageSpendingFor20s || 1)) * 100, 100)}%`,
                  }}
                />
              </ProgressWrap>
              <Hint>
                {categoryData?.result?.comparisonPercentage > 0
                  ? `평균보다 ${categoryData.result.comparisonPercentage.toFixed(1)}% 높음`
                  : categoryData?.result?.comparisonPercentage < 0
                    ? `평균보다 ${Math.abs(categoryData.result.comparisonPercentage).toFixed(1)}% 낮음`
                    : '평균과 동일'}
              </Hint>
            </Card>

            {/* 카테고리 리스트 */}
            <Card>
              {categories.map((c, idx) => (
                <CategoryRow key={c.id} isLast={idx === categories.length - 1}>
                  <IconBox>
                    <CategoryImg source={c.icon} resizeMode="contain" />
                  </IconBox>
                  <ColLeft>
                    <Label>{c.label}</Label>
                    <SubLabel>{c.ratio.toFixed(1)}%</SubLabel>
                  </ColLeft>
                  <Amount>{formatWon(c.amount)}</Amount>
                </CategoryRow>
              ))}
            </Card>

            {/* AI 분석 카드 */}
            <AICard>
              <AIHeader>
                <AIIcon>
                  <AIImg source={aiIcon} resizeMode="contain" />
                </AIIcon>
                <AITitle>AI 소비패턴 분석</AITitle>
              </AIHeader>

              {!isLoadingWeekly &&
              !weeklyError &&
              weeklyData?.result &&
              weeklyData.result.length > 0 ? (
                weeklyData.result.map((text, index) => (
                  <AIItem key={index}>
                    <Check>
                      <CheckSquare>
                        <Ionicons
                          name="checkmark"
                          size={12}
                          color={theme.colors.white}
                        />
                      </CheckSquare>
                    </Check>
                    <AIText>{text}</AIText>
                  </AIItem>
                ))
              ) : (
                <AIItem>
                  <AIText style={{ color: theme.colors.gray500 }}>
                    {isLoadingWeekly
                      ? 'AI 분석 중...'
                      : weeklyError
                        ? 'AI 분석을 불러오는데 실패했습니다.'
                        : 'AI 분석 결과를 불러올 수 없습니다.'}
                  </AIText>
                </AIItem>
              )}

              <ButtonRow>
                <GhostButton onPress={goFinancial}>
                  <GhostContent>
                    <GhostIcon name="card-outline" size={16} />
                    <GhostText>맞춤 금융 상품 추천</GhostText>
                  </GhostContent>
                </GhostButton>
                <GhostButton onPress={goRoutine}>
                  <GhostContent>
                    <GhostIcon name="sparkles-outline" size={16} />
                    <GhostText>루틴 추천</GhostText>
                  </GhostContent>
                </GhostButton>
              </ButtonRow>
            </AICard>
          </>
        )}
      </ScrollView>
    </Container>
  );
};

export default ConsumptionAnalysisScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Card = styled.View`
  margin: 12px 16px 0 16px;
  padding: 16px;
  background-color: ${theme.colors.gray50};
  border-radius: 16px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const RowSpaced = styled(Row)`
  margin-top: 6px;
`;

const Muted = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: ${theme.fonts.body}px;
  color: ${theme.colors.gray700};
`;

const MutedSmall = styled(Muted)`
  font-size: ${theme.fonts.body - 2}px;
`;

const Strong = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray900};
  font-size: ${theme.fonts.body}px;
`;

const StrongMuted = styled(Strong)`
  color: ${theme.colors.gray600};
`;

const StrongMutedSmall = styled(StrongMuted)`
  font-size: ${theme.fonts.body - 2}px;
`;

const ProgressWrap = styled.View`
  position: relative;
  margin: 12px 0 6px 0;
  height: 10px;
`;

const ProgressBg = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: ${theme.colors.gray200};
  border-radius: 999px;
`;

const ProgressFill = styled.View`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: ${theme.colors.primary};
  border-radius: 999px;
`;

const Hint = styled.Text`
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  margin-top: 4px;
`;

const CategoryRow = styled.View<{ isLast: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 12px 4px;
  border-bottom-width: ${(p) => (p.isLast ? 0 : 1)}px;
  border-bottom-color: ${theme.colors.gray200};
`;

const IconBox = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const CategoryImg = styled(Image)`
  width: 32px;
  height: 32px;
`;

const ColLeft = styled.View`
  flex: 1;
`;

const Label = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray900};
`;

const SubLabel = styled.Text`
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
`;

const Amount = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray900};
`;

const AICard = styled(Card)`
  background-color: ${theme.colors.gray50};
`;

const AIHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const AIIcon = styled.View`
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  background-color: transparent;
`;

const AIImg = styled(Image)`
  width: 28px;
  height: 28px;
`;

const AITitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray900};
`;

const AIItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 8px 0;
`;

const Check = styled.View`
  margin-right: 8px;
`;

const CheckSquare = styled.View`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background-color: ${theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

const AIText = styled.Text`
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray700};
  flex: 1;
  font-size: 12px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 10px;
  margin-top: 8px;
`;

const GhostButton = styled.TouchableOpacity`
  flex: 1;
  padding: 12px;
  background-color: ${theme.colors.white};
  border-radius: 20px;
  align-items: center;
  border-width: 1px;
  border-color: ${theme.colors.primary};
`;

const GhostContent = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const LoadingText = styled.Text`
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray600};
  text-align: center;
  padding: 20px;
`;

const ErrorText = styled.Text`
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.error};
  text-align: center;
  padding: 20px;
`;

const GhostIcon = styled(Ionicons)`
  color: ${theme.colors.primary};
`;

const GhostText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.primary};
`;
