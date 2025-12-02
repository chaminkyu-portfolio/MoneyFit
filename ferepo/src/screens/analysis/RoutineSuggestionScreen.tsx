import React from 'react';
import styled from 'styled-components/native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { ScrollView, Image, View, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import Header from '../../components/common/Header';
import BubbleCard from '../../components/domain/analysis/BubbleCard';
import { theme } from '../../styles/theme';
import { useRecommendDaily } from '../../hooks/analysis';
import { useRoutineEmojis } from '../../hooks/routine/common/useCommonRoutines';

const robotIcon = require('../../assets/images/robot.png');
const characterImg = require('../../assets/images/phone_pig.png');

const RoutineSuggestionScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();

  // 추천 루틴 데이터 가져오기 (현재 받아오는 데이터 없음 - 나중에 4개만 추가 예정)
  const { data: recommendData, isLoading, error } = useRecommendDaily();
  
  // 이모지 조회 훅 - 모든 이모지를 가져오기 위해 카테고리 필터링 제거
  const { data: emojiData, isLoading: isLoadingEmojis } = useRoutineEmojis({});

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

  return (
    <Container edges={['top', 'left', 'right', 'bottom']}>
      <Header
        title="✨ New 추천 루틴"
        onBackPress={() => navigation.replace('ConsumptionAnalysis')}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* AI 안내 버블 */}
        <BotMessageSection>
          <BubbleCard
            title=""
            content={
              <>
                사용자 님은 <Highlight>충동형 소비자</Highlight>예요!
                {'\n'}
                <Em>식비</Em> 카테고리의 변동이 잦고,{'\n'}
                <EmSecondary>쇼핑</EmSecondary> 카테고리 소비가 불규칙해요.
                {'\n\n'}
                이러한 소비습관을 고치기 위해서는{'\n'}
                아래와 같은 루틴이 도움이 될 수 있어요.
              </>
            }
            direction="top"
            robotImageSource={robotIcon}
          />
        </BotMessageSection>

        {/* 추천 루틴 섹션 */}
        <SectionCard>
          <SectionHeader>
            <Sparkle>✨</Sparkle>
            <SectionTitle>추천 루틴</SectionTitle>
          </SectionHeader>

          {isLoading && <LoadingText>추천 루틴을 불러오는 중...</LoadingText>}

          {error && <ErrorText>추천 루틴을 불러오는데 실패했습니다.</ErrorText>}

          {!isLoading &&
            !error &&
            recommendData?.result?.items?.length === 0 && (
              <EmptyText>추천 루틴이 없습니다.</EmptyText>
            )}

          {recommendData?.result?.items?.map((routine, index) => (
            <RoutineItem key={index}>
              {/* <IconSquare color={index % 2 === 0 ? '#FFE4B5' : '#D3F0E2'}>
                <RemoteSvg
                  uri="https://e207bucket.s3.ap-northeast-2.amazonaws.com/emojis/consumption/%F0%9F%93%8A+%EB%A7%89%EB%8C%80+%EA%B7%B8%EB%9E%98%ED%94%84.svg"
                  debug
                  width={32}
                  height={32}
                />
              </IconSquare> */}
              <RoutineText>{routine}</RoutineText>
            </RoutineItem>
          ))}
        </SectionCard>

        {/* 본문 끝 */}
      </ScrollView>

      <CharacterDecoration>
        <CharacterImage source={characterImg} resizeMode="contain" />
      </CharacterDecoration>

      {/* 화면 오른쪽 하단 고정 CTA */}
      {/* <CTAFloat>
        <CTAButton>
          <CTAContent>
            <CTAIcon name="add-circle-outline" size={18} />
            <CTAText>추천받은 루틴 추가하러 가기</CTAText>
          </CTAContent>
        </CTAButton>
        <CTAButton style={{ marginTop: 10 }}>
          <CTAContent>
            <CTAIcon name="settings-outline" size={18} />
            <CTAText>커스텀 루틴 설정하기</CTAText>
          </CTAContent>
        </CTAButton>
      </CTAFloat> */}
    </Container>
  );
};

export default RoutineSuggestionScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Highlight = styled.Text`
  color: ${theme.colors.primary};
  font-family: ${theme.fonts.SemiBold};
`;

const Em = styled(Highlight)`
  color: #f77f00;
`;

const EmSecondary = styled(Highlight)`
  color: #ff7a7a;
`;

const BotMessageSection = styled.View`
  align-items: center;
  justify-content: flex-start;
`;

const SectionCard = styled.View`
  margin: 4px 16px 0 16px;
  padding: 12px;
  background-color: ${theme.colors.gray50};
  border-radius: 16px;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const Sparkle = styled.Text`
  margin-right: 6px;
  color: #ffc107;
`;

const SectionTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  color: #ffc107;
`;

const RoutineItem = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.white};
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 8px;
`;

const IconSquare = styled.View<{ color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: transparent;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

// const RoutineIcon = styled(RemoteSvg)`
//   width: 32px;
//   height: 32px;
// `;

const RoutineText = styled.Text`
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray900};
`;

const CTAFloat = styled.View`
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 40px;
  align-items: flex-end;
`;

const CTAButton = styled.TouchableOpacity`
  width: 75%;
  padding: 14px;
  background-color: ${theme.colors.gray100};
  border-radius: 12px;
`;

const CTAContent = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  justify-content: center;
`;

const CTAIcon = styled(Ionicons)`
  color: ${theme.colors.primary};
`;

const CTAText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray700};
`;

const CharacterDecoration = styled.View`
  position: absolute;
  left: -80px;
  bottom: 0px;
  width: 300px;
  height: 300px;
  opacity: 0.3;
`;

const CharacterImage = styled(Image)`
  width: 100%;
  height: 100%;
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

const EmptyText = styled.Text`
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray600};
  text-align: center;
  padding: 20px;
`;
