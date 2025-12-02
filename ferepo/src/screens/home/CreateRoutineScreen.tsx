import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { TextInput, TouchableOpacity, Text, View } from 'react-native';
import { theme } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import RoutineCategorySelector from '../../components/domain/routine/RoutineCategorySelector';
import DayOfWeekSelector from '../../components/domain/routine/DayOfWeekSelector';
import TimeRangeSelector from '../../components/domain/routine/TimeRangeSelector';
import CustomButton from '../../components/common/CustomButton';
import BottomSheetDialog from '../../components/common/BottomSheetDialog';
import DatePickerModal from '../../components/domain/routine/DatePickerModal';
import TimePickerModal from '../../components/domain/routine/TimePickerModal';
import {
  useCreatePersonalRoutineList,
  useUpdatePersonalRoutineList,
} from '../../hooks/routine/personal/usePersonalRoutines';
import { RoutineType, DayType } from '../../types/api';
import { useQueryClient } from '@tanstack/react-query';
import { useErrorHandler } from '../../hooks/common/useErrorHandler';

interface CreateRoutineScreenProps {
  navigation: any;
  route: {
    params?: {
      mode?: 'create' | 'edit';
      routineData?: any;
      aiSelectedRoutines?: any[];
    };
  };
}

const CreateRoutineScreen = ({
  navigation,
  route,
}: CreateRoutineScreenProps) => {
  const mode = route?.params?.mode || 'create';
  const routineData = route?.params?.routineData;
  const aiSelectedRoutines = route?.params?.aiSelectedRoutines || [];

  // 기존 데이터로 초기화 (수정 모드인 경우)
  const [routineName, setRoutineName] = useState(routineData?.title || '');
  const [selectedCategory, setSelectedCategory] = useState(
    routineData?.routineType === 'FINANCE' ? 'finance' : 'life',
  );
  // 요일 순서 정의 (월화수목금토일)
  const dayOrder = ['월', '화', '수', '목', '금', '토', '일'];

  // 요일을 순서대로 정렬하는 함수
  const sortDaysByOrder = (days: string[]) => {
    return days.sort((a, b) => {
      const indexA = dayOrder.indexOf(a);
      const indexB = dayOrder.indexOf(b);
      return indexA - indexB;
    });
  };

  const [selectedDays, setSelectedDays] = useState<string[]>(
    sortDaysByOrder(routineData?.dayTypes || []),
  );
  const [startTime, setStartTime] = useState(
    routineData?.startTime || '오전 00:00',
  );
  const [endTime, setEndTime] = useState(routineData?.endTime || '오전 00:00');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(
    routineData?.startDate ||
      (() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      })(),
  );

  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [textWidth, setTextWidth] = useState(120);

  // 개인루틴 생성/수정 훅
  const { mutate: createRoutine, isPending: isCreating } =
    useCreatePersonalRoutineList();
  const { mutate: updateRoutine, isPending: isUpdating } =
    useUpdatePersonalRoutineList();
  
  // 쿼리 클라이언트 (캐시 무효화용)
  const queryClient = useQueryClient();
  
  // 에러 처리 훅
  const { handleAndShowError } = useErrorHandler();

  const isPending = isCreating || isUpdating;

  const handleSubmitRoutine = () => {
    // API 요청 데이터 준비
    const submitData = {
      title: routineName,
      startDate: selectedStartDate, // YYYY-MM-DD 형식 (LocalDate)
      startTime: formatTimeForAPI(startTime), // HH:mm:ss 형식 (LocalTime)
      endTime: formatTimeForAPI(endTime), // HH:mm:ss 형식 (LocalTime)
      routineType: 'FINANCE' as RoutineType,
      dayTypes: selectedDays as DayType[],
    };

    console.log('🔍 루틴 생성 API 요청 데이터:', submitData);
    console.log('🔍 원본 데이터:', {
      routineName,
      selectedStartDate,
      startTime,
      endTime,
      selectedCategory,
      selectedDays,
    });

    if (mode === 'edit') {
      // 수정 모드
      if (!routineData?.id) {
        console.error('🔍 루틴 ID가 없습니다:', routineData);
        return;
      }

      updateRoutine(
        {
          myRoutineListId: routineData.id.toString(),
          data: submitData,
        },
        {
          onSuccess: (data) => {
            // 캐시 무효화하여 수정된 데이터가 즉시 반영되도록 처리
            queryClient.invalidateQueries({ queryKey: ['personalRoutines'] });
            queryClient.invalidateQueries({ queryKey: ['infinitePersonalRoutines'] });
            queryClient.invalidateQueries({ queryKey: ['personalRoutineDetails'] });
            
            // 수정된 루틴 데이터로 PersonalRoutineDetailScreen으로 직접 이동
            const updatedRoutineData = {
              id: routineData.id,
              name: submitData.title,
              title: submitData.title,
              // category: submitData.category,
              days: submitData.dayTypes,
              startTime: submitData.startTime,
              endTime: submitData.endTime,
              startDate: submitData.startDate,
            };
            
            navigation.navigate('PersonalRoutineDetail', {
              routineData: updatedRoutineData,
              shouldRefresh: true, // 데이터 새로고침 플래그 추가
            });
          },
          onError: (error) => {
            console.error('🔍 루틴 수정 실패:', error);
            handleAndShowError(error, '루틴 수정 실패');
          },
        },
      );
    } else {
      // 생성 모드
      createRoutine(submitData, {
        onSuccess: (data) => {
          // CreateRoutineDetailScreen으로 이동
          navigation.navigate('CreateRoutineDetail', {
            routineData: {
              name: routineName,
              category: selectedCategory,
              days: selectedDays,
              startTime,
              endTime,
              startDate: selectedStartDate,
              routineListId: data.result?.id, // 생성된 루틴 리스트 ID
            },
            aiSelectedRoutines: aiSelectedRoutines, // AI 선택 루틴 데이터 전달
          });
        },
        onError: (error) => {
          console.error('🔍 루틴 생성 실패:', error);
          handleAndShowError(error, '루틴 생성 실패');
        },
      });
    }
  };

  const isFormValid =
    routineName.trim() &&
    selectedDays.length > 0 &&
    startTime &&
    endTime &&
    selectedStartDate;

  const categories = [
    { id: 'life', name: '생활' },
    { id: 'finance', name: '소비' },
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowCategoryModal(false);
  };

  const handleDateSelect = (date: string) => {
    // date는 이미 YYYY-MM-DD 형식으로 전달됨
    setSelectedStartDate(date);
    setShowDatePicker(false);
  };

  // 시간을 HH:mm 형식으로 변환하는 함수 (화면 표시용)
  const formatTimeForDisplay = (time: string): string => {
    // "오전 09:00" 또는 "오후 02:30" 형식을 "09:00" 또는 "14:30"으로 변환
    if (time.includes('오전')) {
      const timePart = time.replace('오전 ', '');
      const [hour, minute] = timePart.split(':');
      const hourNum = parseInt(hour);
      // 오전 12시는 00:00으로 변환
      const adjustedHour = hourNum === 12 ? 0 : hourNum;
      return `${adjustedHour.toString().padStart(2, '0')}:${minute}`;
    } else if (time.includes('오후')) {
      const timePart = time.replace('오후 ', '');
      const [hour, minute] = timePart.split(':');
      const hourNum = parseInt(hour);
      // 오후 12시는 12:00으로 변환 (12 + 0 = 12)
      const adjustedHour = hourNum === 12 ? 12 : hourNum + 12;
      return `${adjustedHour.toString().padStart(2, '0')}:${minute}`;
    }

    return time; // 이미 HH:mm 형식이면 그대로 반환
  };

  // 시간을 HH:mm:ss 형식으로 변환하는 함수 (API 요청용)
  const formatTimeForAPI = (time: string): string => {
    // "오전 09:00" 또는 "오후 02:30" 형식을 "09:00:00" 또는 "14:30:00"으로 변환
    if (time.includes('오전')) {
      const timePart = time.replace('오전 ', '');
      const [hour, minute] = timePart.split(':');
      const hourNum = parseInt(hour);
      // 오전 12시는 00:00:00으로 변환
      const adjustedHour = hourNum === 12 ? 0 : hourNum;
      return `${adjustedHour.toString().padStart(2, '0')}:${minute}:00`;
    } else if (time.includes('오후')) {
      const timePart = time.replace('오후 ', '');
      const [hour, minute] = timePart.split(':');
      const hourNum = parseInt(hour);
      // 오후 12시는 12:00:00으로 변환 (12 + 0 = 12)
      const adjustedHour = hourNum === 12 ? 12 : hourNum + 12;
      return `${adjustedHour.toString().padStart(2, '0')}:${minute}:00`;
    }

    // 이미 HH:mm 형식이면 :ss 추가
    if (time.includes(':')) {
      return `${time}:00`;
    }
    return time;
  };

  const handleStartTimeSelect = (time: string | number) => {
    if (typeof time === 'string') {
      // "오전 12:00" 형식을 그대로 유지
      setStartTime(time);
    }
    setShowStartTimePicker(false);
  };

  const handleEndTimeSelect = (time: string | number) => {
    if (typeof time === 'string') {
      // "오전 12:00" 형식을 그대로 유지
      setEndTime(time);
    }
    setShowEndTimePicker(false);
  };

  return (
    <Container edges={['top', 'left', 'right', 'bottom']}>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.gray800}
          />
        </BackButton>
        <Title>{mode === 'edit' ? '루틴 수정' : '루틴 생성'}</Title>
        <Spacer />
      </Header>

      <Content>
        {/* 루틴 이름 입력 */}
        <InputSection>
          <InputContainer>
            <NameInput
              placeholder="예) 아침루틴"
              value={routineName}
              onChangeText={setRoutineName}
              placeholderTextColor={theme.colors.gray400}
            />
            <HiddenText
              onLayout={(event) => {
                const { width } = event.nativeEvent.layout;
                setTextWidth(Math.max(width, 120));
              }}
            >
              {routineName || '예) 아침루틴'}
            </HiddenText>
            <Underline
              style={{
                width: `${textWidth}px`,
              }}
            />
          </InputContainer>
        </InputSection>

        {/* 루틴 카테고리 선택 */}

        {/* 요일 선택 */}
        <DayOfWeekSelector
          selectedDays={selectedDays}
          onDaysChange={(days) => setSelectedDays(sortDaysByOrder(days))}
          onStartDatePress={() => setShowDatePicker(true)}
          selectedStartDate={selectedStartDate}
          readOnly={false}
          buttonSize={40}
          borderRadius={20}
        />

        {/* 시간 선택 */}
        <TimeRangeSelector
          startTime={startTime}
          endTime={endTime}
          onStartTimePress={() => setShowStartTimePicker(true)}
          onEndTimePress={() => setShowEndTimePicker(true)}
        />
      </Content>

      {/* 하단 버튼 */}
      <ButtonWrapper>
        <CustomButton
          text={mode === 'edit' ? '루틴 수정' : '루틴 생성'}
          onPress={handleSubmitRoutine}
          disabled={!isFormValid}
          backgroundColor={
            isFormValid ? theme.colors.primary : theme.colors.gray300
          }
          textColor={isFormValid ? theme.colors.white : theme.colors.gray500}
        />
      </ButtonWrapper>

      {/* 루틴 카테고리 선택 모달 */}
      <BottomSheetDialog
        visible={showCategoryModal}
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <CategoryButtonsContainer>
          {categories.map((category) => (
            <CategoryButton
              key={category.id}
              onPress={() => handleCategorySelect(category.id)}
              isSelected={selectedCategory === category.id}
            >
              <CategoryButtonText isSelected={selectedCategory === category.id}>
                {category.name}
              </CategoryButtonText>
            </CategoryButton>
          ))}
        </CategoryButtonsContainer>
      </BottomSheetDialog>

      {/* 시작 날짜 선택 모달 */}
      <DatePickerModal
        visible={showDatePicker}
        onRequestClose={() => setShowDatePicker(false)}
        onDateSelect={handleDateSelect}
      />

      {/* 시작 시간 선택 모달 */}
      <TimePickerModal
        visible={showStartTimePicker}
        onRequestClose={() => setShowStartTimePicker(false)}
        onTimeSelect={handleStartTimeSelect}
        type="time"
        initialTime={startTime}
      />

      {/* 종료 시간 선택 모달 */}
      <TimePickerModal
        visible={showEndTimePicker}
        onRequestClose={() => setShowEndTimePicker(false)}
        onTimeSelect={handleEndTimeSelect}
        type="time"
        initialTime={endTime}
      />
    </Container>
  );
};

