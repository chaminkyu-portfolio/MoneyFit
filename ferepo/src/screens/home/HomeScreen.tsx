import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, TouchableOpacity, View, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Alert, Platform } from 'react-native';

import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import TabNavigation from '../../components/common/TabNavigation';
import RoutineCard from '../../components/domain/routine/RoutineCard';
import AddRoutineButton from '../../components/domain/routine/AddRoutineButton';
import GroupRoutineCard from '../../components/domain/routine/GroupRoutineCard';
import RankBoardCard from '../../components/domain/routine/RankBoardCard';
import BottomSheetDialog from '../../components/common/BottomSheetDialog';
import CustomButton from '../../components/common/CustomButton';
import { useRoutineStore, useUserStore } from '../../store';
import {
  useInfinitePersonalRoutines,
  usePersonalRoutines,
} from '../../hooks/routine/personal/usePersonalRoutines';
import {
  useInfiniteGroupRoutines,
  useGroupRoutines,
  useInfiniteMyGroupRoutines,
} from '../../hooks/routine/group/useGroupRoutines';
import { useMyInfo } from '../../hooks/user/useUser';
import { getMaxStreak } from '../../api/analysis';
import { useAccountVerification } from '../../hooks/user';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [showAddRoutineModal, setShowAddRoutineModal] = useState(false);
  const [hasShownStreakSuccess, setHasShownStreakSuccess] = useState(false);

  const { selectedDate, setSelectedDate } = useRoutineStore();
  const { setUserInfo } = useUserStore();

  // FCM 토큰 저장 API 훅
  const { mutate: saveFcmToken } = useAccountVerification();

  // 사용자 정보 조회
  const { data: myInfoData, isLoading: isMyInfoLoading } = useMyInfo();

  // FCM 토큰 발급 및 저장 함수
  const registerForPushNotificationsAsync = async () => {
    // 이미 토큰이 발급되었는지 확인
    const hasTokenBeenIssued = await AsyncStorage.getItem('fcmTokenIssued');
    if (hasTokenBeenIssued === 'true') {
      console.log('🔍 FCM 토큰이 이미 발급되었습니다.');
      return;
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('푸시 알림 권한이 거부되었습니다.');
        return;
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        console.log('Project ID를 찾을 수 없습니다.');
        return;
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log('🔍 FCM 토큰 발급 성공:', pushTokenString);

        // 서버에 토큰 저장
        saveFcmToken(
          { fcmToken: pushTokenString },
          {
            onSuccess: (data) => {
              console.log('🔍 FCM 토큰 저장 성공:', data);
              // 토큰 발급 완료 표시
              AsyncStorage.setItem('fcmTokenIssued', 'true');
            },
            onError: (error) => {
              console.error('🔍 FCM 토큰 저장 실패:', error);
            },
          },
        );

        return pushTokenString;
      } catch (e: unknown) {
        console.error('🔍 FCM 토큰 발급 실패:', e);
      }
    } else {
      console.log('실제 기기에서만 푸시 알림을 사용할 수 있습니다.');
    }
  };

  // 사용자 정보가 로드되면 userStore에 저장
  useEffect(() => {
    if (myInfoData?.result) {
      const userInfo = {
        nickname: myInfoData.result.nickname,
        profileImage: myInfoData.result.profileImage,
        points: myInfoData.result.point ?? 0,
        bankAccount: myInfoData.result.bankAccount,
        isMarketing: myInfoData.result.isMarketing,
        accountCertificationStatus:
          myInfoData.result.accountCertificationStatus,
        // 기존 정보는 유지
        email: '', // API에서 제공하지 않으므로 빈 문자열
        accountInfo: undefined, // 기존 accountInfo는 별도로 관리
        notificationConsent: true, // 기본값
      };
      setUserInfo(userInfo);
      console.log('🔍 사용자 정보 저장됨:', userInfo);
    }
  }, [myInfoData, setUserInfo]);

  const today = new Date();

  const getStartOfWeekMonday = (date: Date) => {
    const copied = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const day = copied.getDay();
    const diffToMonday = (day + 6) % 7;
    copied.setDate(copied.getDate() - diffToMonday);
    return copied;
  };

  const isSameDate = (a: Date, b: Date) => {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  const dayLabels = ['월', '화', '수', '목', '금', '토', '일'] as const;

  const startOfWeek = getStartOfWeekMonday(selectedDate);
  const weekData = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date(
      startOfWeek.getFullYear(),
      startOfWeek.getMonth(),
      startOfWeek.getDate() + idx,
    );
    return {
      day: dayLabels[idx],
      date: d.getDate(),
      fullDate: d,
    };
  });

  type RoutineListItem = {
    id: string;
    category: string;
    progress: number;
    title: string;
    description?: string;
    timeRange: string;
    selectedDays: string[];
    completedDays: string[];
    routineNums?: number;
    startDate?: string;
  };

  const selectedDateString = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  const dayIndex = selectedDate.getDay();
  // getDay()는 0(일요일)부터 6(토요일)까지 반환하므로 매핑 필요
  const mappedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // 일요일(0) -> 6, 월요일(1) -> 0
  const selectedDay = ['월', '화', '수', '목', '금', '토', '일'][mappedIndex];

  const {
    data: personalRoutinesData,
    isLoading: isPersonalRoutinesLoading,
    error: personalRoutinesError,
    fetchNextPage: fetchNextPersonalPage,
    hasNextPage: hasNextPersonalPage,
    isFetchingNextPage: isFetchingNextPersonalPage,
    refetch: refetchPersonalRoutines,
  } = useInfinitePersonalRoutines({
    date: selectedDateString,
    day: selectedDay,
  });

  const {
    data: groupRoutinesData,
    isLoading: isGroupRoutinesLoading,
    error: groupRoutinesError,
    fetchNextPage: fetchNextGroupPage,
    hasNextPage: hasNextGroupPage,
    isFetchingNextPage: isFetchingNextGroupPage,
    refetch: refetchGroupRoutines,
  } = useInfiniteMyGroupRoutines({});

  // 최대 연속 일수 확인 및 성공 화면 표시
  const checkMaxStreak = async () => {
    try {
      const res = await getMaxStreak();
      if (
        res.isSuccess &&
        res.result.streakDays >= 7 &&
        res.result.streakDays % 7 === 0 &&
        !hasShownStreakSuccess
      ) {
        setHasShownStreakSuccess(true);
        // AsyncStorage에 표시 여부 저장
        await AsyncStorage.setItem('hasShownStreakSuccess', 'true');
        // 분석 탭으로 이동
        navigation.navigate('Analysis');
      }
    } catch (error) {
      console.error('최대 연속 일수 확인 중 오류:', error);
    }
  };

  // AsyncStorage에서 표시 여부 확인 및 최대 연속 일수 확인
  useEffect(() => {
    const checkShownStatus = async () => {
      try {
        const shown = await AsyncStorage.getItem('hasShownStreakSuccess');
        if (shown === 'true') {
          setHasShownStreakSuccess(true);
        } else {
          // 표시되지 않았다면 최대 연속 일수 확인
          checkMaxStreak();
        }
      } catch (error) {
        console.error('AsyncStorage 확인 중 오류:', error);
      }
    };
    checkShownStatus();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      refetchPersonalRoutines();
      refetchGroupRoutines();
      // FCM 토큰 발급 및 저장
      registerForPushNotificationsAsync();
    }, [refetchPersonalRoutines, refetchGroupRoutines]),
  );

  const formatTimeForDisplay = (time: any): string => {
    if (!time) return '00:00';

    if (Array.isArray(time)) {
      const [hour, minute] = time;
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }

    if (typeof time === 'string') {
      if (time.includes(',')) {
        const [hour, minute] = time.split(',');
        return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
      }

      if (time.includes(':')) {
        return time.split(':').slice(0, 2).join(':');
      }
    }

    return '00:00';
  };

  const personalRoutines: RoutineListItem[] =
    personalRoutinesData?.pages?.flatMap((page) =>
      page.result.items.map((item) => ({
        id: item.id.toString(),
        category: item.routineType === 'DAILY' ? '생활' : '소비',
        progress: item.percent || 0,
        title: item.title,
        timeRange: `${formatTimeForDisplay(item.startTime)} ~ ${formatTimeForDisplay(item.endTime)}`,
        selectedDays: item.dayOfWeek,
        completedDays: item.successDay || [],
        routineNums: item.routineNums || 0,
        startDate: item.startDate, // 시작 날짜 추가
      })),
    ) || [];

  const groupRoutines: RoutineListItem[] =
    groupRoutinesData?.pages?.flatMap(
      (page) =>
        page.result?.items?.map((item) => {
          // 진행률이 100%인 경우 오늘 날짜의 요일만 완료된 것으로 표시
          const today = new Date();
          const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
          const dayIndex = today.getDay();
          // getDay()는 0(일요일)부터 6(토요일)까지 반환하므로 매핑 필요
          const mappedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // 일요일(0) -> 6, 월요일(1) -> 0
          const todayDay = dayNames[mappedIndex];

          const completedDays =
            (item.percent || 0) >= 100 && item.dayOfWeek.includes(todayDay)
              ? [todayDay]
              : [];

          return {
            id: item.id.toString(),
            category: item.routineType === 'DAILY' ? '생활' : '소비',
            progress: item.percent || 0,
            title: item.title,
            description: item.description,
            timeRange: `${formatTimeForDisplay(item.startTime)} ~ ${formatTimeForDisplay(item.endTime)}`,
            selectedDays: item.dayOfWeek,
            completedDays,
            routineNums: item.routineNums || 0,
          };
        }) || [],
    ) || [];

  // 선택된 날짜의 요일
  const dayIndex2 = selectedDate.getDay();
  // getDay()는 0(일요일)부터 6(토요일)까지 반환하므로 매핑 필요
  const mappedIndex2 = dayIndex2 === 0 ? 6 : dayIndex2 - 1; // 일요일(0) -> 6, 월요일(1) -> 0
  const selectedDayLabel = ['월', '화', '수', '목', '금', '토', '일'][
    mappedIndex2
  ];

  // API에서 반환된 루틴들을 그대로 사용 (클라이언트 필터링 제거)
  console.log('🔍 홈 화면 루틴 조회:', {
    selectedDate: selectedDateString,
    selectedDay: selectedDay,
    selectedDayLabel,
    personalRoutinesCount: personalRoutines.length,
    groupRoutinesCount: groupRoutines.length,
    personalRoutines: personalRoutines.map((r) => ({
      id: r.id,
      title: r.title,
      selectedDays: r.selectedDays,
      startDate: r.startDate, // 시작 날짜 추가
    })),
  });

  const selectedDayPersonalRoutines = personalRoutines;
  const selectedDayGroupRoutines = groupRoutines;

  const dayCompletionStatus = weekData.map((item) => {
    const dayLabel = item.day;

    const dayPersonalRoutines = personalRoutines.filter((routine) =>
      routine.selectedDays.includes(dayLabel),
    );

    const dayGroupRoutines = groupRoutines.filter((routine) =>
      routine.selectedDays.includes(dayLabel),
    );

    const hasRoutines =
      dayPersonalRoutines.length > 0 || dayGroupRoutines.length > 0;

    return {
      day: dayLabel,
      hasRoutines,
    };
  });

  const handleGroupBannerPress = () => {
    navigation.navigate('GroupBoard');
  };

  const handleRankBannerPress = () => {
    navigation.navigate('RankBoard');
  };

  const handleRoutinePress = (routineId: string) => {
    if (selectedTab === 0) {
      const routine = personalRoutines.find((r) => r.id === routineId);
      if (routine) {
        navigation.navigate('PersonalRoutineDetail', {
          routineData: {
            id: routine.id,
            name: routine.title,
            startTime: routine.timeRange.split(' ~ ')[0],
            endTime: routine.timeRange.split(' ~ ')[1],
            days: routine.selectedDays,
            category: routine.category,
            percent: routine.progress, // percent 값 추가
            routineNums: routine.routineNums, // routineNums 값도 추가
          },
        });
      }
    } else {
      const routine = groupRoutines.find((r) => r.id === routineId);
      if (routine) {
        navigation.navigate('GroupRoutineDetail', {
          routineId: routine.id,
          routineData: {
            id: routine.id,
            name: routine.title,
            startTime: routine.timeRange.split(' ~ ')[0],
            endTime: routine.timeRange.split(' ~ ')[1],
            days: routine.selectedDays,
            category: routine.category,
          },
        });
      }
    }
  };

  const handleAddRoutine = () => {
    setShowAddRoutineModal(true);
  };

  const handleAICreateRoutine = () => {
    setShowAddRoutineModal(false);
    navigation.navigate('AIRecommendation', { fromHome: true });
  };

  const handleManualCreateRoutine = () => {
    setShowAddRoutineModal(false);
    navigation.navigate('CreateRoutine');
  };

  const handleDateSelect = (date: Date) => {
    // 날짜만 복사하고 시간은 설정하지 않음
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    console.log('🔍 날짜 선택됨:', {
      oldDate: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`,
      newDate: `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`,
      oldDay: selectedDay,
      newDay: (() => {
        const dayIndex = newDate.getDay();
        // getDay()는 0(일요일)부터 6(토요일)까지 반환하므로 매핑 필요
        const mappedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // 일요일(0) -> 6, 월요일(1) -> 0
        return ['월', '화', '수', '목', '금', '토', '일'][mappedIndex];
      })(),
    });
    setSelectedDate(newDate);
  };

  // 무한 스크롤 핸들러
  const handleLoadMore = () => {
    if (selectedTab === 0) {
      if (hasNextPersonalPage && !isFetchingNextPersonalPage) {
        fetchNextPersonalPage();
      }
    } else {
      if (hasNextGroupPage && !isFetchingNextGroupPage) {
        fetchNextGroupPage();
      }
    }
  };

  const isFetchingNextPage =
    selectedTab === 0 ? isFetchingNextPersonalPage : isFetchingNextGroupPage;

  return (
    <Container edges={['top', 'left', 'right']}>
      <Content>
        {/* 날짜 선택기 */}
        <DateSelector>
          <MonthText>
            {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월
          </MonthText>
          <WeekContainer>
            {weekData.map((item, index) => {
              const completionStatus = dayCompletionStatus[index];
              return (
                <DayItem key={item.fullDate.toISOString()}>
                  <DayText day={item.day}>{item.day}</DayText>
                  <DateButton
                    isSelected={isSameDate(item.fullDate, selectedDate)}
                    onPress={() => handleDateSelect(item.fullDate)}
                  >
                    <DateText
                      isSelected={isSameDate(item.fullDate, selectedDate)}
                    >
                      {item.date}
                    </DateText>
                  </DateButton>
                </DayItem>
              );
            })}
          </WeekContainer>
        </DateSelector>

        {/* 단체/랭킹 배너 (기존 카드 컴포넌트 재사용, 반폭 2열) */}
        <CardsRow>
          <CardCol style={{ marginRight: 8 }}>
            <GroupRoutineCard
              onPress={handleGroupBannerPress}
              iconSource={require('../../assets/images/group.png')}
            />
          </CardCol>
          <CardCol>
            <RankBoardCard
              onPress={handleRankBannerPress}
              iconSource={require('../../assets/images/medal.png')}
            />
          </CardCol>
        </CardsRow>

        {/* 탭 선택 */}
        <TabNavigation
          selectedIndex={selectedTab}
          onTabChange={setSelectedTab}
          tabs={['개인 루틴', '단체 루틴']}
        />

        {/* 루틴 목록 */}
        <RoutineList>
          <FlatList
            data={
              selectedTab === 0
                ? selectedDayPersonalRoutines
                : selectedDayGroupRoutines
            }
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <RoutineCard
                category={item.category}
                progress={item.progress}
                title={item.title}
                description={item.description}
                timeRange={item.timeRange}
                selectedDays={item.selectedDays}
                completedDays={item.completedDays}
                routineNums={item.routineNums}
                onPress={() => handleRoutinePress(item.id)}
              />
            )}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            ListFooterComponent={null}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 0,
            }}
            ListEmptyComponent={() => (
              <EmptyRoutineContainer>
                <EmptyRoutineText>등록된 루틴이 없습니다.</EmptyRoutineText>
              </EmptyRoutineContainer>
            )}
          />
        </RoutineList>
      </Content>

      {/* 플로팅 액션 버튼 */}
       <AddRoutineButton onPress={handleAddRoutine} />

      {/* 루틴 추가 선택 모달 */}
      <BottomSheetDialog
        visible={showAddRoutineModal}
        onRequestClose={() => setShowAddRoutineModal(false)}
      >
        <SelectionButtonsContainer>
          <CustomButton
            text="AI 추천 루틴 생성"
            onPress={handleAICreateRoutine}
            backgroundColor={theme.colors.white}
            textColor={theme.colors.primary}
            borderColor="#FF6F61"
            borderWidth={1}
          />
          <CustomButton
            text="직접 루틴 생성"
            onPress={handleManualCreateRoutine}
            backgroundColor={theme.colors.white}
            textColor={theme.colors.gray800}
            borderColor={theme.colors.gray300}
            borderWidth={1}
          />
        </SelectionButtonsContainer>
      </BottomSheetDialog>
    </Container>
  );
};

export default HomeScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
  padding-bottom: 0;
`;

const Content = styled.View`
  flex: 1;
  padding: 24px;
`;

const DateSelector = styled.View`
  margin-bottom: 16px;
`;

const MonthText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 20px;
  color: ${theme.colors.gray800};
  margin-bottom: 12px;
  padding-left: 0px;
`;

const WeekContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const DayItem = styled.View`
  align-items: center;
`;

const DayText = styled.Text<{ day: string }>`
  font-family: ${theme.fonts.Regular};
  font-size: 12px;
  color: ${({ day }) => {
    if (day === '토') return '#2283EC';
    if (day === '일') return '#ED2929';
    return theme.colors.gray600;
  }};
  margin-bottom: 4px;
`;

const DateButton = styled.TouchableOpacity<{
  isSelected: boolean;
}>`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${({ isSelected }) => {
    if (isSelected) return theme.colors.primary;
    return 'transparent';
  }};
  align-items: center;
  justify-content: center;
`;

const DateText = styled.Text<{ isSelected: boolean }>`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${({ isSelected }) => {
    if (isSelected) return theme.colors.white;
    return theme.colors.gray800;
  }};
`;

const RoutineList = styled.View`
  flex: 1;
  margin-bottom: 0;
`;

const GroupRoutineGuide = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const GuideText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 18px;
  color: ${theme.colors.gray800};
  text-align: center;
  margin-bottom: 12px;
`;

const GuideSubText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
  text-align: center;
  line-height: 20px;
`;

const SelectionButtonsContainer = styled.View`
  gap: 12px;
`;

const LoadingText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
  text-align: center;
  padding: 16px;
`;

const EmptyRoutineContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const EmptyRoutineImage = styled.Image`
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
  opacity: 0.3;
`;

const EmptyRoutineText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 16px;
  color: ${theme.colors.gray400};
  text-align: center;
`;

// 배너 레이아웃 (반폭 2열, 기존 카드 재사용)
const CardsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const CardCol = styled.View`
  flex: 1;
`;

// 플로팅 버튼들 컨테이너
const FloatingButtonsContainer = styled.View`
  position: absolute;
  bottom: 20px;
  right: 20px;
  align-items: center;
`;
