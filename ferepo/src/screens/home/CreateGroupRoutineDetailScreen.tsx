import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { TouchableOpacity, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import {
  DayButton,
  RoutineItemAdder,
  TimePickerModal,
  DayOfWeekSelector,
  EmojiPickerModal,
  RoutineSuggestionModal,
} from '../../components/domain/routine';
import CompletedRoutineItem from '../../components/domain/routine/CompletedRoutineItem';
import {
  useCreateGroupRoutineDetail,
  useCreateGroupRoutine,
  useUpdateGroupRoutineDetail,
} from '../../hooks/routine/group/useGroupRoutines';
import { getGroupRoutineDetail } from '../../api/routine/group/routineDetails';
import {
  useRoutineTemplates,
  useRoutineEmojis,
} from '../../hooks/routine/common/useCommonRoutines';
import { useQueryClient } from '@tanstack/react-query';

interface CreateGroupRoutineDetailScreenProps {
  navigation: any;
  route: { params?: { mode?: 'create' | 'edit'; routineData?: any } };
}

const CreateGroupRoutineDetailScreen = ({
  navigation,
  route,
}: CreateGroupRoutineDetailScreenProps) => {
  const mode = route?.params?.mode || 'create';
  const routineData = route?.params?.routineData;
  const queryClient = useQueryClient();

  const [selectedDays, setSelectedDays] = useState<string[]>(
    routineData?.dayTypes || routineData?.days || [],
  );
  const [routineItems, setRoutineItems] = useState<
    Array<{
      emoji: string;
      emojiId: number; // 이모지 ID 추가
      text: string;
      time: string;
      isCompleted: boolean;
    }>
  >([]);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [selectedEmojiId, setSelectedEmojiId] = useState<number | null>(null);
  const [currentText, setCurrentText] = useState<string>('');

  // 수정 중인 아이템 인덱스 (null이면 새로 추가하는 중)
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // 루틴 추천 모달 상태
  const [routineSuggestionVisible, setRoutineSuggestionVisible] =
    useState(false);

  // 단체루틴 생성 + 상세 생성/수정 훅
  const { mutate: createGroupRoutine, isPending: isCreatingGroup } =
    useCreateGroupRoutine();
  const { mutate: createGroupRoutineDetail, isPending: isCreatingDetail } =
    useCreateGroupRoutineDetail();
  const { mutate: updateGroupRoutineDetail, isPending: isUpdatingDetail } =
    useUpdateGroupRoutineDetail();

  const isPending = isCreatingGroup || isCreatingDetail || isUpdatingDetail;

  // 루틴 템플릿 조회 훅 - 모든 템플릿을 가져오기 위해 카테고리 필터링 제거
  const { data: templatesData, isLoading: isLoadingTemplates } =
    useRoutineTemplates({
      category: 'LIFE', // 기본적으로 생활 카테고리 템플릿 조회
      page: 0,
      size: 50,
    });

  // 이모지 조회 훅 - 모든 이모지를 가져오기 위해 카테고리 필터링 제거
  const { data: emojiData, isLoading: isLoadingEmojis } = useRoutineEmojis({});

  // 하드웨어 뒤로 가기 버튼 처리만 추가 (모달 자동 닫기 제거)
  useFocusEffect(
    React.useCallback(() => {
      // 하드웨어 뒤로 가기 버튼 처리
      const backAction = () => {
        // 모달이 열려있으면 모달을 닫고, 아니면 뒤로 가기
        if (timePickerVisible || emojiPickerVisible || routineSuggestionVisible) {
          setTimePickerVisible(false);
          setEmojiPickerVisible(false);
          setRoutineSuggestionVisible(false);
          setEditingIndex(null);
          return true; // 이벤트 소비
        }
        return false; // 기본 뒤로 가기 동작 허용
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => backHandler.remove();
    }, [timePickerVisible, emojiPickerVisible, routineSuggestionVisible])
  );

  // 수정 모드에서 루틴 데이터 초기화
  useEffect(() => {
    if (
      mode === 'edit' &&
      routineData?.RoutineInfos &&
      emojiData?.result?.items
    ) {
      console.log('🔍 이모지 매칭 데이터:', {
        routineInfos: routineData.RoutineInfos,
        emojiItems: emojiData.result.items,
      });

      const emojiMap = new Map(
        emojiData.result.items.map((emoji: any) => [
          emoji.emojiId,
          emoji.emojiUrl,
        ]),
      );

      const initialRoutineItems = routineData.RoutineInfos.map(
        (routine: any) => {
          const emojiUrl = emojiMap.get(routine.emojiId) || '☕'; // 기본값
          console.log(
            `🔍 루틴 ${routine.name}: emojiId=${routine.emojiId}, emojiUrl=${emojiUrl}`,
          );
          return {
            emoji: emojiUrl,
            emojiId: routine.emojiId,
            text: routine.name,
            time: `${routine.time}분`,
            isCompleted: false,
          };
        },
      );

      setRoutineItems(initialRoutineItems);
    }
  }, [mode, routineData?.RoutineInfos, emojiData?.result?.items]);

  // 시간을 "오전/오후 h:mm" 형식으로 변환하는 함수
  const formatTimeForDisplay = (time: string): string => {
    if (!time) return '';

    // 이미 "오전/오후" 형식이면 그대로 반환
    if (time.includes('오전') || time.includes('오후')) {
      return time;
    }

    // HH:mm 형식을 "오전/오후 h:mm" 형식으로 변환
    if (time.includes(':')) {
      const [hourStr, minute] = time.split(':');
      const hour = parseInt(hourStr);

      if (hour === 0) {
        return `오전 12:${minute}`;
      } else if (hour < 12) {
        return `오전 ${hour}:${minute}`;
      } else if (hour === 12) {
        return `오후 12:${minute}`;
      } else {
        return `오후 ${hour - 12}:${minute}`;
      }
    }

    return time;
  };

  // 시간을 HH:mm 형식으로 변환하는 함수 (API 요청용)
  const formatTimeForAPI = (time: string): string => {
    if (!time) return '';

    // 이미 HH:mm 형식이면 그대로 반환
    if (
      time.includes(':') &&
      !time.includes('오전') &&
      !time.includes('오후')
    ) {
      return time;
    }

    // "오전/오후 h:mm" 형식을 HH:mm 형식으로 변환
    if (time.includes('오전')) {
      const timeStr = time.replace('오전 ', '');
      const [hourStr, minute] = timeStr.split(':');
      const hour = parseInt(hourStr);

      if (hour === 12) {
        return `00:${minute}`;
      } else {
        return `${hour.toString().padStart(2, '0')}:${minute}`;
      }
    } else if (time.includes('오후')) {
      const timeStr = time.replace('오후 ', '');
      const [hourStr, minute] = timeStr.split(':');
      const hour = parseInt(hourStr);

      if (hour === 12) {
        return `12:${minute}`;
      } else {
        return `${(hour + 12).toString().padStart(2, '0')}:${minute}`;
      }
    }

    return time;
  };

  const handleBack = () => {
    // 모달이 열려있으면 모달을 닫고, 아니면 뒤로 가기
    if (timePickerVisible || emojiPickerVisible || routineSuggestionVisible) {
      setTimePickerVisible(false);
      setEmojiPickerVisible(false);
      setRoutineSuggestionVisible(false);
      setEditingIndex(null);
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
    if (isLoadingTemplates || isLoadingEmojis) {
      return;
    }

    if (templatesData?.result?.items && templatesData.result.items.length > 0) {
      setRoutineSuggestionVisible(true);
    } else {
      // 템플릿이 없어도 모달을 열어서 직접 입력할 수 있도록 함
      setRoutineSuggestionVisible(true);
    }
  };

  const handleClockPress = () => {
    // 시간 선택 모달을 직접 열기
    setTimePickerVisible(true);
  };

  const handleEmojiSelect = (emoji: string, emojiId?: number) => {
    console.log('🔍 이모지 선택 받음:', { emoji, emojiId });
    setSelectedEmoji(emoji);
    // emojiId도 저장 (나중에 사용)
    if (emojiId) {
      setSelectedEmojiId(emojiId);
    }
  };

  const handleTimeSelect = (time: string | number) => {
    if (typeof time === 'number') {
      const timeString = `${time}분`;
      setSelectedTime(timeString);
    } else {
      setSelectedTime(time);
    }
  };

  const handleTextChange = (text: string) => {
    // 시간 형식인지 확인 (예: "40분", "30분" 등)
    if (text.includes('분')) {
      setSelectedTime(text);
    } else {
      setCurrentText(text);
    }
  };

  const handleTextPress = () => {
    setRoutineSuggestionVisible(true);
  };

  // 기존 아이템 수정 시작
  const handleEditItem = (index: number) => {
    const item = routineItems[index];
    setEditingIndex(index);
    setSelectedEmoji(item.emoji);
    setCurrentText(item.text);
    setSelectedTime(item.time);
  };

  // 수정 완료 또는 새 아이템 추가
  const handleCompleteEdit = () => {
    if (selectedEmoji && currentText && selectedTime) {
      // 이모지 ID 사용 (직접 전달받은 ID 우선 사용)
      const emojiId = selectedEmojiId || 1; // 직접 전달받은 ID 또는 기본값 1

      console.log('🔍 이모지 ID 사용:', {
        selectedEmoji,
        selectedEmojiId,
        emojiId,
      });

      if (editingIndex !== null) {
        // 기존 아이템 수정
        const updatedItems = [...routineItems];
        updatedItems[editingIndex] = {
          emoji: selectedEmoji,
          emojiId: emojiId,
          text: currentText,
          time: selectedTime,
          isCompleted: false,
        };
        setRoutineItems(updatedItems);
        setEditingIndex(null);
      } else {
        // 새 아이템 추가
        const newItem = {
          emoji: selectedEmoji,
          emojiId: emojiId,
          text: currentText,
          time: selectedTime,
          isCompleted: false,
        };
        setRoutineItems([...routineItems, newItem]);
      }

      // 필드 초기화
      setSelectedEmoji('');
      setSelectedEmojiId(null);
      setCurrentText('');
      setSelectedTime('');
    }
  };

  // 아이템 삭제
  const handleDeleteItem = (index: number) => {
    const updatedItems = routineItems.filter((_, i) => i !== index);
    setRoutineItems(updatedItems);
  };

  // 루틴 추천 선택 핸들러 (완료 버튼 클릭 시 호출)
  const handleRoutineSuggestionSelect = (routine: any) => {
    console.log('🔍 handleRoutineSuggestionSelect 호출됨:', routine);
    
    // 이모지 ID 찾기 (템플릿의 emojiId 사용)
    let emojiId = routine.emojiId;

    // 템플릿에 emojiId가 없으면 이모지 URL로 찾기
    if (!emojiId && routine.icon) {
      const emojiItem = emojiData?.result?.items?.find(
        (emoji: any) => emoji.emojiUrl === routine.icon,
      );
      emojiId = emojiItem?.emojiId;
    }

    // 이모지 ID를 찾지 못한 경우 기본값 사용 (더미 데이터용)
    if (!emojiId) {
      console.log('🔍 이모지 ID를 찾을 수 없어 기본값 사용:', routine.icon);
      emojiId = 1; // 기본 이모지 ID 사용
    }

    // 완성된 루틴 아이템을 화면에 추가
    const newItem = {
      emoji: routine.icon,
      emojiId: emojiId,
      text: routine.title,
      time: selectedTime || '30분', // 선택된 시간 사용, 없으면 기본값
      isCompleted: false, // 생성 화면에서는 미완료 상태로
    };
    
    console.log('🔍 새 루틴 아이템 추가:', newItem);
    setRoutineItems([...routineItems, newItem]);

    // 필드 초기화
    setSelectedEmoji('');
    setCurrentText('');
    setSelectedTime('');
    
    // 모달 닫기
    setRoutineSuggestionVisible(false);
  };

  // 루틴 추천 모달이 닫힐 때 호출되는 핸들러
  const handleRoutineSuggestionClose = () => {
    setRoutineSuggestionVisible(false);
  };

  const isFormValid = routineItems.length > 0;

  const handleSave = () => {
    if (mode === 'edit') {
      // 수정 모드: 단체 루틴 상세 수정

      const routines = routineItems
        .map((item, index) => {
          // 실제 API에서 받아온 routineId 사용
          const originalRoutine = routineData?.RoutineInfos?.[index];

          // routineId가 undefined인 경우 건너뛰기
          if (!originalRoutine?.id) {
            return null;
          }

          return {
            routineId: originalRoutine.id,
            templateId: null,
            emojiId: item.emojiId,
            name: item.text,
            time: parseInt(item.time.replace('분', '')),
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null); // 타입 가드로 null 제거

      const detailData = {
        routines,
      };

      updateGroupRoutineDetail(
        {
          groupRoutineListId:
            routineData.groupRoutineListId?.toString() ||
            routineData.id.toString(),
          data: detailData,
        },
        {
          onSuccess: (data) => {
            // 캐시 무효화로 데이터 새로고침
            const groupRoutineListId =
              routineData.groupRoutineListId || routineData.id;
            queryClient.invalidateQueries({
              queryKey: ['groupRoutineDetail', groupRoutineListId],
            });
            queryClient.invalidateQueries({
              queryKey: ['infiniteGroupRoutines'],
            });

            navigation.navigate('Result', {
              type: 'success',
              title: '단체 루틴 상세 수정 완료',
              description: '단체 루틴 상세가 성공적으로 수정되었습니다.',
              nextScreen: 'GroupRoutineDetail',
              updatedRoutineData: {
                routineId: routineData.groupRoutineListId || routineData.id,
              },
            });
          },
          onError: (error) => {
            console.error('🔍 단체 루틴 상세 수정 실패:', error);
            // 에러 처리 (나중에 토스트나 알림 추가)
          },
        },
      );
      return;
    }

    // 생성 모드: 단체 루틴 생성 데이터 준비
    const groupRoutineData = {
      title: routineData?.name || '새 단체 루틴',
      description: routineData?.description || '단체 루틴 설명', // 전달받은 설명 사용
      startTime: formatTimeForAPI(routineData?.startTime) || '09:00',
      endTime: formatTimeForAPI(routineData?.endTime) || '11:00',
      routineType: (routineData?.category === 'life'
        ? 'DAILY'
        : 'FINANCE') as any,
      daysOfWeek: selectedDays,
    };

    console.log('🔍 단체 루틴 생성 데이터:', groupRoutineData);

    // 1단계: 단체 루틴 생성
    createGroupRoutine(groupRoutineData, {
      onSuccess: (groupData) => {
        // 생성된 단체 루틴 ID 추출 (result 자체가 ID 값)
        const groupRoutineId = groupData.result;

        if (!groupRoutineId) {
          return;
        }

        // 2단계: 단체 루틴 상세 생성
        const detailData = {
          routines: routineItems.map((item) => ({
            templateId: null, // 템플릿 연결 안 함
            emojiId: item.emojiId,
            name: item.text,
            time: parseInt(item.time.replace('분', '')), // "30분" -> 30
          })),
        };

        createGroupRoutineDetail(
          {
            groupRoutineListId: groupRoutineId.toString(),
            data: detailData,
          },
          {
            onSuccess: (detailData) => {
              navigation.navigate('Result', {
                type: 'success',
                title: '단체 루틴 생성 완료',
                description:
                  '단체 루틴과 상세 루틴이 성공적으로 생성되었습니다.',
                nextScreen: 'HomeMain',
              });
            },
            onError: (error) => {
              console.error('🔍 상세 생성 실패:', error);
              // 에러 처리 (나중에 토스트나 알림 추가)
            },
          },
        );
      },
      onError: (error) => {
        console.error('🔍 단체 루틴 생성 실패:', error);
        // 에러 처리 (나중에 토스트나 알림 추가)
      },
    });
  };

  return (
    <Container edges={['top', 'left', 'right', 'bottom']}>
      <Header
        title={mode === 'edit' ? '단체 루틴 상세 수정' : '단체 루틴 상세 생성'}
        onBackPress={handleBack}
      />
      <TouchableOpacity 
        style={{ flex: 1 }} 
        activeOpacity={1} 
        onPress={handleBack}
      >
        <Content>
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={() => {}}
        >
        <RoutineCard>
          <RoutineTitle>
            {routineData?.title || routineData?.name || '새 단체 루틴'}
          </RoutineTitle>
          <DescriptionText>{routineData.description}</DescriptionText>
          <RoutineTime>
            {formatTimeForDisplay(routineData?.startTime) || '오후 7:00'} -{' '}
            {formatTimeForDisplay(routineData?.endTime) || '오후 10:00'}
          </RoutineTime>
          <DayOfWeekSelector
            selectedDays={selectedDays}
            onDaysChange={setSelectedDays}
            readOnly={true}
            buttonSize={40}
            borderRadius={20}
          />

          {/* 새로운 루틴 추가 */}
          {editingIndex === null && (
            <AdderContainer>
              <RoutineItemAdder
                onPlusPress={handlePlusPress}
                onClockPress={handleClockPress}
                onTextChange={handleTextChange}
                onTextPress={handleTextPress}
                selectedTime={selectedTime}
                selectedEmoji={selectedEmoji}
                currentText={currentText}
                placeholder="루틴을 추가해주세요"
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
                  console.log('🔍 CompletedRoutineItem onEdit:', {
                    index,
                    emoji,
                    text,
                    time,
                  });
                  const updatedItems = [...routineItems];
                  // 새로운 이모지에 해당하는 emojiId 찾기
                  const emojiItem = emojiData?.result?.items?.find(
                    (emojiData: any) => emojiData.emojiUrl === emoji,
                  );
                  const newEmojiId = emojiItem?.emojiId || 1;

                  console.log('🔍 이모지 매칭 결과:', {
                    selectedEmoji: emoji,
                    foundEmojiItem: emojiItem,
                    newEmojiId,
                  });

                  updatedItems[index] = {
                    emoji,
                    emojiId: newEmojiId, // 새로운 emojiId 사용
                    text,
                    time,
                    isCompleted: false, // 생성 화면에서는 미완료 상태로
                  };
                  setRoutineItems(updatedItems);
                }}
                onDelete={handleDeleteItem}
                isEditMode={true} // 생성 화면에서는 항상 편집 가능
              />
            </AdderContainer>
          ))}
        </RoutineCard>
        </TouchableOpacity>

        {/* 루틴 생성 버튼 */}
        <CreateButton onPress={handleSave} disabled={!isFormValid}>
          <CreateButtonText isDisabled={!isFormValid}>
            {mode === 'edit' ? '단체 루틴 상세 수정' : '단체 루틴 상세 생성'}
          </CreateButtonText>
        </CreateButton>
        </Content>
      </TouchableOpacity>

      <TimePickerModal
        visible={timePickerVisible}
        onRequestClose={() => setTimePickerVisible(false)}
        onTimeSelect={handleTimeSelect}
        type="minutes"
      />

      <EmojiPickerModal
        visible={emojiPickerVisible}
        onRequestClose={() => setEmojiPickerVisible(false)}
        onEmojiSelect={handleEmojiSelect}
      />

      <RoutineSuggestionModal
        visible={routineSuggestionVisible}
        onRequestClose={handleRoutineSuggestionClose}
        onRoutineSelect={handleRoutineSuggestionSelect}
        onPlusPress={() => setRoutineSuggestionVisible(true)}
        onClockPress={handleClockPress}
        onTextChange={handleTextChange}
        onTimeChange={setSelectedTime}
        selectedTime={selectedTime}
        selectedEmoji={selectedEmoji}
        currentText={currentText}
        templates={templatesData?.result?.items || []} // 템플릿 데이터 전달
        emojis={emojiData?.result?.items || []} // 이모지 데이터 전달
        isLoading={isLoadingTemplates || isLoadingEmojis} // 로딩 상태 전달
      />
    </Container>
  );
};

export default CreateGroupRoutineDetailScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const DescriptionCard = styled.View`
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray200};
  border-radius: 12px;
  padding: 16px;
  margin: 16px;
`;

const DescriptionTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 14px;
  color: ${theme.colors.gray700};
  margin-bottom: 8px;
`;

const DescriptionText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
  line-height: 20px;
`;

const RoutineCard = styled.View`
  background-color: ${theme.colors.gray50};
  border-radius: 12px;
  padding: 24px 16px;
  margin: 16px;
`;

const RoutineTitle = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.gray800};
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

const CreateButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ disabled }) =>
    disabled ? theme.colors.gray300 : theme.colors.primary};
  border-radius: 12px;
  padding: 16px;
  margin: 0 16px;
  align-items: center;
  justify-content: center;
`;

const CreateButtonText = styled.Text<{ isDisabled?: boolean }>`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${({ isDisabled }) =>
    isDisabled ? theme.colors.gray500 : theme.colors.white};
`;

const LoadingContainer = styled.View`
  padding: 20px;
  align-items: center;
  justify-content: center;
`;

const LoadingText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray500};
`;
