import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { theme } from '../../styles/theme';
import {
  AchievementCard,
  WeeklySummary,
  ConsumptionAnalysisCard,
} from '../../components/domain/analysis';
import { useAnalysisStore } from '../../store';
import { getMaxStreak, getWeeklySummary } from '../../api/analysis';
import { RoutineType, WeeklySummaryItem } from '../../types/api';
import { useGivePoint } from '../../hooks/analysis';

/**
 * AnalysisScreen의 props 인터페이스
 */
interface IAnalysisScreenProps {
  /** 네비게이션 객체 */
  navigation: any;
}

/**
 * 분석 화면 컴포넌트
 * 사용자의 소비 분석 및 추천을 제공합니다.
 * @param props - 컴포넌트 props
 * @returns 분석 화면 컴포넌트
 */
const AnalysisScreen = ({ navigation }: IAnalysisScreenProps) => {
  // Zustand 스토어에서 분석 상태 가져오기
  const { selectedChartType, setSelectedChartType } = useAnalysisStore();

  // 탭 상태 관리 (로컬 상태로 유지 - 화면 내에서만 사용)
  const [selectedTab, setSelectedTab] = useState(0);

  // 주간 데이터 헤더
  const weekDays = ['월', '화', '수', '목', '금', '토', '일'];
  // 주간 네비게이션 기준 날짜 (해당 주의 아무 날짜여도 됨; +/-7일 이동)
  const [weekAnchorDate, setWeekAnchorDate] = useState(new Date());
  // selectedDayIndex를 월요일(0)~일요일(6) 기준으로 변환
  const selectedDayIndex =
    weekAnchorDate.getDay() === 0 ? 6 : weekAnchorDate.getDay() - 1; // 0: 월요일, 1: 화요일, ..., 6: 일요일

  // 주간 범위 계산 (월요일 시작 ~ 일요일 끝 기준)
  const { startDateStr, endDateStr, dateRangeLabel } = useMemo(() => {
    // getDay(): 0(일)~6(토)
    const dayOfWeek = weekAnchorDate.getDay();
    const monday = new Date(weekAnchorDate);
    // 월요일(1)부터 시작하도록 조정
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    monday.setDate(weekAnchorDate.getDate() - daysFromMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const toYmd = (d: Date) => {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };
    const toKoreanLabel = (d: Date) => `${d.getMonth() + 1}월 ${d.getDate()}일`;

    return {
      startDateStr: toYmd(monday),
      endDateStr: toYmd(sunday),
      dateRangeLabel: `${toKoreanLabel(monday)} - ${toKoreanLabel(sunday)}`,
    };
  }, [weekAnchorDate]);

  // 주간 이동 핸들러
  const handlePreviousWeek = () => {
    setWeekAnchorDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() - 7);
      return next;
    });
  };

  const handleNextWeek = () => {
    setWeekAnchorDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + 7);
      return next;
    });
  };

  // API 상태
  const [loadingWeekly, setLoadingWeekly] = useState(false);
  const [weeklyError, setWeeklyError] = useState<string | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklySummaryItem[]>([]);

  // 전체 루틴 데이터 (생활 + 소비)
  const [allRoutinesData, setAllRoutinesData] = useState<WeeklySummaryItem[]>(
    [],
  );

  // 최대 연속 일수 상태
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [maxStreakRoutineName, setMaxStreakRoutineName] = useState<string>('');
  const [loadingStreak, setLoadingStreak] = useState(false);
  const [streakError, setStreakError] = useState<string | null>(null);

  // 포인트 지급 훅
  const { mutate: givePoint } = useGivePoint();

  // 이전 더미 데이터는 API 연동으로 대체합니다.
  // const dailyRoutines = [...];
  // const financialRoutines = [...];

  // 서버 불린값 → UI 상태 매핑 함수
  const booleanToStatus = (value: boolean): 'completed' | 'incomplete' =>
    value ? 'completed' : 'incomplete';

  // 전체 루틴 데이터에서 가장 streak가 긴 루틴 찾기
  const findMaxStreakRoutine = useMemo(() => {
    if (allRoutinesData.length === 0) return { name: '', streak: 0 };

    const coalesceBool = (...values: Array<any>): boolean => {
      for (const value of values) {
        if (typeof value === 'boolean') return value;
      }
      return false;
    };

    const calculateStreak = (raw: WeeklySummaryItem['dailyStatus']) => {
      const ds = (raw || {}) as unknown as Record<string, any>;
      const sunday = coalesceBool(
        ds.SUNDAY,
        ds.Sun,
        ds.SUN,
        ds['일'],
        ds['일요일'],
      );
      const monday = coalesceBool(
        ds.MONDAY,
        ds.Mon,
        ds.MON,
        ds['월'],
        ds['월요일'],
      );
      const tuesday = coalesceBool(
        ds.TUESDAY,
        ds.Tue,
        ds.TUE,
        ds['화'],
        ds['화요일'],
      );
      const wednesday = coalesceBool(
        ds.WEDNESDAY,
        ds.Wed,
        ds.WED,
        ds['수'],
        ds['수요일'],
      );
      const thursday = coalesceBool(
        ds.THURSDAY,
        ds.Thu,
        ds.THU,
        ds['목'],
        ds['목요일'],
      );
      const friday = coalesceBool(
        ds.FRIDAY,
        ds.Fri,
        ds.FRI,
        ds['금'],
        ds['금요일'],
      );
      const saturday = coalesceBool(
        ds.SATURDAY,
        ds.Sat,
        ds.SAT,
        ds['토'],
        ds['토요일'],
      );

      const weekStatus = [
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
      ];

      let maxStreak = 0;
      let currentStreak = 0;

      for (const status of weekStatus) {
        if (status) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }

      return maxStreak;
    };

    let maxStreakRoutine = { name: '', streak: 0 };

    for (const item of allRoutinesData) {
      const streak = calculateStreak(item.dailyStatus);
      if (streak > maxStreakRoutine.streak) {
        maxStreakRoutine = { name: item.routineTitle, streak };
      }
    }

    return maxStreakRoutine;
  }, [allRoutinesData]);

  // API 데이터 → WeeklySummary 컴포넌트 props로 변환
  const mappedRoutines = useMemo(() => {
    const coalesceBool = (...values: Array<any>): boolean => {
      for (const value of values) {
        if (typeof value === 'boolean') return value;
      }
      return false;
    };

    const toStatusArray = (raw: WeeklySummaryItem['dailyStatus']) => {
      const ds = (raw || {}) as unknown as Record<string, any>;
      // 한글 키(월~일), 영문 키(MONDAY~SUNDAY), 약어(SUN~SAT), 전체 한글(월요일~일요일) 모두 대응
      const sunday = coalesceBool(
        ds.SUNDAY,
        ds.Sun,
        ds.SUN,
        ds['일'],
        ds['일요일'],
      );
      const monday = coalesceBool(
        ds.MONDAY,
        ds.Mon,
        ds.MON,
        ds['월'],
        ds['월요일'],
      );
      const tuesday = coalesceBool(
        ds.TUESDAY,
        ds.Tue,
        ds.TUE,
        ds['화'],
        ds['화요일'],
      );
      const wednesday = coalesceBool(
        ds.WEDNESDAY,
        ds.Wed,
        ds.WED,
        ds['수'],
        ds['수요일'],
      );
      const thursday = coalesceBool(
        ds.THURSDAY,
        ds.Thu,
        ds.THU,
        ds['목'],
        ds['목요일'],
      );
      const friday = coalesceBool(
        ds.FRIDAY,
        ds.Fri,
        ds.FRI,
        ds['금'],
        ds['금요일'],
      );
      const saturday = coalesceBool(
        ds.SATURDAY,
        ds.Sat,
        ds.SAT,
        ds['토'],
        ds['토요일'],
      );

      const order = [
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
      ];
      return order.map(booleanToStatus);
    };

    return weeklyData.map((item) => ({
      name: item.routineTitle,
      status: toStatusArray(item.dailyStatus),
    }));
  }, [weeklyData]);

  // 전체 루틴 데이터 조회 함수
  const fetchAllRoutines = async () => {
    try {
      // 생활 루틴과 소비 루틴 데이터를 모두 가져오기
      const [dailyRes, financeRes] = await Promise.all([
        getWeeklySummary({
          startDate: startDateStr,
          endDate: endDateStr,
          routineType: 'DAILY',
        }),
        getWeeklySummary({
          startDate: startDateStr,
          endDate: endDateStr,
          routineType: 'FINANCE',
        }),
      ]);

      const allData: WeeklySummaryItem[] = [];

      if (dailyRes.isSuccess) {
        allData.push(...dailyRes.result);
      }
      if (financeRes.isSuccess) {
        allData.push(...financeRes.result);
      }

      setAllRoutinesData(allData);
    } catch (e) {
      console.error('전체 루틴 데이터 조회 실패:', e);
    }
  };

  // 주간 요약 조회 함수
  const fetchWeekly = async () => {
    setLoadingWeekly(true);
    setWeeklyError(null);
    try {
      const routineType: RoutineType = 'FINANCE';
      const res = await getWeeklySummary({
        startDate: startDateStr,
        endDate: endDateStr,
        routineType,
      });
      if (res.isSuccess) {
        setWeeklyData(res.result);
      } else {
        setWeeklyError(res.message || '주간 요약 조회 실패');
      }
    } catch (e) {
      setWeeklyError('주간 요약 조회 중 오류가 발생했어요.');
    } finally {
      setLoadingWeekly(false);
    }
  };

  // 최대 연속 일수 조회 함수
  const fetchMaxStreak = async () => {
    setLoadingStreak(true);
    setStreakError(null);
    try {
      const res = await getMaxStreak();
      if (res.isSuccess) {
        setMaxStreak(res.result.streakDays ?? 0);
      } else {
        setStreakError(res.message || '최대 연속 일수 조회 실패');
      }
    } catch (e) {
      setStreakError('최대 연속 일수 조회 중 오류가 발생했어요.');
    } finally {
      setLoadingStreak(false);
    }
  };

  // 화면에 포커스될 때마다 데이터 새로 불러오기
  useFocusEffect(
    React.useCallback(() => {
      fetchAllRoutines(); // 전체 루틴 데이터 가져오기
      fetchWeekly();
      fetchMaxStreak();
      // TODO: 백엔드에서 eligibility API 제공 시 포인트 지급 조건 확인
      // givePoint API는 사용자가 명시적으로 요청할 때만 호출
    }, [selectedTab, startDateStr, endDateStr]),
  );

  // AI 분석 카드 클릭 핸들러
  const handleAIAnalysisPress = () => {
    // 소비패턴 분석
    navigation.navigate('Loading', {
      title: '소비패턴 분석 중...',
      description: 'AI가 당신의 소비 패턴을 분석하고 있어요',
      statusItems: [
        { text: '소비 내역 수집...', status: 'pending' },
        { text: '카테고리별 분석...', status: 'pending' },
        { text: 'AI 패턴 분석...', status: 'pending' },
        { text: '분석 결과 생성...', status: 'pending' },
      ],
      nextScreen: 'ConsumptionAnalysis',
      duration: 5000,
    });
  };

  return (
    <Container edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Content>
          {/* 제목 */}
          <TitleText>소비 루틴 분석</TitleText>

          {/* 성취 카드 */}
          <AchievementCard
            title="최대 연속"
            achievement={`${maxStreak}일 달성`}
            routineName={
              findMaxStreakRoutine.name || '소비 루틴'
            }
            points={0}
            progress={maxStreak >= 7 ? 0 : Math.min((maxStreak / 7) * 100, 100)}
            daysLeft={7}
          />

          {/* AI 분석 카드 */}
          <ConsumptionAnalysisCard
            robotImageSource={require('../../assets/images/robot.png')}
            title="이번 주 소비패턴 분석하기"
            subtitle="AI가 분석해주는 내 소비패턴"
            onPress={handleAIAnalysisPress}
          />

          {/* 주간 요약 */}
          <WeeklySummary
            title="주간 요약"
            dateRange={dateRangeLabel}
            weekDays={weekDays}
            routines={mappedRoutines}
            selectedDayIndex={selectedDayIndex}
            onPreviousWeek={handlePreviousWeek}
            onNextWeek={handleNextWeek}
          />
        </Content>
      </ScrollView>
    </Container>
  );
};

export default AnalysisScreen;

// 스타일 컴포넌트 정의
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
  padding-bottom: 0;
`;

const Content = styled.View`
  padding: 0 24px 24px 24px;
`;

const TitleText = styled.Text`
  font-size: 24px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.black};
  margin-bottom: 24px;
`;
