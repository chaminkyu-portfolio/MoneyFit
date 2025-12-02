import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components/native';
import LottieView from 'lottie-react-native';

import { theme } from '../../styles/theme';
import CustomButton from '../../components/common/CustomButton';
import SuccessIcon from '../../components/common/SuccessIcon';
import { useRoutineStore } from '../../store';
import { useQueryClient } from '@tanstack/react-query';

interface IResultScreenProps {
  type: 'success' | 'failure' | 'celebration';
  title: string;
  description: string;
  points?: number;
  lottieSource?: any;
  nextScreen?: string;
  onSuccess?: () => void;
}

const ResultScreen = ({ navigation, route }: any) => {
  const { setEditMode } = useRoutineStore();
  const queryClient = useQueryClient();
  const {
    type = 'celebration',
    title = '등록 성공',
    description = '계좌 등록을 성공적으로 완료했어요',
    points,
    lottieSource,
    nextScreen = 'MyPage',
    onSuccess,
    updatedRoutineData,
  } = route.params || {};

  // 뒤로가기 버튼 차단
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // 뒤로가기 버튼을 완전히 차단
        return true; // 이벤트 소비하여 뒤로가기 동작 방지
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );

  const handleComplete = () => {
    if (onSuccess) {
      onSuccess();
    }

    // 루틴 등록 완료인 경우 홈으로 이동
    if (title === '루틴 등록 완료!') {
      // 온보딩 완료 처리
      const { completeOnboarding } =
        require('../../store').useOnboardingStore.getState();
      completeOnboarding();
      // 로그인 상태로 변경하여 홈 화면으로 이동
      const { setLoggedIn } = require('../../store').useAuthStore.getState();
      setLoggedIn(true);
      return;
    } else if (title === '루틴 생성 완료') {
      // 루틴 생성 완료인 경우 캐시 무효화 후 홈으로 이동
      console.log('🔍 루틴 생성 완료 - 캐시 무효화 실행');
      queryClient.invalidateQueries({ queryKey: ['personalRoutines'] });
      queryClient.invalidateQueries({ queryKey: ['infinitePersonalRoutines'] });
      queryClient.invalidateQueries({ queryKey: ['personalRoutineDetails'] });
      navigation.navigate('HomeMain');
      return;
    } else if (nextScreen === 'PersonalRoutineDetail') {
      // 편집 모드 해제 후 홈으로 이동 (캐시 무효화 포함)
      console.log('🔍 PersonalRoutineDetail 수정 완료 - 홈으로 이동');
      queryClient.invalidateQueries({ queryKey: ['personalRoutines'] });
      queryClient.invalidateQueries({ queryKey: ['infinitePersonalRoutines'] });
      queryClient.invalidateQueries({ queryKey: ['personalRoutineDetails'] });
      setEditMode(false);
      navigation.navigate('HomeMain');
      return;
    } else if (nextScreen === 'HomeMain') {
      // 홈 화면으로 이동하는 경우 캐시 무효화
      console.log('🔍 HomeMain으로 이동 - 캐시 무효화 실행');
      queryClient.invalidateQueries({ queryKey: ['personalRoutines'] });
      queryClient.invalidateQueries({ queryKey: ['infinitePersonalRoutines'] });
      queryClient.invalidateQueries({ queryKey: ['personalRoutineDetails'] });
      navigation.navigate(nextScreen);
      return;
    } else if (nextScreen === 'GroupRoutineDetail') {
      // 단체 루틴 상세로 이동하는 경우 캐시 무효화 후 이동
      console.log('🔍 GroupRoutineDetail로 이동 - 캐시 무효화 실행');
      queryClient.invalidateQueries({ queryKey: ['groupRoutineDetail'] });
      queryClient.invalidateQueries({ queryKey: ['infiniteGroupRoutines'] });

      if (updatedRoutineData?.routineId) {
        navigation.navigate('GroupRoutineDetail', {
          routineId: updatedRoutineData.routineId,
        });
      } else {
        navigation.navigate('HomeMain');
      }
      return;
    } else if (typeof nextScreen === 'string' && nextScreen.length > 0) {
      navigation.navigate(nextScreen);
      return;
    }

    // nextScreen이 없거나 잘못된 경우 안전하게 홈으로 이동
    navigation.navigate('HomeMain');
  };

  const renderIcon = () => {
    switch (type) {
      case 'success':
        return (
          <LottieView
            source={
              lottieSource ||
              require('../../assets/images/animation/success.json')
            }
            autoPlay
            loop={true}
            style={{ width: 120, height: 120 }}
          />
        );
      case 'failure':
        return (
          <LottieView
            source={
              lottieSource ||
              require('../../assets/images/animation/failure.json')
            }
            autoPlay
            loop={true}
            style={{ width: 120, height: 120 }}
          />
        );
      case 'celebration':
      default:
        return <SuccessIcon size={120} />;
    }
  };

  return (
    <Container>
      <CenterContainer>
        <IconContainer>{renderIcon()}</IconContainer>

        <Content>
          <Title>{title}</Title>

          <Description>{description}</Description>

          {points > 0 && <PointsText>+{points}p</PointsText>}
        </Content>
      </CenterContainer>

      <ButtonWrapper>
        <CustomButton
          text="완료"
          onPress={handleComplete}
          backgroundColor={theme.colors.primary}
          textColor={theme.colors.white}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default ResultScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const CenterContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const IconContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const Content = styled.View`
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const Title = styled.Text`
  font-size: ${theme.fonts.title}px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.gray900};
  text-align: center;
  line-height: 34px;
  margin-bottom: 12px;
`;

const Description = styled.Text`
  font-size: ${theme.fonts.body}px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  text-align: center;
  line-height: 24px;
`;

const ButtonWrapper = styled.View`
  padding: 24px;
`;

const PointsText = styled.Text`
  font-size: 24px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.primary};
  margin-top: 8px;
`;
