import React, { useState } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Text, View } from 'react-native';
import { theme } from '../../../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import DayButton from './DayButton';

interface DayOfWeekSelectorProps {
  selectedDays: string[];
  onDaysChange: (days: string[]) => void;
  onStartDatePress?: () => void;
  selectedStartDate?: string;
  readOnly?: boolean;
  buttonSize?: number;
  borderRadius?: number;
}

const DayOfWeekSelector = ({
  selectedDays,
  onDaysChange,
  onStartDatePress,
  selectedStartDate,
  readOnly = false,
  buttonSize = 28,
  borderRadius = 14,
}: DayOfWeekSelectorProps) => {
  const days = ['월', '화', '수', '목', '금', '토', '일'];

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

  const handleDayPress = (day: string) => {
    if (readOnly) return; // 읽기 전용일 때는 클릭 무시

    if (selectedDays.includes(day)) {
      // 요일 제거 시에도 정렬 유지
      const newDays = selectedDays.filter((d) => d !== day);
      onDaysChange(sortDaysByOrder(newDays));
    } else {
      // 요일 추가 시 정렬
      const newDays = [...selectedDays, day];
      onDaysChange(sortDaysByOrder(newDays));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };

  return (
    <Container>
      {!readOnly && (
        <HeaderRow>
          <Label>요일</Label>
          {onStartDatePress && (
            <StartDateButton onPress={onStartDatePress}>
              <StartDateText>
                {selectedStartDate
                  ? formatDate(selectedStartDate)
                  : '시작 날짜 선택'}
              </StartDateText>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={theme.colors.gray600}
              />
            </StartDateButton>
          )}
        </HeaderRow>
      )}
      <DaysContainer>
        {days.map((day) => (
          <DayButton
            key={day}
            day={day}
            isSelected={selectedDays.includes(day)}
            onPress={() => handleDayPress(day)}
            disabled={readOnly}
            buttonSize={buttonSize}
            borderRadius={borderRadius}
          />
        ))}
      </DaysContainer>
    </Container>
  );
};

export default DayOfWeekSelector;

const Container = styled.View`
  margin-bottom: 24px;
  padding: 24px;
  background-color: #fafafa;
  border-radius: 10px;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const Label = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${theme.colors.gray800};
`;

const StartDateButton = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const StartDateText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 11px;
  color: ${theme.colors.gray400};
`;

const DaysContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 4px;
`;
