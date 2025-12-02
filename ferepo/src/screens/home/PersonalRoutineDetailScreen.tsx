import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { BackHandler, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import BottomSheetDialog from '../../components/common/BottomSheetDialog';
import CustomButton from '../../components/common/CustomButton';
import {
  DayButton,
  RoutineItemAdder,
  DayOfWeekSelector,
  EmojiPickerModal,
  RoutineSuggestionModal,
  DeleteRoutineModal,
} from '../../components/domain/routine';
import {
  useRoutineTemplates,
  useRoutineEmojis,
} from '../../hooks/routine/common/useCommonRoutines';
import CompletedRoutineItem from '../../components/domain/routine/CompletedRoutineItem';
import { useRoutineStore } from '../../store';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import {
  usePersonalRoutineDetails,
  useDeletePersonalRoutineList,
  useUpdatePersonalRoutineDetail,
  useDeletePersonalRoutineDetail,
} from '../../hooks/routine/personal/usePersonalRoutines';
import { useErrorHandler } from '../../hooks/common/useErrorHandler';

interface PersonalRoutineDetailScreenProps {
  navigation: any;
  route: {
    params?: {
      routineData?: any;
      shouldRefresh?: boolean;
    };
  };
}

const PersonalRoutineDetailScreen = ({
  navigation,
  route,
}: PersonalRoutineDetailScreenProps) => {
  const routineData = route?.params?.routineData;
  const shouldRefresh = route?.params?.shouldRefresh;
  const { setActiveRoutineId, isEditMode, setEditMode } = useRoutineStore();
  const [selectedDays, setSelectedDays] = useState<string[]>(
    routineData?.days || [],
  );
  const [routineItems, setRoutineItems] = useState<
    Array<{
      emoji: string;
      text: string;
      time: string;
      isCompleted: boolean;
    }>
  >([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [currentText, setCurrentText] = useState<string>('');
  const [moreSheetVisible, setMoreSheetVisible] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [routineSuggestionVisible, setRoutineSuggestionVisible] =
    useState(false);

  const {
    data: existingRoutinesData,
    isLoading: isLoadingExistingRoutines,
    refetch: refetchRoutineDetails,
  } = usePersonalRoutineDetails(routineData?.id?.toString() || '', {
    date: (() => {
      const today = new Date();
      const koreaTime = new Date(today.getTime() + 9 * 60 * 60 * 1000);
      return `${koreaTime.getFullYear()}-${String(koreaTime.getMonth() + 1).padStart(2, '0')}-${String(koreaTime.getDate()).padStart(2, '0')}`;
    })(),
  });

  useFocusEffect(
    useCallback(() => {
      refetchRoutineDetails();
      
      // 수정된 루틴 데이터가 있으면 로컬 상태도 업데이트
      if (routineData?.days) {
        setSelectedDays(routineData.days);
      }
      
      // shouldRefresh 플래그가 있으면 강제로 데이터 새로고침
      if (shouldRefresh) {
        console.log('🔍 루틴 수정 완료 후 데이터 새로고침');
        // 약간의 지연을 두고 다시 한번 새로고침
        setTimeout(() => {
          refetchRoutineDetails();
        }, 100);
      }
    }, [refetchRoutineDetails, routineData?.days, shouldRefresh]),
  );

  const { mutate: deleteRoutine } = useDeletePersonalRoutineList();

  const { mutate: updateRoutineDetail, isPending: isUpdating } =
    useUpdatePersonalRoutineDetail();

  const { mutate: deleteRoutineDetail } = useDeletePersonalRoutineDetail();
  
  // 에러 처리 훅
  const { handleAndShowError } = useErrorHandler();

  const { data: templatesData, isLoading: isLoadingTemplates } =
    useRoutineTemplates({
      category: 'LIFE', // 기본적으로 생활 카테고리 템플릿 조회
      page: 0,
      size: 50,
    });

  const { data: emojisData, isLoading: isLoadingEmojis } = useRoutineEmojis();

  // 디버깅용 로그
  useEffect(() => {
    console.log('🔍 PersonalRoutineDetailScreen - 데이터 로딩 상태:', {
      templatesData: templatesData?.result?.items?.length || 0,
      emojisData: emojisData?.result?.items?.length || 0,
      isLoadingTemplates,
      isLoadingEmojis,
    });
  }, [templatesData, emojisData, isLoadingTemplates, isLoadingEmojis]);

  const handleDeleteRoutine = () => {
    closeMoreSheet();
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (!routineData?.id) {
      return;
    }

    deleteRoutine(routineData.id.toString(), {
      onSuccess: () => {
        setDeleteModalVisible(false);
        navigation.goBack();
      },
      onError: (error) => {
        console.log('삭제 실패: 루틴 삭제에 실패했습니다.');
      },
    });
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
  };

  // 루틴 완료 상태 확인 (백엔드에서 percent로 받아옴)
  const isRoutineCompleted = routineData?.percent === 100;

  useEffect(() => {
    setEditMode(false);
  }, [setEditMode]);

  useEffect(() => {
    if (
      existingRoutinesData?.result &&
      existingRoutinesData.result.length > 0
    ) {
      const sortedRoutines = [...existingRoutinesData.result].sort((a, b) => {
        return a.routineId - b.routineId;
      });

      const existingItems = sortedRoutines.map((routine: any) => {
        const isCompleted = routine.isCompleted || routine.completed || false;

        return {
          emoji: routine.emojiUrl,
          text: routine.routineName,
          time: `${routine.time}분`,
          isCompleted: isCompleted,
        };
      });

      setRoutineItems(existingItems);
    } else if (
      existingRoutinesData?.result &&
      existingRoutinesData.result.length === 0
    ) {
      setRoutineItems([]);
    }
  }, [existingRoutinesData]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isEditMode) {
          setEditMode(false);
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [isEditMode]),
  );

  const handleBack = () => {
    if (isEditMode) {
      setEditMode(false);
    } else {
      navigation.goBack();
    }
  };

  const handleDayPress = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handlePlusPress = () => {
    setRoutineSuggestionVisible(true);
  };

  const handleClockPress = () => {
    setRoutineSuggestionVisible(true);
  };

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
  };

  const handleTextChange = (text: string) => {
    setCurrentText(text);
  };

  const handleTextPress = () => {
    setRoutineSuggestionVisible(true);
  };

  const handleEditItem = (index: number) => {
    const item = routineItems[index];
    setEditingIndex(index);
    setSelectedEmoji(item.emoji);
    setCurrentText(item.text);
    setSelectedTime(item.time);
  };

  const handleCompleteEdit = () => {
    if (selectedEmoji && currentText && selectedTime) {
      if (editingIndex !== null) {
        const updatedItems = [...routineItems];
        updatedItems[editingIndex] = {
          emoji: selectedEmoji,
          text: currentText,
          time: selectedTime,
          isCompleted: false,
        };
        setRoutineItems(updatedItems);
        setEditingIndex(null);
      } else {
        const newItem = {
          emoji: selectedEmoji,
          text: currentText,
          time: selectedTime,
          isCompleted: false,
        };
        setRoutineItems([...routineItems, newItem]);
      }

      setSelectedEmoji('');
      setCurrentText('');
      setSelectedTime('');
    }
  };

  useEffect(() => {
    if (selectedEmoji && currentText && selectedTime) {
      handleCompleteEdit();
    }
  }, [selectedEmoji, currentText, selectedTime]);

  const handleDeleteItem = (index: number) => {
    const itemToDelete = routineItems[index];
    const existingRoutines = existingRoutinesData?.result || [];

    const existingRoutine = existingRoutines.find(
      (existing: any) =>
        existing.routineName === itemToDelete.text &&
        existing.time === parseInt(itemToDelete.time.replace('분', '')) &&
        existing.emojiUrl === itemToDelete.emoji,
    );

    if (existingRoutine) {
      deleteRoutineDetail(existingRoutine.routineId.toString(), {
        onSuccess: () => {
          const updatedItems = routineItems.filter((_, i) => i !== index);
          setRoutineItems(updatedItems);
        },
        onError: (error) => {
          // Alert 제거 - 토스트나 다른 UI 컴포넌트로 대체 예정
          console.log('삭제 실패: 루틴 삭제에 실패했습니다.');
        },
      });
    } else {
      const updatedItems = routineItems.filter((_, i) => i !== index);
      setRoutineItems(updatedItems);
    }
  };

  const handleRoutineSuggestionSelect = (routine: any) => {
    const newItem = {
      emoji: routine.icon,
      text: routine.title,
      time: selectedTime || '30분',
      isCompleted: false,
    };
    setRoutineItems([...routineItems, newItem]);

    setSelectedEmoji('');
    setCurrentText('');
    setSelectedTime('');
  };

  const handleRoutineSuggestionClose = () => {
    setRoutineSuggestionVisible(false);
  };

  const handleSave = () => {
    if (!routineData?.id) {
      return;
    }

    const existingRoutines = existingRoutinesData?.result || [];

    const getEmojiId = (emojiUrl: string) => {
      let emojiId = 1;
      if (emojisData?.result?.items) {
        const emoji = emojisData.result.items.find(
          (e: any) => e.emojiUrl === emojiUrl,
        );
        if (emoji) {
          emojiId = emoji.emojiId;
        }
      }
      return emojiId;
    };

    const updateRoutine: any[] = [];
    const makeRoutine: any[] = [];

    routineItems.forEach((item, index) => {
      if (index < existingRoutines.length) {
        const existingRoutine = existingRoutines[index];
        updateRoutine.push({
          id: existingRoutine.routineId,
          routineName: item.text,
          emojiId: getEmojiId(item.emoji),
          time: parseInt(item.time.replace('분', '')),
        });
      } else {
        makeRoutine.push({
          routineName: item.text,
          emojiId: getEmojiId(item.emoji),
          time: parseInt(item.time.replace('분', '')),
        });
      }
    });

    const deletedRoutines = existingRoutines.slice(routineItems.length);

    const deletePromises = deletedRoutines.map(
      (routine: any) =>
        new Promise((resolve, reject) => {
          deleteRoutineDetail(routine.routineId.toString(), {
            onSuccess: () => resolve(routine.routineId),
            onError: (error) => reject(error),
          });
        }),
    );

    // 삭제 완료 후 업데이트 및 생성
    Promise.all(deletePromises)
      .then(() => {
        if (updateRoutine.length > 0 || makeRoutine.length > 0) {
          updateRoutineDetail(
            {
              myRoutineListId: routineData.id.toString(),
              data: {
                updateRoutine: updateRoutine,
                makeRoutine: makeRoutine,
              },
            },
            {
              onSuccess: () => {
                setEditMode(false);
                refetchRoutineDetails();
              },
              onError: (error) => {
                console.error('🔍 루틴 수정 실패:', error);
                handleAndShowError(error, '루틴 수정 실패');
              },
            },
          );
        } else {
          setEditMode(false);
          refetchRoutineDetails();
        }
      })
      .catch((error) => {
        console.error('🔍 루틴 수정 실패:', error);
        handleAndShowError(error, '루틴 수정 실패');
      });
  };

  const handleStartRoutine = () => {
    if (!routineData?.id) {
      return;
    }

    setActiveRoutineId(routineData.id.toString());

    // 성공하지 않은 루틴만 필터링
    const incompleteTasks = routineItems
      .map((item, index) => {
        // 정렬된 순서로 routineId 매칭
        const sortedRoutines = existingRoutinesData?.result
          ? [...existingRoutinesData.result].sort(
              (a, b) => a.routineId - b.routineId,
            )
          : [];
        const matchingRoutine = sortedRoutines[index];

        return {
          icon: item.emoji,
          title: item.text,
          duration: item.time,
          routineId: matchingRoutine?.routineId,
          isCompleted: item.isCompleted,
        };
      })
      .filter((task) => !task.isCompleted); // 성공하지 않은 루틴만 포함

    navigation.navigate('ActiveRoutine', {
      tasks: incompleteTasks,
      routineName: routineData?.name || '루틴',
      routineId: routineData?.id?.toString(),
    });
  };

  const handleMorePress = () => {
    setMoreSheetVisible(true);
  };

  const closeMoreSheet = () => setMoreSheetVisible(false);

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleTaskToggle = (index: number) => {
    // 개인 루틴 토글 로직 구현
    const updatedItems = [...routineItems];
    updatedItems[index] = {
      ...updatedItems[index],
      isCompleted: !updatedItems[index].isCompleted,
    };
    setRoutineItems(updatedItems);
  };

  const handleEditRoutine = () => {
    closeMoreSheet();

    // HomeScreen에서 전달받은 데이터 구조를 CreateRoutineScreen에서 기대하는 구조로 변환
    const data = {
      id: routineData?.id,
      title: routineData?.name || routineData?.title || '루틴 제목',
      routineType: routineData?.category === '생활' ? 'DAILY' : 'FINANCE',
      dayTypes: routineData?.days || selectedDays,
      startTime: routineData?.startTime || '00:00',
      endTime: routineData?.endTime || '00:00',
      startDate:
        routineData?.startDate || new Date().toISOString().split('T')[0],
    };

    navigation.navigate('CreateRoutine', { mode: 'edit', routineData: data });
  };

  const handleEditRoutineDetail = () => {
    closeMoreSheet();
    setEditMode(true);
  };

  // 오늘이 선택된 요일에 포함되는지 확인하는 함수
  const formatTimeWithPeriod = (time: string) => {
    if (!time) return '00:00';

    // HH:mm 형식에서 시간 추출
    const [hour, minute] = time.split(':').map(Number);
    const period = hour < 12 ? '오전' : '오후';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${period} ${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const isTodayInSelectedDays = () => {
    const today = new Date();
    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
    const dayIndex = today.getDay();
    // getDay()는 0(일요일)부터 6(토요일)까지 반환하므로 매핑 필요
    const mappedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // 일요일(0) -> 6, 월요일(1) -> 0
    const todayName = dayNames[mappedIndex];
    return selectedDays.includes(todayName);
  };

  return (
    <Container>
      <Header title="루틴 상세" onBackPress={handleBack} />
      <ScrollContent
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        {/* 루틴 헤더 섹션 */}
        <RoutineCard>
          <HeaderContent>
            <HeaderLeft>
              <RoutineTitle>{routineData?.name || '루틴 제목'}</RoutineTitle>
              <RoutineTime>
                {formatTimeWithPeriod(routineData?.startTime || '00:00')} -{' '}
                {formatTimeWithPeriod(routineData?.endTime || '00:00')}
              </RoutineTime>
            </HeaderLeft>
            <HeaderRight>
              {routineData?.percent !== undefined && (
                <ProgressText>{routineData.percent}%</ProgressText>
              )}
              {!isEditMode && (
                <MoreIconButton onPress={handleMorePress}>
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={20}
                    color={theme.colors.gray600}
                  />
                </MoreIconButton>
              )}
            </HeaderRight>
          </HeaderContent>
          <DayOfWeekSelector
            selectedDays={selectedDays}
            onDaysChange={setSelectedDays}
            readOnly={true}
            buttonSize={40}
            borderRadius={20}
          />

          {/* 새로운 루틴 추가 (수정 모드일 때만) */}
          {isEditMode && editingIndex === null && (
            <AdderContainer>
              <RoutineItemAdder
                onPlusPress={handlePlusPress}
                onClockPress={handleClockPress}
                onTextChange={handleTextChange}
                onTextPress={handleTextPress}
                selectedTime={selectedTime}
                selectedEmoji={selectedEmoji || ''}
                currentText={currentText}
                placeholder="루틴을 추가해주세요"
                editable={isEditMode}
              />
            </AdderContainer>
          )}

          {/* 완성된 루틴 아이템들 */}
          {routineItems.map((item, index) => (
            <AdderContainer key={index}>
              <CompletedRoutineItem
                item={item}
                index={index}
                onEdit={(index, emoji, text, time) => {
                  const updatedItems = [...routineItems];
                  updatedItems[index] = {
                    emoji,
                    text,
                    time,
                    isCompleted: updatedItems[index].isCompleted, // 기존 완료 상태 유지
                  };
                  setRoutineItems(updatedItems);
                }}
                onDelete={handleDeleteItem}
                isEditMode={isEditMode}
              />
            </AdderContainer>
          ))}
        </RoutineCard>
        {/* 루틴 실행/수정 완료 버튼 */}

        <CreateButton
          onPress={isEditMode ? handleSave : handleStartRoutine}
          disabled={
            !isEditMode &&
            (!isTodayInSelectedDays() ||
              routineItems.every((item) => item.isCompleted))
          }
          style={{
            opacity:
              !isEditMode &&
              (!isTodayInSelectedDays() ||
                routineItems.every((item) => item.isCompleted))
                ? 0.5
                : 1,
            backgroundColor:
              !isEditMode &&
              (!isTodayInSelectedDays() ||
                routineItems.every((item) => item.isCompleted))
                ? theme.colors.gray200
                : theme.colors.primary,
          }}
        >
          <CreateButtonText
            style={{
              color:
                !isEditMode &&
                (!isTodayInSelectedDays() ||
                  routineItems.every((item) => item.isCompleted))
                  ? theme.colors.gray400
                  : theme.colors.white,
            }}
          >
            {isEditMode ? '수정 완료' : '루틴 실행하기'}
          </CreateButtonText>
        </CreateButton>
      </ScrollContent>

      <EmojiPickerModal
        visible={emojiPickerVisible}
        onRequestClose={() => setEmojiPickerVisible(false)}
        onEmojiSelect={(emoji) => {
          setSelectedEmoji(emoji);

          // 편집 중인 아이템이 있으면 해당 아이템의 이모지를 업데이트
          if (editingIndex !== null) {
            const updatedItems = [...routineItems];
            updatedItems[editingIndex] = {
              ...updatedItems[editingIndex],
              emoji: emoji,
            };
            setRoutineItems(updatedItems);
          }

          setEmojiPickerVisible(false);
        }}
      />

      <RoutineSuggestionModal
        visible={routineSuggestionVisible}
        onRequestClose={handleRoutineSuggestionClose}
        onRoutineSelect={handleRoutineSuggestionSelect}
        templates={templatesData?.result?.items || []}
        emojis={emojisData?.result?.items || []}
        isLoading={isLoadingTemplates || isLoadingEmojis}
      />

      {/* 더보기 시트 */}
      <BottomSheetDialog
        visible={moreSheetVisible}
        onRequestClose={closeMoreSheet}
      >
        <MoreSheetContainer>
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
        </MoreSheetContainer>
      </BottomSheetDialog>

      <DeleteRoutineModal
        visible={deleteModalVisible}
        onRequestClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        routineName={routineData?.name || routineData?.title}
        isDeleting={false}
      />
    </Container>
  );
};

export default PersonalRoutineDetailScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const ScrollContent = styled(ScrollView)`
  flex: 1;
`;

const RoutineCard = styled.View`
  background-color: ${theme.colors.gray50};
  border-radius: 16px;
  padding: 24px 16px;
  margin-bottom: 16px;
`;

const RoutineTitle = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  font-weight: 500;
  color: #3f3f42;
  margin-bottom: 4px;
`;

const RoutineTime = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 12px;
  color: ${theme.colors.gray500};
  margin-bottom: 16px;
`;

const AdderContainer = styled.View`
  margin-bottom: 10px;
`;

const CreateButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  border-radius: 12px;
  padding: 16px;
  margin: 0;
  align-items: center;
  justify-content: center;
`;

const CreateButtonText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${theme.colors.white};
`;

const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const MoreIconButton = styled.TouchableOpacity`
  padding: 4px;
`;

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

const RoutineHeaderCard = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
`;

const HeaderContent = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const HeaderLeft = styled.View`
  flex: 1;
`;

const HeaderRight = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 0;
`;

const DaySelectorCard = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
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
  font-family: ${theme.fonts.Bold};
  font-size: 16px;
  color: ${theme.colors.gray800};
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
`;

const TaskIcon = styled.Text`
  font-size: 20px;
  margin-right: 12px;
  align-self: center;
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

const RoutineCountText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 12px;
  color: ${theme.colors.gray500};
  margin-left: 4px;
`;

const ProgressText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 20px;
  font-weight: 600;
  color: ${theme.colors.primary};
`;