export default CreateRoutineScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`;

const BackButton = styled(TouchableOpacity)`
  padding: 4px;
`;

const Title = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 18px;
  color: ${theme.colors.gray800};
`;

const Spacer = styled.View`
  width: 32px;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 24px 16px;
`;

const InputSection = styled.View`
  margin-bottom: 24px;
`;

const InputLabel = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${theme.colors.gray800};
  margin-bottom: 12px;
`;

const InputContainer = styled.View`
  align-items: center;
`;

const NameInput = styled(TextInput)`
  font-family: ${theme.fonts.SemiBold};
  font-size: 28px;
  color: ${theme.colors.gray800};
  padding: 16px 0;
  text-align: center;
`;

const HiddenText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 28px;
  color: transparent;
  text-align: center;
  height: 0;
  overflow: hidden;
`;

const Underline = styled.View`
  height: 1px;
  background-color: ${theme.colors.gray300};
  align-self: center;
`;

const ButtonWrapper = styled.View`
  padding: 24px 16px;
  background-color: ${theme.colors.white};
`;

// 모달 관련 스타일
const ModalTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 18px;
  color: ${theme.colors.gray800};
  text-align: center;
  margin-bottom: 24px;
`;

const CategoryButtonsContainer = styled.View`
  gap: 12px;
`;

const CategoryButton = styled(TouchableOpacity)<{ isSelected: boolean }>`
  padding: 16px;
  border-radius: 8px;
  border: 1px solid
    ${({ isSelected }) =>
      isSelected ? theme.colors.primary : theme.colors.gray300};
  background-color: ${theme.colors.white};
  align-items: center;
`;

const CategoryButtonText = styled(Text)<{ isSelected: boolean }>`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${({ isSelected }) =>
    isSelected ? theme.colors.primary : theme.colors.gray600};
`;
