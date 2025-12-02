import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import BubbleCard from '../../components/domain/analysis/BubbleCard';
import FinancialProductCard from '../../components/domain/analysis/FinancialProductCard';
import { useCategoryAnalysis, useRecommendProduct } from '../../hooks/analysis';

interface FinancialProductScreenProps {
  navigation: any;
}

const FinancialProductScreen = ({
  navigation,
}: FinancialProductScreenProps) => {
  // 소비패턴 분석 데이터 가져오기
  const { data: categoryData } = useCategoryAnalysis();

  // 금융 상품 추천 데이터 가져오기
  const { data: productData, isLoading, error } = useRecommendProduct();

  // 디버깅용 로그
  console.log('productData:', JSON.stringify(productData, null, 2));

  // 상위 2개 카테고리 추출
  const top2Categories = React.useMemo(() => {
    if (!categoryData?.result?.categorySpendings) {
      return [];
    }
    return categoryData.result.categorySpendings.slice(0, 2);
  }, [categoryData]);

  // 하드웨어 백 버튼 처리
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // 소비패턴 분석 화면으로 replace로 이동
        navigation.replace('ConsumptionAnalysis');
        return true; // 이벤트 소비
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [navigation]),
  );

  const handleBack = () => {
    navigation.replace('ConsumptionAnalysis');
  };

  return (
    <Container edges={['top', 'left', 'right', 'bottom']}>
      <Header title="맞춤 금융 상품 추천" onBackPress={handleBack} />

      {/* 👇 이제 이 Content 영역은 스크롤이 가능합니다. */}
      <Content>
        <BotMessageSection>
          <BubbleCard
            robotImageSource={require('../../assets/images/robot.png')}
            direction="top"
            content={
              <>
                사용자 님은{' '}
                {top2Categories.length > 0 && (
                  <>
                    <HighlightText>
                      {top2Categories[0].categoryName}
                    </HighlightText>
                    {top2Categories.length > 1 && (
                      <>
                        와{' '}
                        <HighlightText>
                          {top2Categories[1].categoryName}
                        </HighlightText>
                      </>
                    )}
                  </>
                )}
                의 소비가 많아요!
                {'\n'}그래서 아래 상품을 추천드려요.
              </>
            }
          />
        </BotMessageSection>

        <ProductSection showsVerticalScrollIndicator={false}>
          {isLoading && <LoadingText>금융 상품을 불러오는 중...</LoadingText>}

          {error && <ErrorText>금융 상품을 불러오는데 실패했습니다.</ErrorText>}

          {productData?.result?.map((product, index) => (
            <FinancialProductCard
              key={index}
              title={product.accountTypeName}
              features={[product.accountDescription]}
              interestRate={`${product.interestRate}%`}
              hashtags={[`#${product.accountTypeName}`]}
            />
          ))}
        </ProductSection>
      </Content>
    </Container>
  );
};

export default FinancialProductScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  flex: 1;
  padding: 0 24px;
  flex-direction: column;
`;

const BotMessageSection = styled.View`
  align-items: center;
  justify-content: flex-start;
`;

const HighlightText = styled.Text`
  color: ${theme.colors.primary};
  font-family: ${theme.fonts.Bold};
`;

const ProductSection = styled.ScrollView`
  gap: 16px;
  /* margin-top: 24px; */
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
