import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { TextInput, TouchableOpacity, Text, View } from 'react-native';
import { theme } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import DayOfWeekSelector from '../../components/domain/routine/DayOfWeekSelector';
import TimeRangeSelector from '../../components/domain/routine/TimeRangeSelector';
import CustomButton from '../../components/common/CustomButton';
import TimePickerModal from '../../components/domain/routine/TimePickerModal';
import {
  useCreateGroupRoutine,
  useUpdateGroupRoutine,
} from '../../hooks/routine/group/useGroupRoutines';
import { RoutineType, DayType } from '../../types/api';
import { useQueryClient } from '@tanstack/react-query';

interface CreateGroupRoutineScreenProps {
  navigation: any;
  route: { params?: { mode?: 'create' | 'edit'; routineData?: any } };
}

const CreateGroupRoutineScreen = ({
  navigation,
  route,
}: CreateGroupRoutineScreenProps) => {
  const mode = route?.params?.mode || 'create';
  const routineData = route?.params?.routineData;
  const queryClient = useQueryClient();

  // 기존 데이터로 초기화 (수정 모드인 경우)
  const [routineName, setRoutineName] = useState(routineData?.title || '');
  const [description, setDescription] = useState(
    routineData?.description || '',
  );
  const [selectedCategory, setSelectedCategory] = useState(
    routineData?.routineType === 'FINANCE' ? 'finance' : 'finance',
  );
  const [selectedDays, setSelectedDays] = useState<string[]>(
    routineData?.dayTypes || [],
  );
  const [startTime, setStartTime] = useState(
    routineData?.startTime || '오전 00:00',
  );
  const [endTime, setEndTime] = useState(routineData?.endTime || '오전 00:00');

  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // 단체루틴 생성/수정 훅
  const { mutate: createGroupRoutine, isPending: isCreating } =
    useCreateGroupRoutine();
  const { mutate: updateGroupRoutine, isPending: isUpdating } =
    useUpdateGroupRoutine();

  const isPending = isCreating || isUpdating;

  const handleSubmitRoutine = () => {
    // API 요청 데이터 준비
    const submitData = {
      title: routineName,
      description: description,
      startTime: formatTimeForAPI(startTime),
      endTime: formatTimeForAPI(endTime),
      routineType: (selectedCategory === 'life'
        ? 'DAILY'
        : 'FINANCE') as RoutineType,
      daysOfWeek: selectedDays as DayType[],
    };

    if (mode === 'edit') {
      // 수정 모드
      if (!routineData?.id) {
        return;
      }

      updateGroupRoutine(
        {
          groupRoutineListId: routineData.id.toString(),
          data: submitData,
        },
        {
          onSuccess: (data) => {
            // 캐시 무효화로 데이터 새로고침
            queryClient.invalidateQueries({
              queryKey: ['groupRoutineDetail', routineData.id],
            });
            queryClient.invalidateQueries({
              queryKey: ['infiniteGroupRoutines'],
            });

            navigation.navigate('Result', {
              type: 'success',
              title: '단체 루틴 수정 완료',
              description: '단체 루틴이 성공적으로 수정되었습니다.',
              nextScreen: 'HomeMain',
            });
          },
          onError: (error) => {
            console.error('🔍 단체 루틴 수정 실패:', error);
            // 에러 처리 (나중에 토스트나 알림 추가)
          },
        },
      );
    } else {
      // 생성 모드 - API 호출 없이 상세 생성 화면으로 이동

      // CreateGroupRoutineDetailScreen으로 이동 (API 호출 없이)
      navigation.navigate('CreateGroupRoutineDetail', {
        routineData: {
          name: routineName,
          category: selectedCategory,
          days: selectedDays,
          startTime,
          endTime,
          description: description, // 설명도 전달
        },
      });
    }
  };

  const isFormValid =
    routineName.trim() && selectedDays.length > 0 && startTime && endTime;


  // 시간을 HH:mm 형식으로 변환하는 함수 (화면 표시용)
  const formatTimeForDisplay = (time: string): string => {
    // "오전 9:00" 또는 "오후 2:30" 형식을 "09:00" 또는 "14:30"으로 변환
    let hour: string;
    let minute: string;

    if (time.includes('오전')) {
      const hourStr = time.replace('오전 ', '').split(':')[0];
      minute = time.split(':')[1];
      // 오전 12시는 00:00으로 변환
      const hourNum = hourStr === '12' ? 0 : parseInt(hourStr);
      return `${hourNum.toString().padStart(2, '0')}:${minute}`;
    } else if (time.includes('오후')) {
      const hourStr = time.replace('오후 ', '').split(':')[0];
      minute = time.split(':')[1];
      // 오후 12시는 12:00으로 변환 (12 + 0 = 12)
      const hourNum = hourStr === '12' ? 12 : parseInt(hourStr) + 12;
      return `${hourNum.toString().padStart(2, '0')}:${minute}`;
    }
    return time; // 이미 HH:mm 형식이면 그대로 반환
  };

  // 시간을 HH:mm 형식으로 변환하는 함수 (API 요청용)
  const formatTimeForAPI = (time: string): string => {
    // "오전 9:00" 또는 "오후 2:30" 형식을 "09:00" 또는 "14:30"으로 변환
    if (time.includes('오전')) {
      const hourStr = time.replace('오전 ', '').split(':')[0];
      const minute = time.split(':')[1];
      // 오전 12시는 00:00으로 변환
      const hourNum = hourStr === '12' ? 0 : parseInt(hourStr);
      return `${hourNum.toString().padStart(2, '0')}:${minute}`;
    } else if (time.includes('오후')) {
      const hourStr = time.replace('오후 ', '').split(':')[0];
      const minute = time.split(':')[1];
      // 오후 12시는 12:00으로 변환 (12 + 0 = 12)
      const hourNum = hourStr === '12' ? 12 : parseInt(hourStr) + 12;
      return `${hourNum.toString().padStart(2, '0')}:${minute}`;
    }
    return time; // 이미 HH:mm 형식이면 그대로 반환
  };

  const handleStartTimeSelect = (time: string | number) => {
    console.log('🔍 handleStartTimeSelect 호출됨:', time, '타입:', typeof time);
    if (typeof time === 'string') {
      console.log('🔍 시작시간 설정 전:', startTime);
      console.log('🔍 시작시간 설정 후:', time);
      setStartTime(time);
      // 상태 업데이트 확인을 위한 추가 로그
      setTimeout(() => {
        console.log('🔍 setStartTime 후 실제 상태:', startTime);
      }, 100);
    } else {
      console.log('🔍 시간이 string이 아님:', time);
    }
    setShowStartTimePicker(false);
  };

  const handleEndTimeSelect = (time: string | number) => {
    console.log('🔍 handleEndTimeSelect 호출됨:', time, '타입:', typeof time);
    if (typeof time === 'string') {
      console.log('🔍 종료시간 설정 전:', endTime);
      console.log('🔍 종료시간 설정 후:', time);
      setEndTime(time);
      // 상태 업데이트 확인을 위한 추가 로그
      setTimeout(() => {
        console.log('🔍 setEndTime 후 실제 상태:', endTime);
      }, 100);
    } else {
      console.log('🔍 시간이 string이 아님:', time);
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
        <Title>{mode === 'edit' ? '단체 루틴 수정' : '단체 루틴 생성'}</Title>
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
          </InputContainer>
        </InputSection>

        {/* 소개 입력 */}
        <InputSection>
          <DescriptionContainer>
            <DescriptionTitle>소개</DescriptionTitle>
            <DescriptionInput
              placeholder="해당 루틴에 대한 소개를 해주세요."
              value={description}
              onChangeText={setDescription}
              placeholderTextColor={theme.colors.gray400}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </DescriptionContainer>
        </InputSection>


        {/* 요일 선택 */}
        <DayOfWeekSelector
          selectedDays={selectedDays}
          onDaysChange={setSelectedDays}
          readOnly={false}
          buttonSize={40}
          borderRadius={20}
        />

        {/* 시간 선택 */}
        <TimeRangeSelector
          startTime={startTime}
          endTime={endTime}
          onStartTimePress={() => {
            console.log('🔍 시작시간 버튼 클릭, 현재 startTime:', startTime);
            setShowStartTimePicker(true);
          }}
          onEndTimePress={() => {
            console.log('🔍 종료시간 버튼 클릭, 현재 endTime:', endTime);
            setShowEndTimePicker(true);
          }}
        />
      </Content>

      {/* 하단 버튼 */}
      <ButtonWrapper>
        <CustomButton
          text={mode === 'edit' ? '단체 루틴 수정' : '단체 루틴 생성'}
          onPress={handleSubmitRoutine}
          disabled={!isFormValid}
          backgroundColor={
            isFormValid ? theme.colors.primary : theme.colors.gray300
          }
          textColor={isFormValid ? theme.colors.white : theme.colors.gray500}
        />
      </ButtonWrapper>


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

export default CreateGroupRoutineScreen;

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
  color: #000000;
  padding: 16px 0;
  text-align: center;
`;

const DescriptionContainer = styled(TouchableOpacity)`
  background-color: #fafafa;
  border-radius: 10px;
  padding: 24px;
  min-height: 80px;
`;

const DescriptionTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${theme.colors.gray800};
  margin-bottom: 8px;
`;

const DescriptionInput = styled(TextInput)`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray400};
  line-height: 20px;
  height: 60px;
  padding: 0;
`;

const DescriptionText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 16px;
  color: ${theme.colors.gray600};
  line-height: 24px;
`;

const ButtonWrapper = styled.View`
  padding: 24px 16px;
  background-color: ${theme.colors.white};
`;

