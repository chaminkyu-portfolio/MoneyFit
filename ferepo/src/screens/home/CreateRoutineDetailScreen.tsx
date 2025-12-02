import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
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
  useCreatePersonalRoutineDetailArray,
  usePersonalRoutineDetails,
} from '../../hooks/routine/personal/usePersonalRoutines';
import { useQueryClient } from '@tanstack/react-query';
import {
  useRoutineTemplates,
  useRoutineEmojis,
} from '../../hooks/routine/common/useCommonRoutines';
import { useErrorHandler } from '../../hooks/common/useErrorHandler';

interface CreateRoutineDetailScreenProps {
  navigation: any;
  route: { params?: { routineData?: any; aiSelectedRoutines?: any[] } };
}

const CreateRoutineDetailScreen = ({
  navigation,
  route,
}: CreateRoutineDetailScreenProps) => {
  const routineData = route?.params?.routineData;
  const aiSelectedRoutines = route?.params?.aiSelectedRoutines || [];
  const [selectedDays, setSelectedDays] = useState<string[]>(
    routineData?.days || [],
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

  // QueryClient 훅
  const queryClient = useQueryClient();
  
  // 에러 처리 훅
  const { handleAndShowError } = useErrorHandler();

  // 개인루틴 상세 생성 훅 (배열)
  const { mutate: createRoutineDetail, isPending } =
    useCreatePersonalRoutineDetailArray();

  // 개인루틴 상세 조회 훅 - 기존 루틴들을 불러오기
  const { data: existingRoutinesData, isLoading: isLoadingExistingRoutines } =
    usePersonalRoutineDetails(routineData?.routineListId || '', {
      date: routineData?.startDate || new Date().toISOString().split('T')[0],
    });

  // 루틴 템플릿 조회 훅 - 모든 템플릿을 가져오기 위해 카테고리 필터링 제거
  const { data: templatesData, isLoading: isLoadingTemplates } =
    useRoutineTemplates({
      category: 'LIFE', // 기본적으로 생활 카테고리 템플릿 조회
      page: 0,
      size: 50,
    });

  // 이모지 조회 훅 - 모든 이모지를 가져오기 위해 카테고리 필터링 제거
  const { data: emojiData, isLoading: isLoadingEmojis } = useRoutineEmojis({});

  // AI 선택 루틴들을 초기 루틴 아이템으로 설정
  useEffect(() => {
    if (aiSelectedRoutines.length > 0 && routineItems.length === 0) {
      const aiRoutineItems = aiSelectedRoutines.map((routine: any) => ({
        emoji: routine.icon || '📝',
        emojiId: 1, // 기본 이모지 ID
        text: routine.title,
        time: '30분', // 기본 시간
        isCompleted: false,
      }));

      setRoutineItems(aiRoutineItems);
    }
  }, [aiSelectedRoutines, routineItems.length]);

  // 기존 루틴 데이터를 화면에 로드 (AI 선택 루틴이 없을 때만)
  useEffect(() => {
    if (
      aiSelectedRoutines.length === 0 && // AI 선택 루틴이 없을 때만
      existingRoutinesData?.result &&
      existingRoutinesData.result.length > 0
    ) {
      const existingItems = existingRoutinesData.result.map((routine: any) => ({
        emoji: routine.emojiUrl,
        emojiId: routine.emojiId || 1, // 서버에서 emojiId가 없을 경우 기본값
        text: routine.routineName,
        time: `${routine.time}분`,
        isCompleted: routine.completed,
      }));

      setRoutineItems(existingItems);
    }
  }, [existingRoutinesData, aiSelectedRoutines.length]);

  const handleBack = () => {
    navigation.goBack();
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
      console.log('🔍 selectedEmojiId 설정됨:', emojiId);
    } else {
      // emojiId가 없으면 이모지 URL에서 ID를 찾아보기
      const foundEmoji = emojiData?.result?.items?.find((item: any) => item.emojiUrl === emoji);
      if (foundEmoji) {
        setSelectedEmojiId(foundEmoji.emojiId);
        console.log('🔍 URL에서 찾은 emojiId:', foundEmoji.emojiId);
      } else {
        setSelectedEmojiId(1); // 기본값
        console.log('🔍 emojiId를 찾을 수 없어 기본값 1 사용');
      }
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
    setSelectedEmojiId(item.emojiId); // 기존 emojiId도 설정
    setCurrentText(item.text);
    setSelectedTime(item.time);
    console.log('🔍 아이템 수정 시작:', { item, emojiId: item.emojiId });
  };

  // 수정 완료 또는 새 아이템 추가
  const handleCompleteEdit = () => {
    if (selectedEmoji && currentText && selectedTime) {
      // 이모지 ID 결정 로직 개선
      let emojiId = selectedEmojiId;
      
      // selectedEmojiId가 없으면 이모지 URL에서 ID를 찾기
      if (!emojiId) {
        const foundEmoji = emojiData?.result?.items?.find((item: any) => item.emojiUrl === selectedEmoji);
        emojiId = foundEmoji?.emojiId || 1; // 찾지 못하면 기본값 1
        console.log('🔍 URL에서 찾은 emojiId:', emojiId);
      }

      console.log('🔍 최종 이모지 ID 사용:', {
        selectedEmoji,
        selectedEmojiId,
        finalEmojiId: emojiId,
        routineItem: {
          emoji: selectedEmoji,
          emojiId: emojiId,
          text: currentText,
          time: selectedTime,
        },
      });

      if (editingIndex !== null) {
        // 기존 아이템 수정
        const updatedItems = [...routineItems];
        updatedItems[editingIndex] = {
          emoji: selectedEmoji,
          emojiId: emojiId,
          text: currentText,
          time: selectedTime,
          isCompleted: false, // 생성 화면에서는 미완료 상태로
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
          isCompleted: false, // 생성 화면에서는 미완료 상태로
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

  const handleDeleteItem = (index: number) => {
    const updatedItems = routineItems.filter((_, i) => i !== index);
    setRoutineItems(updatedItems);
  };

  // 루틴 추천 선택 핸들러 (완료 버튼 클릭 시 호출)
  const handleRoutineSuggestionSelect = (routine: any) => {
    // 이모지 ID 찾기 (템플릿의 emojiId 사용)
    let emojiId = routine.emojiId;
    
    // 템플릿에 emojiId가 없으면 이모지 URL에서 찾기
    if (!emojiId) {
      const foundEmoji = emojiData?.result?.items?.find((item: any) => item.emojiUrl === routine.icon);
      emojiId = foundEmoji?.emojiId || 1; // 찾지 못하면 기본값 1
    }

    console.log('🔍 루틴 추천 선택:', { 
      routine, 
      emojiId, 
      icon: routine.icon 
    });

    // 완성된 루틴 아이템을 화면에 추가
    const newItem = {
      emoji: routine.icon,
      emojiId: emojiId,
      text: routine.title,
      time: selectedTime || '30분', // 선택된 시간 사용, 없으면 기본값
      isCompleted: false, // 생성 화면에서는 미완료 상태로
    };
    setRoutineItems([...routineItems, newItem]);

    // 필드 초기화
    setSelectedEmoji('');
    setCurrentText('');
    setSelectedTime('');
  };

  // 루틴 추천 모달이 닫힐 때 호출되는 핸들러
  const handleRoutineSuggestionClose = () => {
    setRoutineSuggestionVisible(false);
  };

  const isFormValid = routineItems.length > 0;

  const handleSave = () => {
    console.log('🔍 루틴 상세 생성 시작:', {
      routineData,
      selectedDays,
      routineItems,
      selectedTime,
    });

    // 루틴 리스트 ID가 없으면 에러
    if (!routineData?.routineListId) {
      console.error('🔍 루틴 리스트 ID가 없습니다:', routineData);
      return;
    }

    // 루틴 아이템들을 배열로 변환
    const routineDetailsArray = routineItems.map((item) => ({
      routineName: item.text,
      emojiId: item.emojiId, // 저장된 이모지 ID 사용
      time: parseInt(item.time.replace('분', '')), // "30분" -> 30
    }));

    console.log('🔍 API 전송 데이터:', {
      myRoutineListId: routineData.routineListId,
      routineDetailsArray,
      routineItems, // 원본 데이터도 확인
    });

    // 배열로 한 번에 API 호출
    createRoutineDetail(
      {
        myRoutineListId: routineData.routineListId,
        data: routineDetailsArray,
      },
      {
        onSuccess: (data) => {
          // 캐시 무효화 후 바로 홈으로 이동
          queryClient.invalidateQueries({ queryKey: ['personalRoutines'] });
          queryClient.invalidateQueries({
            queryKey: ['infinitePersonalRoutines'],
          });
          queryClient.invalidateQueries({
            queryKey: ['personalRoutineDetails'],
          });

          // Result 화면 대신 바로 홈으로 이동
          navigation.navigate('HomeMain');
        },
        onError: (error) => {
          console.error('🔍 루틴 상세 생성 실패:', error);
          handleAndShowError(error, '루틴 생성 실패');
        },
      },
    );
  };

  return (
    <Container edges={['top', 'left', 'right', 'bottom']}>
      <Header title="상세 루틴 생성" onBackPress={handleBack} />
      <Content>
        <RoutineCard>
          <RoutineTitle>{routineData?.name || '새 루틴'}</RoutineTitle>
          <RoutineTime>
            {routineData?.startTime || '오후 7:00'} -{' '}
            {routineData?.endTime || '오후 10:00'}
          </RoutineTime>
          <DayOfWeekSelector
            selectedDays={selectedDays}
            onDaysChange={setSelectedDays}
            readOnly={true}
            buttonSize={40}
            borderRadius={20}
          />

          {/* 기존 루틴 로딩 중 표시 */}
          {isLoadingExistingRoutines && (
            <LoadingContainer>{null}</LoadingContainer>
          )}

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
                  const updatedItems = [...routineItems];
                  // 기존 아이템의 emojiId 유지
                  const existingItem = routineItems[index];
                  updatedItems[index] = {
                    emoji,
                    emojiId: existingItem?.emojiId || 1, // 기존 emojiId 유지
                    text,
                    time,
                    isCompleted: false, // 생성 화면에서는 미완료 상태로
                  };
                  setRoutineItems(updatedItems);
                  console.log('🔍 CompletedRoutineItem 편집:', { 
                    index, 
                    emoji, 
                    emojiId: existingItem?.emojiId,
                    text, 
                    time 
                  });
                }}
                onDelete={handleDeleteItem}
                isEditMode={true} // 생성 화면에서는 항상 편집 가능
              />
            </AdderContainer>
          ))}
        </RoutineCard>

        {/* 루틴 생성 버튼 */}
        <CreateButton onPress={handleSave} disabled={!isFormValid}>
          <CreateButtonText isDisabled={!isFormValid}>
            루틴 생성
          </CreateButtonText>
        </CreateButton>
      </Content>

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

export default CreateRoutineDetailScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 16px;
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
