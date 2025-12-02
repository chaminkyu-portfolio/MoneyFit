import React, { useMemo, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import {
  Image,
  Modal,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import CustomButton from '../../components/common/CustomButton';
import BottomSheetDialog from '../../components/common/BottomSheetDialog';
import RoutineCard from '../../components/domain/routine/RoutineCard';
import SvgImage from '../../components/common/SvgImage';
import {
  useDeleteGroupRoutine,
  useJoinGroupRoutine,
  useLeaveGroupRoutine,
  useGroupRoutineDetail,
  useUpdateGroupRoutineStatus,
  useUpdateGroupRoutineRecord,
  useAwardPointForGroupRoutine,
} from '../../hooks/routine/group/useGroupRoutines';
import { useRoutineEmojis } from '../../hooks/routine/common/useCommonRoutines';
import GuestbookModal from '../../components/domain/routine/GuestbookModal';
import RoutineSuggestionModal from '../../components/domain/routine/RoutineSuggestionModal';
import RouletteButton from '../../components/domain/routine/RouletteButton';
import { useRouletteSpin } from '../../hooks/roulette';

interface GroupRoutineDetailScreenProps {
  navigation: any;
  route: { params?: { routineId?: string; routineData?: any } };
}

const GroupRoutineDetailScreen = ({
  navigation,
  route,
}: GroupRoutineDetailScreenProps) => {
  const routineId = route?.params?.routineId ?? '1';

  const queryClient = useQueryClient();

  // 실제 API 데이터 조회
  const {
    data: routineDetailData,
    isLoading: isRoutineDetailLoading,
    error: routineDetailError,
  } = useGroupRoutineDetail(routineId);

  // API 데이터를 화면에 맞는 형태로 변환
  const routine = useMemo(() => {
    if (!routineDetailData?.result) {
      return {
        id: routineId,
        title: '로딩 중...',
        description: '',
        membersCount: 0,
        timeRange: '',
        progressText: '',
        selectedDays: [],
        completedDays: [],
        isJoined: false,
        routineType: 'DAILY',
        routineNums: 0,
        tasks: [],
        participants: [],
        completedParticipants: [],
        unachievedParticipants: [],
        completedCount: 0,
        unachievedCount: 0,
        allParticipants: [],
        isAdmin: false,
      };
    }

    const result = routineDetailData.result;
    const groupRoutineInfo = result.groupRoutineInfo;
    const routineInfos = result.routineInfos || [];
    const memberInfo = result.groupRoutineMemberInfo;

    // 단체루틴 상세 조회 데이터 로깅
    console.log('🔍 단체루틴 상세 조회 데이터:', {
      groupRoutineInfo,
      routineInfos: routineInfos.map((r: any) => ({
        name: r.name,
        time: r.time,
        isCompleted: r.isCompleted,
        emojiUrl: r.emojiUrl,
      })),
      memberInfo,
    });

    // 참여 여부에 따른 참여자 정보 처리
    const isUserJoined = groupRoutineInfo?.joined || false;

    let completedParticipants: string[] = [];
    let unachievedParticipants: string[] = [];
    let completedCount = 0;
    let unachievedCount = 0;
    let allParticipants: string[] = [];

    if (isUserJoined) {
      // 참여자인 경우: 완료/미달성 구분
      completedParticipants = memberInfo?.successPeopleProfileImageUrl || [];
      unachievedParticipants = memberInfo?.failedPeopleProfileImageUrl || [];
      completedCount = completedParticipants.length;
      unachievedCount = unachievedParticipants.length;
    } else {
      // 미참여자인 경우: 모든 참여자 프로필 이미지
      allParticipants = (memberInfo as any)?.profileImageUrl || [];
    }

    // 모든 루틴이 완료되었는지 확인
    const allCompleted =
      routineInfos.length > 0 && routineInfos.every((r: any) => r.isCompleted);

    // 모든 루틴이 완료되었다면 오늘 날짜의 요일만 완료된 요일로 설정
    const today = new Date();
    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
    const dayIndex = today.getDay();
    // getDay()는 0(일요일)부터 6(토요일)까지 반환하므로 매핑 필요
    const mappedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // 일요일(0) -> 6, 월요일(1) -> 0
    const todayDay = dayNames[mappedIndex];

    const completedDays =
      allCompleted && groupRoutineInfo?.dayOfWeek?.includes(todayDay)
        ? [todayDay]
        : [];

    const routineObject = {
      id: routineId,
      title: groupRoutineInfo?.title || '제목 없음',
      description: groupRoutineInfo?.description || '',
      membersCount: groupRoutineInfo?.peopleNums || 0,
      timeRange: `${groupRoutineInfo?.startTime || '00:00'} - ${groupRoutineInfo?.endTime || '00:00'}`,
      progressText:
        routineInfos.length > 0
          ? `[${groupRoutineInfo?.routineType === 'DAILY' ? '생활' : '소비'}] ${Math.round((routineInfos.filter((r: any) => r.isCompleted).length / routineInfos.length) * 100)}%`
          : '0%',
      selectedDays: groupRoutineInfo?.dayOfWeek || [],
      completedDays,
      isJoined: groupRoutineInfo?.joined || false,
      routineType: groupRoutineInfo?.routineType || 'DAILY',
      routineNums: groupRoutineInfo?.routineNums || 0,
      tasks: routineInfos.map((r: any) => ({
        icon: r.emojiUrl || '🔍', // 서버에서 받은 이모지 URL 사용, 없으면 기본값
        title: r.name,
        duration: `${r.time}분`,
        isCompleted: r.isCompleted,
      })),
      participants: [...completedParticipants, ...unachievedParticipants],
      completedParticipants,
      unachievedParticipants,
      completedCount,
      unachievedCount,
      allParticipants,
      isAdmin: result.admin === true,
    };

    return routineObject;
  }, [routineDetailData, routineId]);

  const [isJoinModalVisible, setJoinModalVisible] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditRoutineModalVisible, setIsEditRoutineModalVisible] =
    useState(false);
  const [isEditRoutineDetailModalVisible, setIsEditRoutineDetailModalVisible] =
    useState(false);
  const [isGuestbookModalVisible, setIsGuestbookModalVisible] = useState(false);
  const [userRole, setUserRole] = useState<'host' | 'member' | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
  

  // userRole과 isJoined 상태를 실제 API 데이터에 맞게 설정
  useEffect(() => {
    if (routineDetailData?.result) {
      const result = routineDetailData.result;
      const isUserJoined = result.groupRoutineInfo?.joined || false;

      if (result.admin) {
        setUserRole('host');
        setIsJoined(isUserJoined);
      } else if (isUserJoined) {
        setUserRole('member');
        setIsJoined(true);
      } else {
        setUserRole(null);
        setIsJoined(false);
      }
    }
  }, [routineDetailData]);

  // 단체 루틴 관련 훅들
  const { mutate: deleteGroupRoutine, isPending: isDeleting } =
    useDeleteGroupRoutine();
  const { mutate: joinGroupRoutine, isPending: isJoining } =
    useJoinGroupRoutine();
  const { mutate: leaveGroupRoutine, isPending: isLeaving } =
    useLeaveGroupRoutine();

  // 루틴 상태 업데이트 훅
  const updateGroupRoutineStatus = useUpdateGroupRoutineStatus();

  // 단체루틴 기록 업데이트 훅
  const updateGroupRoutineRecord = useUpdateGroupRoutineRecord();

  // 이모지 데이터 조회
  const { data: emojisData, isLoading: isLoadingEmojis } = useRoutineEmojis();

  // 룰렛 관련 훅
  const { mutate: spinRoulette, isPending: isSpinning } = useRouletteSpin();
  // const { data: ticketsData, refetch: refetchTickets } = useMyTickets();

  const {mutate: pointRoulette, isPending: isPointSpinning} = useAwardPointForGroupRoutine();
  
  // 티켓 수 (API 응답이 없으면 기본값 2)
  // const userTickets = ticketsData?.result?.tickets ?? 2;

  // 룰렛 데이터 (모든 세그먼트 크기 동일)



  // 전체 기록 업데이트는 별도의 조건이나 사용자 액션에 의해서만 호출
  // useEffect로 자동 호출하지 않음

  const handlePointsEarned = (winnerName: number) => {
    pointRoulette(
      {
        groupRoutineListId : routine.id,
        point: winnerName,  
      },{
        onSuccess: (data) => {
          console.log(data);
          Alert.alert('', `${data.result}`, [
            { text: '확인' },
          ]);
        },
      }
    )

    // 실제 API 호출로 룰렛 스핀 (고정 10점 지급)
    // spinRoulette({ ticketCost: 1 }, {
    //   onSuccess: (data) => {
        
    //     // console.log(`${winnerName} 포인트를 획득했습니다!`);
    //     // 티켓 정보 다시 조회
    //     // refetchTickets();
    //   },
    //   onError: (error) => {
    //     console.error('룰렛 스핀 실패:', error);
    //   }
    // });
  };

  const handleBack = () => navigation.goBack();
  const handleJoin = () => setJoinModalVisible(true);
  const handleCloseJoinModal = () => setJoinModalVisible(false);
  const handleConfirmJoin = () => {
    if (isJoined) {
      setJoinModalVisible(false);
      return;
    }

    if (routine.isAdmin) {
      setJoinModalVisible(false);
      return;
    }

    joinGroupRoutine(routine.id, {
      onSuccess: () => {
        setIsJoined(true);
        setUserRole('member');
        setJoinModalVisible(false);

        queryClient.invalidateQueries({
          queryKey: ['groupRoutineDetail', routineId],
        });
        queryClient.invalidateQueries({
          queryKey: ['infiniteGroupRoutines'],
        });
      },
      onError: (error) => {
        console.error('🔍 단체 루틴 가입 실패:', error);
        setJoinModalVisible(false);
      },
    });
  };

  const handleMenuPress = () => {
    // joined가 true가 아닌 경우 아무 동작도 하지 않음
    if (!isJoined) {
      return;
    }
    setIsMenuVisible(!isMenuVisible);
  };

  const handleEditRoutine = () => {
    setIsMenuVisible(false);
    setIsEditRoutineModalVisible(true);
  };

  const handleConfirmEditRoutine = () => {
    setIsEditRoutineModalVisible(false);
    navigation.navigate('CreateGroupRoutine', {
      mode: 'edit',
      routineData: {
        id: routine.id,
        title: routine.title,
        description: routine.description,
        routineType: routine.routineType,
        startTime: routine.timeRange.split(' - ')[0],
        endTime: routine.timeRange.split(' - ')[1],
        dayTypes: routine.selectedDays,
      },
    });
  };

  const handleCancelEditRoutine = () => {
    setIsEditRoutineModalVisible(false);
  };

  // 루틴 완료 상태 확인 (progressText에서 퍼센트 추출)
  const isRoutineCompleted = (() => {
    const progressMatch = routine.progressText.match(/(\d+)%/);
    return progressMatch ? parseInt(progressMatch[1]) === 100 : false;
  })();

  const handleEditRoutineDetail = () => {
    setIsMenuVisible(false);
    setIsEditRoutineDetailModalVisible(true);
  };

  const handleConfirmEditRoutineDetail = () => {
    setIsEditRoutineDetailModalVisible(false);
    const routineInfos = routineDetailData?.result?.routineInfos || [];

    navigation.navigate('CreateGroupRoutineDetail', {
      mode: 'edit',
      routineData: {
        groupRoutineListId: routine.id,
        id: routine.id,
        title: routine.title,
        description: routine.description,
        routineType: routine.routineType,
        startTime: routine.timeRange.split(' - ')[0],
        endTime: routine.timeRange.split(' - ')[1],
        dayTypes: routine.selectedDays,
        routines: routineInfos,
      },
    });
  };

  const handleCancelEditRoutineDetail = () => {
    setIsEditRoutineDetailModalVisible(false);
  };

  const handleSaveRoutineDetail = () => {
    setIsEditMode(false);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleDeleteRoutine = () => {
    setIsMenuVisible(false);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    deleteGroupRoutine(routine.id, {
      onSuccess: () => {
        setIsDeleteModalVisible(false);
        navigation.navigate('Result', {
          type: 'success',
          title: '단체 루틴 삭제 완료',
          description: '단체 루틴이 성공적으로 삭제되었습니다.',
          nextScreen: 'HomeMain',
        });
      },
      onError: (error) => {
        console.error('🔍 단체 루틴 삭제 실패:', error);
        setIsDeleteModalVisible(false);
      },
    });
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  const [isLeaveModalVisible, setIsLeaveModalVisible] = useState(false);

  const handleLeaveRoutine = () => {
    if (routine.isAdmin) {
      setIsMenuVisible(false);
      return;
    }

    if (!isJoined) {
      setIsMenuVisible(false);
      return;
    }

    setIsMenuVisible(false);
    setIsLeaveModalVisible(true);
  };

  const handleConfirmLeave = () => {
    leaveGroupRoutine(routine.id, {
      onSuccess: () => {
        setIsJoined(false);
        setUserRole(null);
        setIsLeaveModalVisible(false);

        queryClient.invalidateQueries({
          queryKey: ['groupRoutineDetail', routineId],
        });
        queryClient.invalidateQueries({
          queryKey: ['infiniteGroupRoutines'],
        });

        // Alert 제거 - 토스트나 다른 UI 컴포넌트로 대체 예정
        console.log('나가기 완료: 단체 루틴에서 성공적으로 나갔습니다.');
        navigation.reset({
          index: 0,
          routes: [{ name: 'GroupBoard' }],
        });
      },
      onError: (error: any) => {
        console.error('🔍 단체 루틴 나가기 실패:', error);
        setIsLeaveModalVisible(false);

        let errorMessage = '단체 루틴 나가기에 실패했습니다.';
        if (error.response?.status === 403) {
          errorMessage = '권한이 없습니다. 방장은 나갈 수 없습니다.';
        } else if (error.response?.status === 404) {
          errorMessage = '단체 루틴을 찾을 수 없습니다.';
        }

        // Alert 제거 - 토스트나 다른 UI 컴포넌트로 대체 예정
        console.error('나가기 실패:', errorMessage);
      },
    });
  };

  const handleCancelLeave = () => {
    setIsLeaveModalVisible(false);
  };

  // 루틴 아이템 토글 함수
  const handleTaskToggle = (index: number) => {
    const routineInfos = routineDetailData?.result?.routineInfos || [];
    const task = routineInfos[index];

    if (!task) {
      console.error('🔍 루틴 아이템을 찾을 수 없습니다:', index);
      return;
    }

    // 오늘 날짜인지 확인
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식

    // 단체 루틴의 선택된 요일 확인
    const groupRoutineInfo = routineDetailData?.result?.groupRoutineInfo;
    const selectedDays = groupRoutineInfo?.dayOfWeek || [];

    // 오늘 요일이 선택된 요일에 포함되는지 확인
    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
    const dayIndex = today.getDay();
    // getDay()는 0(일요일)부터 6(토요일)까지 반환하므로 매핑 필요
    const mappedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // 일요일(0) -> 6, 월요일(1) -> 0
    const todayDay = dayNames[mappedIndex];

    const isTodayInSelectedDays = selectedDays.includes(todayDay);

    if (!isTodayInSelectedDays) {
      // Alert 제거 - 토스트나 다른 UI 컴포넌트로 대체 예정
      console.log('알림: 오늘 날짜에 해당하는 루틴이 아닙니다.');
      return;
    }

    // 현재 상태의 반대값으로 업데이트
    const newStatus = !task.isCompleted;

    // 즉시 UI 업데이트를 위해 로컬 상태 먼저 변경
    queryClient.setQueryData(
      ['groupRoutineDetail', routineId],
      (oldData: any) => {
        if (!oldData?.result) return oldData;

        const updatedRoutineInfos = [...oldData.result.routineInfos];
        updatedRoutineInfos[index] = {
          ...updatedRoutineInfos[index],
          isCompleted: newStatus,
        };

        return {
          ...oldData,
          result: {
            ...oldData.result,
            routineInfos: updatedRoutineInfos,
          },
        };
      },
    );

    updateGroupRoutineStatus.mutate(
      {
        groupRoutineListId: routineId,
        routineId: task.id.toString(),
        data: { status: newStatus },
      },
      {
        onSuccess: () => {
          console.log('🔍 루틴 상태 업데이트 성공:', task.name, newStatus);

          // 로컬 상태에서 모든 세부 루틴 완료 여부 확인
          const currentData = queryClient.getQueryData([
            'groupRoutineDetail',
            routineId,
          ]) as any;
          if (currentData?.result) {
            const routineInfos = currentData.result.routineInfos || [];
            const allCompleted =
              routineInfos.length > 0 &&
              routineInfos.every((r: any) => r.isCompleted);

            // 전체 기록 업데이트 API 호출 (완료/미완료 상태에 관계없이)
            updateGroupRoutineRecord.mutate(
              {
                groupRoutineListId: routineId,
                data: { status: allCompleted },
              },
              {
                onSuccess: () => {
                  console.log('🔍 전체 기록 업데이트 성공');
                  // 홈 화면과 단체 게시판 화면의 데이터도 업데이트
                  queryClient.invalidateQueries({
                    queryKey: ['myGroupRoutines'],
                  });
                  queryClient.invalidateQueries({
                    queryKey: ['groupRoutines'],
                  });
                  // 단체 루틴 상세 데이터도 다시 조회하여 참여자 목록 업데이트
                  queryClient.invalidateQueries({
                    queryKey: ['groupRoutineDetail', routineId],
                  });
                },
                onError: (error: any) => {
                  console.error('🔍 전체 기록 업데이트 실패:', error);
                  // 422 에러는 무시 (이미 완료된 상태)
                  if (error?.response?.status !== 422) {
                    console.error('🔍 예상치 못한 에러:', error);
                  }
                },
              },
            );
          }
        },
        onError: (error) => {
          console.error('🔍 루틴 상태 업데이트 실패:', error);
          // Alert 제거 - 토스트나 다른 UI 컴포넌트로 대체 예정
          console.log('오류: 루틴 상태 업데이트에 실패했습니다.');

          // 실패 시 로컬 상태 롤백
          queryClient.setQueryData(
            ['groupRoutineDetail', routineId],
            (oldData: any) => {
              if (!oldData?.result) return oldData;

              const updatedRoutineInfos = [...oldData.result.routineInfos];
              updatedRoutineInfos[index] = {
                ...updatedRoutineInfos[index],
                isCompleted: !newStatus,
              };

              return {
                ...oldData,
                result: {
                  ...oldData.result,
                  routineInfos: updatedRoutineInfos,
                },
              };
            },
          );
        },
      },
    );
  };

  // 로딩 상태 처리
  if (isRoutineDetailLoading) {
    return (
      <Container edges={['top', 'left', 'right']}>
        <Header title="단체 루틴" onBackPress={handleBack} />
        <LoadingContainer></LoadingContainer>
      </Container>
    );
  }

  // 에러 상태 처리
  if (routineDetailError) {
    return (
      <Container edges={['top', 'left', 'right']}>
        <Header title="단체 루틴" onBackPress={handleBack} />
        <ErrorContainer>
          <ErrorText>데이터를 불러오는데 실패했습니다.</ErrorText>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container edges={['top', 'left', 'right']}>
      <Header
        title={isEditMode ? '상세 루틴 수정' : '단체 루틴'}
        onBackPress={isEditMode ? handleCancelEdit : handleBack}
        rightComponent={
          isEditMode ? (
            <SaveButton onPress={handleSaveRoutineDetail}>
              <SaveText>저장</SaveText>
            </SaveButton>
          ) : undefined
        }
      />
      <ScrollContent
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        {/* 루틴 헤더 카드 - RoutineCard 활용 */}
        <RoutineCardContainer>
          <RoutineCard
            progress={
              routine.tasks.length > 0
                ? Math.round(
                    (routine.tasks.filter((t) => t.isCompleted).length /
                      routine.tasks.length) *
                      100,
                  )
                : 0
            }
            title={routine.title}
            description={routine.description}
            timeRange={routine.timeRange}
            selectedDays={routine.selectedDays}
            completedDays={routine.completedDays}
            onPress={() => {}}
            onMorePress={handleMenuPress}
            showProgress={false}
            activeOpacity={1}
          />
        </RoutineCardContainer>

        {/* 해야할 루틴 섹션 */}
        <SectionCard>
          <RoutineListContainer>
            <SectionHeader>해야할 루틴</SectionHeader>
            {routine.tasks.map((task, index) => (
              <RoutineItemRow key={index}>
                <TaskIcon>
                  {task.icon.startsWith('http') ? (
                    <SvgImage uri={task.icon} width={20} height={20} />
                  ) : (
                    task.icon
                  )}
                </TaskIcon>
                <TaskContent>
                  <TaskTitle>{task.title}</TaskTitle>
                </TaskContent>
                <TaskDuration>{task.duration}</TaskDuration>
                {isJoined && (
                  <TaskStatus onPress={() => handleTaskToggle(index)}>
                    {task.isCompleted ? (
                      <CompletedCheckbox>
                        <CompletedCheckmark>✓</CompletedCheckmark>
                      </CompletedCheckbox>
                    ) : (
                      <UncompletedCheckbox />
                    )}
                  </TaskStatus>
                )}
              </RoutineItemRow>
            ))}
            {isEditMode && (
              <AddTemplateButton
                onPress={() => setIsTemplateModalVisible(true)}
              >
                <AddTemplateText>+ 템플릿 추가</AddTemplateText>
              </AddTemplateButton>
            )}
          </RoutineListContainer>
        </SectionCard>

        {/* 참여자 섹션 */}
        <SectionCard>
          <ParticipantsContainer>
            <ParticipantsHeader></ParticipantsHeader>
            <ParticipantsContent>
              {isJoined ? (
                <>
                  {/* 완료 참여자 */}
                  <CompletedSection>
                    <CompletedHeader>
                      <CompletedTitle>완료</CompletedTitle>
                      <CompletedCountContainer>
                        <CompletedIcon
                          source={require('../../assets/images/person.png')}
                        />
                        <CompletedCountText>
                          {routine.completedCount}
                        </CompletedCountText>
                      </CompletedCountContainer>
                    </CompletedHeader>
                    <CompletedAvatarContainer>
                      <CompletedAvatarRow
                        horizontal
                        showsHorizontalScrollIndicator={false}
                      >
                        {routine.completedParticipants
                          .slice(0, 12)
                          .map((uri, idx) => (
                            <AvatarWrapper key={`completed-${idx}`}>
                              <Avatar
                                source={
                                  uri
                                    ? { uri }
                                    : require('../../assets/images/default_profile.png')
                                }
                                defaultSource={require('../../assets/images/default_profile.png')}
                                onError={() => {}}
                              />
                            </AvatarWrapper>
                          ))}
                      </CompletedAvatarRow>
                    </CompletedAvatarContainer>
                  </CompletedSection>

                  {/* 미달성 참여자 */}
                  <UnachievedSection>
                    <UnachievedHeader>
                      <UnachievedTitle>미달성</UnachievedTitle>
                      <UnachievedCountContainer>
                        <UnachievedIcon
                          source={require('../../assets/images/person.png')}
                        />
                        <UnachievedCountText>
                          {routine.unachievedCount}
                        </UnachievedCountText>
                      </UnachievedCountContainer>
                    </UnachievedHeader>
                    <UnachievedAvatarContainer>
                      <UnachievedAvatarRow
                        horizontal
                        showsHorizontalScrollIndicator={false}
                      >
                        {routine.unachievedParticipants
                          .slice(0, 12)
                          .map((uri, idx) => (
                            <AvatarWrapper key={`unachieved-${idx}`}>
                              <Avatar
                                source={
                                  uri
                                    ? { uri }
                                    : require('../../assets/images/default_profile.png')
                                }
                                defaultSource={require('../../assets/images/default_profile.png')}
                                onError={() => {}}
                              />
                            </AvatarWrapper>
                          ))}
                      </UnachievedAvatarRow>
                    </UnachievedAvatarContainer>
                  </UnachievedSection>
                </>
              ) : (
                /* 참여하지 않은 경우 - 모든 참여자 표시 */
                <AllParticipantsSection>
                  <AllParticipantsHeader>
                    <AllParticipantsTitle>참여자</AllParticipantsTitle>
                    <AllParticipantsCountContainer>
                      <AllParticipantsIcon
                        source={require('../../assets/images/person.png')}
                      />
                      <AllParticipantsCountText>
                        {routine.allParticipants.length}
                      </AllParticipantsCountText>
                    </AllParticipantsCountContainer>
                  </AllParticipantsHeader>
                  <AllParticipantsAvatarContainer>
                    <AllParticipantsAvatarRow
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      {routine.allParticipants.slice(0, 12).map((uri, idx) => (
                        <AvatarWrapper key={`all-${idx}`}>
                          <Avatar
                            source={
                              uri
                                ? { uri }
                                : require('../../assets/images/default_profile.png')
                            }
                            defaultSource={require('../../assets/images/default_profile.png')}
                            onError={() => {}}
                          />
                        </AvatarWrapper>
                      ))}
                    </AllParticipantsAvatarRow>
                  </AllParticipantsAvatarContainer>
                </AllParticipantsSection>
              )}
            </ParticipantsContent>
          </ParticipantsContainer>
        </SectionCard>
      </ScrollContent>

      {/* 하단 고정 버튼 */}
      {!isJoined && !routine.isAdmin ? (
        <FixedJoinCta>
          <JoinButton onPress={handleJoin} disabled={isJoining}>
            <JoinText>{isJoining ? '가입 중...' : '단체루틴 참여'}</JoinText>
          </JoinButton>
        </FixedJoinCta>
      ) : isJoined ? (
        <FixedJoinCta>
          <JoinButton onPress={() => setIsGuestbookModalVisible(true)}>
            <JoinText>방명록</JoinText>
          </JoinButton>
        </FixedJoinCta>
      ) : null}


      {/* 참여 확인 모달 */}
      <BottomSheetDialog
        visible={isJoinModalVisible}
        onRequestClose={handleCloseJoinModal}
      >
        <ModalTitle>단체루틴에 참여하시겠습니까?</ModalTitle>
        <ModalSubtitle>방장이 루틴을 수정시 루틴이 변경됩니다.</ModalSubtitle>

        <ButtonRow>
          <ButtonWrapper>
            <CustomButton
              text="취소"
              onPress={handleCloseJoinModal}
              backgroundColor={theme.colors.gray200}
              textColor={theme.colors.gray700}
            />
          </ButtonWrapper>
          <ButtonWrapper>
            <CustomButton
              text={isJoining ? '가입 중...' : '참여하기'}
              onPress={handleConfirmJoin}
              backgroundColor={theme.colors.primary}
              textColor={theme.colors.white}
              disabled={isJoining}
            />
          </ButtonWrapper>
        </ButtonRow>
      </BottomSheetDialog>

      {/* 더보기 시트 */}
      <BottomSheetDialog
        visible={isMenuVisible}
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <MoreSheetContainer>
          {routine.isAdmin ? (
            <>
              <MoreButton onPress={handleEditRoutine}>
                <MoreButtonText>루틴 수정</MoreButtonText>
              </MoreButton>
              <MoreButton
                onPress={handleEditRoutineDetail}
                disabled={isRoutineCompleted}
                style={{ opacity: isRoutineCompleted ? 0.5 : 1 }}
              >
                <MoreButtonText
                  style={{
                    color: isRoutineCompleted
                      ? theme.colors.gray500
                      : theme.colors.gray900,
                  }}
                >
                  상세 루틴 수정
                </MoreButtonText>
              </MoreButton>
              <DeleteButton onPress={handleDeleteRoutine}>
                <DeleteButtonText>삭제</DeleteButtonText>
              </DeleteButton>
            </>
          ) : (
            <DeleteButton onPress={handleLeaveRoutine}>
              <DeleteButtonText>단체 루틴 나가기</DeleteButtonText>
            </DeleteButton>
          )}
        </MoreSheetContainer>
      </BottomSheetDialog>

      {/* 삭제 확인 모달 */}
      <BottomSheetDialog
        visible={isDeleteModalVisible}
        onRequestClose={handleCancelDelete}
      >
        <ModalTitle>단체 루틴 삭제</ModalTitle>
        <ModalSubtitle>
          정말 해당 루틴을 삭제하시겠습니까?{'\n'}
          삭제 시{' '}
          <ModalSubtitleHighlight>모든 참여자들의</ModalSubtitleHighlight>{' '}
          루틴에서도 삭제됩니다.
        </ModalSubtitle>

        <ButtonRow>
          <ButtonWrapper>
            <CustomButton
              text="취소"
              onPress={handleCancelDelete}
              backgroundColor={theme.colors.gray200}
              textColor={theme.colors.gray700}
            />
          </ButtonWrapper>
          <ButtonWrapper>
            <CustomButton
              text="삭제"
              onPress={handleConfirmDelete}
              backgroundColor={theme.colors.error}
              textColor={theme.colors.white}
              disabled={isDeleting}
            />
          </ButtonWrapper>
        </ButtonRow>
      </BottomSheetDialog>

      {/* 단체 루틴 수정 확인 모달 */}
      <BottomSheetDialog
        visible={isEditRoutineModalVisible}
        onRequestClose={handleCancelEditRoutine}
      >
        <ModalTitle>단체 루틴 수정</ModalTitle>
        <ModalSubtitle>
          정말 해당 루틴을 수정하시겠습니까?{'\n'}
          수정 시{' '}
          <ModalSubtitleHighlight>모든 참여자들의</ModalSubtitleHighlight>{' '}
          루틴에서도 수정됩니다.
        </ModalSubtitle>

        <ButtonRow>
          <ButtonWrapper>
            <CustomButton
              text="취소"
              onPress={handleCancelEditRoutine}
              backgroundColor={theme.colors.gray200}
              textColor={theme.colors.gray700}
            />
          </ButtonWrapper>
          <ButtonWrapper>
            <CustomButton
              text="수정"
              onPress={handleConfirmEditRoutine}
              backgroundColor={theme.colors.primary}
              textColor={theme.colors.white}
            />
          </ButtonWrapper>
        </ButtonRow>
      </BottomSheetDialog>

      {/* 단체 루틴 상세 수정 확인 모달 */}
      <BottomSheetDialog
        visible={isEditRoutineDetailModalVisible}
        onRequestClose={handleCancelEditRoutineDetail}
      >
        <ModalTitle>단체 루틴 상세 수정</ModalTitle>
        <ModalSubtitle>
          정말 해당 루틴을 수정하시겠습니까?{'\n'}
          수정 시{' '}
          <ModalSubtitleHighlight>모든 참여자들의</ModalSubtitleHighlight>{' '}
          루틴에서도 수정됩니다.
        </ModalSubtitle>

        <ButtonRow>
          <ButtonWrapper>
            <CustomButton
              text="취소"
              onPress={handleCancelEditRoutineDetail}
              backgroundColor={theme.colors.gray200}
              textColor={theme.colors.gray700}
            />
          </ButtonWrapper>
          <ButtonWrapper>
            <CustomButton
              text="수정"
              onPress={handleConfirmEditRoutineDetail}
              backgroundColor={theme.colors.primary}
              textColor={theme.colors.white}
            />
          </ButtonWrapper>
        </ButtonRow>
      </BottomSheetDialog>

      {/* 단체 루틴 나가기 확인 모달 */}
      <BottomSheetDialog
        visible={isLeaveModalVisible}
        onRequestClose={handleCancelLeave}
      >
        <ModalTitle>단체 루틴 나가기</ModalTitle>
        <ModalSubtitle>
          정말 해당 루틴에서 나가시겠습니까?{'\n'}
          나가기 시{' '}
          <ModalSubtitleHighlight>
            다시 참여할 수 없습니다.
          </ModalSubtitleHighlight>
        </ModalSubtitle>

        <ButtonRow>
          <ButtonWrapper>
            <CustomButton
              text="취소"
              onPress={handleCancelLeave}
              backgroundColor={theme.colors.gray200}
              textColor={theme.colors.gray700}
            />
          </ButtonWrapper>
          <ButtonWrapper>
            <CustomButton
              text="나가기"
              onPress={handleConfirmLeave}
              backgroundColor={theme.colors.error}
              textColor={theme.colors.white}
              disabled={isLeaving}
            />
          </ButtonWrapper>
        </ButtonRow>
      </BottomSheetDialog>

      {/* 방명록 모달 */}
      <GuestbookModal
        isVisible={isGuestbookModalVisible}
        onClose={() => setIsGuestbookModalVisible(false)}
        groupRoutineListId={routine.id}
      />

      {/* 템플릿 선택 모달 */}
      <RoutineSuggestionModal
        visible={isTemplateModalVisible}
        onRequestClose={() => setIsTemplateModalVisible(false)}
        onRoutineSelect={(template) => {
          setIsTemplateModalVisible(false);
        }}
        emojis={emojisData?.result?.items || []}
        isLoading={isLoadingEmojis}
      />

      {/* 룰렛 버튼 - 우하단 고정 */}
      <RouletteButton
        // tickets={userTickets}
        onPointsEarned={handlePointsEarned}
        isSpinning={isSpinning}
        participants={[
          { id: '1', value: 10},
          { id: '2', value: 20 },
          { id: '3', value: 30 },
          { id: '4', value: 40 },
          { id: '5', value: 50 },
          { id: '6', value: 60 }
        ]}
      />

    </Container>
  );
};

export default GroupRoutineDetailScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const ScrollContent = styled.ScrollView`
  flex: 1;
`;

const RoutineCardContainer = styled.View`
  /* margin-bottom: 16px; */
`;

const SectionCard = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  margin-bottom: 16px;
`;

const SectionHeader = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 12px;
  color: #98989e;
  margin-bottom: 16px;
`;

const RoutineListContainer = styled.View`
  background-color: ${theme.colors.gray50};
  border-radius: 8px;
  padding: 12px;
  gap: 8px;
`;

const RoutineItemRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px;
  background-color: ${theme.colors.white};
  border-radius: 8px;
  /* min-height: 48px; */
`;

const ItemList = styled.View`
  gap: 8px;
`;

const ItemRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px;
  background-color: ${theme.colors.gray50};
  border-radius: 8px;
`;

const TaskIcon = styled.View`
  margin-right: 12px;
  align-self: center;
  justify-content: center;
  align-items: center;
`;

const TaskContent = styled.View`
  flex: 1;
  justify-content: center;
  align-items: flex-start;
`;

const TaskTitle = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.gray800};
  line-height: 20px;
`;

const TaskDuration = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 12px;
  color: ${theme.colors.gray600};
  margin-left: 8px;
  align-self: center;
`;

const TaskStatus = styled.TouchableOpacity`
  margin-left: 8px;
  align-self: center;
`;

const CompletedCheckbox = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: ${theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

const CompletedCheckmark = styled.Text`
  font-size: 12px;
  color: ${theme.colors.white};
  font-weight: bold;
`;

const UncompletedCheckbox = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border: 2px solid ${theme.colors.gray300};
  background-color: ${theme.colors.white};
`;

const CompletedIcon = styled(Image)`
  width: 20px;
  height: 20px;
  tint-color: ${theme.colors.primary};
  resize-mode: contain;
`;

const UncompletedIcon = styled.Text`
  font-size: 16px;
  color: ${theme.colors.gray400};
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const LoadingText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 16px;
  color: ${theme.colors.gray500};
`;

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ErrorText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 16px;
  color: ${theme.colors.error};
`;

const SaveButton = styled.TouchableOpacity`
  padding: 8px 16px;
  background-color: ${theme.colors.primary};
  border-radius: 8px;
`;

const SaveText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.white};
`;

const ParticipantsContainer = styled.View`
  flex-direction: column;
`;

const ParticipantsHeader = styled.View``;

const ParticipantsTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 12px;
  color: #98989e;
`;

const ParticipantsContent = styled.View`
  flex-direction: column;
  gap: 16px;
`;

const CompletedSection = styled.View`
  background-color: ${theme.colors.gray50};
  border-radius: 8px;
  padding: 12px;
  min-height: 120px;
`;

const UnachievedSection = styled.View`
  background-color: ${theme.colors.gray50};
  border-radius: 8px;
  padding: 12px;
  min-height: 120px;
`;

const CompletedHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const CompletedTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 12px;
  color: #98989e;
`;

const CompletedCountContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 2px;
`;

const CompletedCountText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.gray600};
  margin-left: 6px;
`;

const CompletedAvatarRow = styled.ScrollView``;

const CompletedAvatarContainer = styled.View`
  border-radius: 8px;
  padding: 12px 16px;
`;

const UnachievedHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const UnachievedTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 12px;
  color: #98989e;
`;

const UnachievedCountContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 2px;
`;

const UnachievedIcon = styled(Image)`
  width: 20px;
  height: 20px;
  tint-color: ${theme.colors.gray600};
  resize-mode: contain;
`;

const UnachievedCountText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.gray600};
  margin-left: 4px;
`;

const UnachievedAvatarRow = styled.ScrollView``;

const UnachievedAvatarContainer = styled.View`
  border-radius: 8px;
  padding: 12px 16px;
`;

// 참여하지 않은 경우의 스타일 컴포넌트들
const AllParticipantsSection = styled.View`
  background-color: ${theme.colors.gray50};
  border-radius: 8px;
  padding: 12px;
  min-height: 120px;
`;

const AllParticipantsHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const AllParticipantsTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 12px;
  color: #98989e;
`;

const AllParticipantsCountContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 2px;
`;

const AllParticipantsIcon = styled(Image)`
  width: 20px;
  height: 20px;
  tint-color: ${theme.colors.gray600};
  resize-mode: contain;
`;

const AllParticipantsCountText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.gray600};
  margin-left: 6px;
`;

const AllParticipantsAvatarRow = styled.ScrollView``;

const AllParticipantsAvatarContainer = styled.View`
  border-radius: 8px;
  padding: 12px 16px;
`;

const AvatarWrapper = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  overflow: hidden;
  margin-right: 8px;
`;

const Avatar = styled(Image)`
  width: 100%;
  height: 100%;
`;

const FixedJoinCta = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: ${theme.colors.white};
`;

const JoinButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${(props) =>
    props.disabled ? theme.colors.gray300 : theme.colors.primary};
  border-radius: 12px;
  padding: 16px;
  align-items: center;
`;

const JoinText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.white};
`;

const AddTemplateButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: ${theme.colors.gray50};
  border: 2px dashed ${theme.colors.gray300};
  border-radius: 8px;
  margin-top: 8px;
`;

