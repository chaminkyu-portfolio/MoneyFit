import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Image, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import CustomButton from '../../components/common/CustomButton';
import { useGetDailyAnalysis } from '../../hooks/analysis';
import { useOnboardingStore } from '../../store';

interface AIRecommendationResultScreenProps {
  navigation: any;
  route: any;
}

const AIRecommendationResultScreen = ({
  navigation,
  route,
}: AIRecommendationResultScreenProps) => {
  const { completeOnboarding } = useOnboardingStore();
  const [selectedRoutines, setSelectedRoutines] = useState<string[]>([]);

  // 홈 화면에서 온 경우인지 확인
  const isFromHome = route.params?.fromHome;
  console.log('🔍 AIRecommendationResultScreen route.params:', route.params);
  console.log('🔍 isFromHome:', isFromHome);

  // API 데이터 조회
  const { data: dailyAnalysisData, isLoading, error } = useGetDailyAnalysis();

  // 실제 루틴 데이터 변환
  const routines = React.useMemo(() => {
    if (!dailyAnalysisData?.result?.items) {
      return [];
    }

    // API에서 받은 10개 아이템을 루틴 형태로 변환
    return dailyAnalysisData.result.items
      .slice(0, 10)
      .map((item: string, index: number) => ({
        id: (index + 1).toString(),
        title: item,
        icon: '📝', // 기본 아이콘 (나중에 이미지로 교체 예정)
      }));
  }, [dailyAnalysisData]);

  const handleRoutineToggle = (routineId: string) => {
    setSelectedRoutines((prev) =>
      prev.includes(routineId)
        ? prev.filter((id) => id !== routineId)
        : [...prev, routineId],
    );
  };

  const handleComplete = () => {
    // 선택된 루틴들의 정보를 가져오기
    const selectedRoutineData = routines.filter((routine) =>
      selectedRoutines.includes(routine.id),
    );

    // 개인 루틴 생성 화면으로 이동하면서 선택된 루틴 데이터 전달
    navigation.navigate('CreateRoutine', {
      mode: 'create',
      aiSelectedRoutines: selectedRoutineData,
    });
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <Container>
        <Content>
          <LoadingContainer>
            <LoadingText>AI 추천 루틴을 생성하고 있어요...</LoadingText>
          </LoadingContainer>
        </Content>
      </Container>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <Container>
        <Content>
          <ErrorContainer>
            <ErrorText>AI 추천 루틴을 불러오는데 실패했습니다.</ErrorText>
          </ErrorContainer>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        {/* 헤더 섹션 */}
        <HeaderSection>
          <TitleContainer>
            <Title>AI 추천 루틴이 완성됐어요!</Title>
            <Subtitle>
              AI가 지출 패턴을 기반으로 최적의 루틴을 짜봤어요
            </Subtitle>
          </TitleContainer>

          {/* 캐릭터 이미지 */}
          <CharacterImage
            source={require('../../assets/images/coin_pig.png')}
            resizeMode="contain"
          />
        </HeaderSection>

        {/* 루틴 리스트 */}
        <RoutineList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {routines.map((routine) => (
            <RoutineCard key={routine.id}>
              {/* 이미지 공간 (나중에 이미지 추가 예정) */}
              <ImagePlaceholder>
                <ImageText>{routine.icon}</ImageText>
              </ImagePlaceholder>

              <RoutineText>{routine.title}</RoutineText>
              <CheckButton
                onPress={() => handleRoutineToggle(routine.id)}
                isSelected={selectedRoutines.includes(routine.id)}
              >
                <MaterialIcons
                  name={
                    selectedRoutines.includes(routine.id)
                      ? 'check-circle'
                      : 'radio-button-unchecked'
                  }
                  size={24}
                  color={
                    selectedRoutines.includes(routine.id)
                      ? theme.colors.primary
                      : theme.colors.gray300
                  }
                />
              </CheckButton>
            </RoutineCard>
          ))}
        </RoutineList>
      </Content>

      {/* 하단 버튼 */}
      <ButtonWrapper>
        <ButtonColumn>
          <CustomButton
            text={isFromHome ? '돌아가기' : '건너뛰기'}
            onPress={
              isFromHome
                ? () => {
                    console.log('🔍 돌아가기 버튼 클릭됨');
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Home' }],
                    });
                  }
                : completeOnboarding
            }
            backgroundColor={theme.colors.white}
            textColor={theme.colors.gray600}
            borderColor={theme.colors.gray300}
            borderWidth={1}
          />
          <CustomButton
            text={`${selectedRoutines.length}개 선택 완료`}
            onPress={handleComplete}
            backgroundColor={theme.colors.primary}
            textColor={theme.colors.white}
          />
        </ButtonColumn>
      </ButtonWrapper>
    </Container>
  );
};

export default AIRecommendationResultScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  flex: 1;
  padding: 60px 24px 0 24px;
`;

const HeaderSection = styled.View`
  align-items: flex-start;
  /* margin-bottom: 16px; */
`;

const TitleContainer = styled.View`
  align-items: flex-start;
  margin-bottom: 24px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: 600;
  color: black;
  text-align: left;
  line-height: 30px;
  margin-bottom: 8px;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: #98989e;
  text-align: left;
  line-height: 24px;
`;

const CharacterImage = styled(Image)`
  width: 120px;
  height: 120px;
  align-self: flex-start;
  opacity: 0.3;
`;

const RoutineList = styled.ScrollView`
  flex: 1;
`;

const RoutineCard = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.gray50};
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 12px;
  /* border: 1px solid ${theme.colors.gray200}; */
`;

const RoutineText = styled.Text`
  flex: 1;
  font-size: 15px;
  font-weight: 400;
  color: #3f3f42;
`;

const CheckButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  padding: 4px;
`;

const ButtonWrapper = styled.View`
  padding: 24px;
`;

const ButtonColumn = styled.View`
  flex-direction: column;
  gap: 12px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LoadingText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.gray600};
  text-align: center;
`;

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ErrorText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.error};
  text-align: center;
`;

const ImagePlaceholder = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${theme.colors.gray100};
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

const ImageText = styled.Text`
  font-size: 20px;
`;
