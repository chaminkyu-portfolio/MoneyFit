import React, { useState, useEffect, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { ScrollView } from 'react-native';
import { theme } from '../../styles/theme';
import ProgressCircle from '../../components/common/ProgressCircle';
import RoutineActionButton from '../../components/domain/routine/RoutineActionButton';
import BottomSheetDialog from '../../components/common/BottomSheetDialog';
import { Ionicons } from '@expo/vector-icons';
import { useRoutineStore, useUserStore } from '../../store';
import {
  useDonePersonalRoutine,
  useDonePersonalRoutineList,
} from '../../hooks/routine/personal/usePersonalRoutines';
// 나이대별 점수 업데이트는 백엔드에서 루틴 완료 시 자동으로 처리
import SvgImage from '../../components/common/SvgImage';

const ActiveRoutineScreen = ({ navigation, route }: any) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isPauseModalVisible, setPauseModalVisible] = useState(false);
  const [isCompleteModalVisible, setCompleteModalVisible] = useState(false);
  const [isResumeModalVisible, setResumeModalVisible] = useState(false);
  const [isSkipModalVisible, setSkipModalVisible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { markActiveRoutineTaskCompleted, resetActiveRoutineProgress } =
    useRoutineStore();
  const { userInfo } = useUserStore();
  const { mutate: donePersonalRoutine } = useDonePersonalRoutine();
  const { mutate: donePersonalRoutineList } = useDonePersonalRoutineList();
  // 나이대별 점수 업데이트는 백엔드에서 루틴 완료 시 자동으로 처리

  const incomingTasks = route?.params?.tasks as
    | Array<{
        icon: string;
        title: string;
        duration: string;
        routineId?: number;
      }>
    | undefined;
  const routineName = route?.params?.routineName as string | undefined;
  const routineId = route?.params?.routineId as string | undefined;
  const onTaskComplete = route?.params?.onTaskComplete as
    | ((index: number) => void)
    | undefined;
  const onComplete = route?.params?.onComplete as (() => void) | undefined;

  const tasks = useMemo(() => {
    if (incomingTasks && incomingTasks.length > 0) return incomingTasks;
    return [];
  }, [incomingTasks]);
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);

  useEffect(() => {
    if (tasks.length > 0) {
      const currentTask = tasks[activeTaskIndex];
      const duration = currentTask?.duration || '10분';
      const minutes = parseInt(duration.replace('분', ''));
      const seconds = minutes * 60;
      setTimeLeft(seconds);
      setProgress(0);
    }
  }, [tasks, activeTaskIndex]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          const totalTime = tasks[activeTaskIndex]
            ? parseInt(tasks[activeTaskIndex].duration.replace('분', '')) * 60
            : 600;
          setProgress(((totalTime - newTime) / totalTime) * 100);
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (isCompleted && activeTaskIndex >= tasks.length - 1) {
      const timer = setTimeout(() => {
        if (onComplete) {
          try {
            onComplete();
          } catch {}
        }
        navigation.goBack();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [
    isCompleted,
    activeTaskIndex,
    tasks.length,
    onComplete,
    navigation,
    tasks,
  ]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePausePress = () => {
    if (isActive) {
      setPauseModalVisible(true);
    } else {
      // 재시작 모달 오픈
      setResumeModalVisible(true);
    }
  };

  const handleConfirmPause = () => {
    setIsActive(false);
    setPauseModalVisible(false);
  };

  const handleClosePauseModal = () => setPauseModalVisible(false);

  const handleConfirmResume = () => {
    setIsActive(true);
    setResumeModalVisible(false);
  };

  const handleCloseResumeModal = () => setResumeModalVisible(false);

  const handleCompletePress = () => {
    setCompleteModalVisible(true);
  };

  const handleConfirmComplete = () => {
    try {
      markActiveRoutineTaskCompleted(activeTaskIndex);
    } catch {}

    try {
      onTaskComplete?.(activeTaskIndex);
    } catch {}

    const currentTask = tasks[activeTaskIndex];
    const taskRoutineId = currentTask?.routineId;

    if (taskRoutineId) {
      const today = new Date();
      const koreaTime = new Date(today.getTime() + 9 * 60 * 60 * 1000);
      const dateString = `${koreaTime.getFullYear()}-${String(koreaTime.getMonth() + 1).padStart(2, '0')}-${String(koreaTime.getDate()).padStart(2, '0')}`;

      donePersonalRoutine({
        routineId: taskRoutineId.toString(),
        params: { date: dateString },
      });

      // 나이대별 점수 업데이트는 백엔드에서 루틴 완료 시 자동으로 처리
    }

    if (activeTaskIndex < tasks.length - 1) {
      setCompleteModalVisible(false);
      setIsActive(false);
      setIsCompleted(true);

      setTimeout(() => {
        setIsCompleted(false);
        goToNextTask();
      }, 2000);
    } else {
      if (routineId) {
        const today = new Date();
        const koreaTime = new Date(today.getTime() + 9 * 60 * 60 * 1000);
        const dateString = `${koreaTime.getFullYear()}-${String(koreaTime.getMonth() + 1).padStart(2, '0')}-${String(koreaTime.getDate()).padStart(2, '0')}`;

        donePersonalRoutineList({
          myRoutineListId: routineId,
          params: { date: dateString },
        });

        // 나이대별 점수 업데이트는 백엔드에서 루틴 완료 시 자동으로 처리
      }

      setCompleteModalVisible(false);
      setIsActive(false);
      setIsCompleted(true);
    }
  };

  const handleCloseCompleteModal = () => setCompleteModalVisible(false);

  const handleSkipPress = () => {
    setSkipModalVisible(true);
  };

  const goToNextTask = () => {
    if (activeTaskIndex < tasks.length - 1) {
      setActiveTaskIndex((prev) => prev + 1);
      setIsActive(true);
    } else {
      navigation.goBack();
    }
  };

  const handleConfirmSkip = () => {
    setSkipModalVisible(false);
    goToNextTask();
  };

  const handleCloseSkipModal = () => setSkipModalVisible(false);

  return (
    <Container edges={['top', 'left', 'right']}>
      <BackButton onPress={() => navigation.navigate('HomeMain')}>
        <Ionicons name="chevron-back" size={24} color={theme.colors.gray600} />
      </BackButton>

      <ScrollContent
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32, flexGrow: 1 }}
      >
        <ContentContainer>
          <Title>{tasks[activeTaskIndex]?.title || '루틴'}</Title>
          <Subtitle>{routineName || '루틴'}</Subtitle>

          <TimerContainer>
            {isCompleted ? (
              <SuccessContainer>
                <SuccessCircle>
                  <CheckIcon>
                    <Ionicons
                      name="checkmark"
                      size={60}
                      color={theme.colors.white}
                    />
                  </CheckIcon>
                </SuccessCircle>
              </SuccessContainer>
            ) : (
              <>
                <ProgressCircle
                  progress={progress}
                  size={240}
                  strokeWidth={16}
                  progressColor={theme.colors.primary}
                  backgroundColor={theme.colors.gray200}
                  showText={false}
                  reverse
                />
                <TimerContent>
                  {tasks[activeTaskIndex]?.icon?.startsWith('http') ? (
                    <SvgImage
                      uri={tasks[activeTaskIndex].icon}
                      width={20}
                      height={20}
                    />
                  ) : (
                    <BreadIcon>
                      {tasks[activeTaskIndex]?.icon || '⏰'}
                    </BreadIcon>
                  )}
                  <TimeLeft>{formatTime(timeLeft)}</TimeLeft>
                  <TotalTime>
                    {tasks[activeTaskIndex]?.duration || '10분'}
                  </TotalTime>
                </TimerContent>
              </>
            )}
          </TimerContainer>

          {isCompleted && (
            <SuccessTextContainer>
              <SuccessTitle>루틴 성공🎉</SuccessTitle>
              <SuccessSubtitle>훌륭해요👍</SuccessSubtitle>
            </SuccessTextContainer>
          )}

          {!isCompleted && (
            <ActionButtonsContainer>
              <RoutineActionButton
                type={isActive ? 'pause' : 'play'}
                onPress={handlePausePress}
              />
              <RoutineActionButton
                type="complete"
                onPress={handleCompletePress}
              />
              <RoutineActionButton type="skip" onPress={handleSkipPress} />
            </ActionButtonsContainer>
          )}
        </ContentContainer>
      </ScrollContent>

      {/* 일시정지 확인 모달 */}
      <BottomSheetDialog
        visible={isPauseModalVisible}
        onRequestClose={handleClosePauseModal}
      >
        <ModalTitle>루틴 일시정지</ModalTitle>
        <ModalSubtitle>해당 루틴을 일시정지 하시겠습니까?</ModalSubtitle>
        <ButtonRow>
          <ButtonWrapper>
            <CancelButton onPress={handleClosePauseModal}>
              <CancelText>취소</CancelText>
            </CancelButton>
          </ButtonWrapper>
          <ButtonWrapper>
            <PauseButton onPress={handleConfirmPause}>
              <PauseText>일시정지</PauseText>
            </PauseButton>
          </ButtonWrapper>
        </ButtonRow>
      </BottomSheetDialog>

      {/* 스킵 확인 모달 */}
      <BottomSheetDialog
        visible={isSkipModalVisible}
        onRequestClose={handleCloseSkipModal}
      >
        <ModalTitle>루틴 넘어가기</ModalTitle>
        <ModalSubtitle>다음 루틴으로 넘어가시겠습니까?</ModalSubtitle>
        <ButtonRow>
          <ButtonWrapper>
            <CancelButton onPress={handleCloseSkipModal}>
              <CancelText>취소</CancelText>
            </CancelButton>
          </ButtonWrapper>
          <ButtonWrapper>
            <SkipButton onPress={handleConfirmSkip}>
              <SkipText>스킵</SkipText>
            </SkipButton>
          </ButtonWrapper>
        </ButtonRow>
      </BottomSheetDialog>

      {/* 완료 확인 모달 */}
      <BottomSheetDialog
        visible={isCompleteModalVisible}
        onRequestClose={handleCloseCompleteModal}
      >
        <ModalTitle>루틴 완료</ModalTitle>
        <ModalSubtitle>해당 루틴을 완료하시겠습니까?</ModalSubtitle>
        <ButtonRow>
          <ButtonWrapper>
            <CancelButton onPress={handleCloseCompleteModal}>
              <CancelText>취소</CancelText>
            </CancelButton>
          </ButtonWrapper>
          <ButtonWrapper>
            <CompleteButton onPress={handleConfirmComplete}>
              <CompleteText>완료</CompleteText>
            </CompleteButton>
          </ButtonWrapper>
        </ButtonRow>
      </BottomSheetDialog>

      {/* 재시작 확인 모달 */}
      <BottomSheetDialog
        visible={isResumeModalVisible}
        onRequestClose={handleCloseResumeModal}
      >
        <ModalTitle>루틴 다시 시작</ModalTitle>
        <ModalSubtitle>해당 루틴을 다시 시작하시겠습니까?</ModalSubtitle>
        <ButtonRow>
          <ButtonWrapper>
            <CancelButton onPress={handleCloseResumeModal}>
              <CancelText>취소</CancelText>
            </CancelButton>
          </ButtonWrapper>
          <ButtonWrapper>
            <ResumeButton onPress={handleConfirmResume}>
              <ResumeText>다시 시작</ResumeText>
            </ResumeButton>
          </ButtonWrapper>
        </ButtonRow>
      </BottomSheetDialog>
    </Container>
  );
};

export default ActiveRoutineScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const ScrollContent = styled.ScrollView`
  flex: 1;
`;

const ContentContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
`;

const Title = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 36px;
  color: #1f2021;
  text-align: center;
  margin-bottom: 12px;
`;

const Subtitle = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  font-weight: 400;
  color: #b5b6bd;
  text-align: center;
  margin-bottom: 16px;
`;

const TimerContainer = styled.View`
  margin: 0 0 40px 0;
  position: relative;
  width: 240px;
  height: 240px;
  justify-content: center;
  align-items: center;
`;

const TimerContent = styled.View`
  position: absolute;
  align-items: center;
  z-index: 1;
`;

const BreadIcon = styled.Text`
  font-size: 86px;
  margin-bottom: 16px;
`;

const BreadIconImage = styled.Image`
  width: 86px;
  height: 86px;
  margin-bottom: 16px;
`;

const TimeLeft = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 32px;
  font-weight: 500;
  color: #3f3f42;
  text-align: center;
  margin-bottom: 8px;
  letter-spacing: -0.3px;
`;

const TotalTime = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 12px;
  font-weight: 500;
  color: #98989e;
  text-align: center;
  letter-spacing: -0.3px;
`;

const ActionButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 0;
`;

const SuccessContainer = styled.View`
  align-items: center;
  width: 240px;
  height: 240px;
  justify-content: center;
`;

const SuccessTextContainer = styled.View`
  align-items: center;
`;

const SuccessCircle = styled.View`
  width: 200px;
  height: 200px;
  border-radius: 100px;
  background-color: ${theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

const CheckIcon = styled.View`
  align-items: center;
  justify-content: center;
`;

const SuccessTitle = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 32px;
  font-weight: ${theme.fonts.Bold};
  color: #FF6F61;
  text-align: center;
`;

const SuccessSubtitle = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 16px;
  font-weight: 400;
  color: #98989e;
  text-align: center;
`;

const ModalTitle = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 18px;
  color: ${theme.colors.gray900};
  text-align: center;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const ModalSubtitle = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
  text-align: center;
  margin-bottom: 36px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const ButtonWrapper = styled.View`
  flex: 1;
`;

const CancelButton = styled.TouchableOpacity`
  background-color: ${theme.colors.gray200};
  border-radius: 12px;
  padding: 14px;
  align-items: center;
`;

const CancelText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  text-align: center;
`;

const PauseButton = styled.TouchableOpacity`
  background-color: ${theme.colors.error};
  border-radius: 12px;
  padding: 14px;
  align-items: center;
`;

const PauseText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  text-align: center;
`;

const CompleteButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  border-radius: 12px;
  padding: 14px;
  align-items: center;
`;

const CompleteText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  text-align: center;
`;

const ResumeButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  border-radius: 12px;
  padding: 14px;
  align-items: center;
`;

const ResumeText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  text-align: center;
`;

const SkipButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  border-radius: 12px;
  padding: 14px;
  align-items: center;
`;

const SkipText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  text-align: center;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  padding-top: 8px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.gray200};
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: 60px;
  left: 16px;
  z-index: 1000;
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
`;

const HeaderTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 18px;
  color: ${theme.colors.gray900};
`;

const Spacer = styled.View`
  width: 40px;
`;