const AddTemplateText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.gray600};
`;

// Modal Styles
const ModalTitle = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 18px;
  color: ${theme.colors.gray900};
  text-align: center;
`;

const ModalSubtitle = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 13px;
  color: ${theme.colors.gray600};
  text-align: center;
  margin-top: 8px;
`;

const ModalSubtitleHighlight = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 13px;
  color: ${theme.colors.error};
  text-align: center;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-top: 20px;
`;

const ButtonWrapper = styled.View`
  flex: 1;
`;

const ModalContainer = styled.View`
  padding: 20px;
`;

const ModalButtonWrapper = styled.View`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

// 더보기 시트 스타일
const MoreSheetContainer = styled.View`
  gap: 12px;
  padding: 0;
`;

const MoreButton = styled.TouchableOpacity`
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray300};
  border-radius: 12px;
  padding: 16px;
  align-items: center;
`;

const MoreButtonText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  font-weight: 500;
  color: #5c5d61;
  text-align: center;
  line-height: 22px;
`;

const DeleteButton = styled.TouchableOpacity`
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.error};
  border-radius: 12px;
  padding: 16px;
  align-items: center;
`;

const DeleteButtonText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  font-weight: 500;
  color: ${theme.colors.error};
  text-align: center;
  line-height: 22px;
`;

// 룰렛 관련 스타일 컴포넌트들
