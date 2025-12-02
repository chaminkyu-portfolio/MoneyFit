import React, { useState } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Text, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { theme } from '../../../styles/theme';
import { Ionicons } from '@expo/vector-icons';

// 한국어 기본 설정
LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
    '일요일',
  ],
  dayNamesShort: ['월', '화', '수', '목', '금', '토', '일'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

interface DatePickerModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onDateSelect: (date: string) => void;
}

const DatePickerModal = ({
  visible,
  onRequestClose,
  onDateSelect,
}: DatePickerModalProps) => {
  // 현재 날짜 가져오기
  const getKoreanDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getKoreanDate());

  const handleDateSelect = (date: string) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 오늘 날짜 포함해서 선택 가능
    if (selectedDate >= today) {
      setSelectedDate(date);
    }
  };

  const handleComplete = () => {
    onDateSelect(selectedDate);
    onRequestClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };

  return (
    <Container visible={visible}>
      <ModalOverlay onPress={onRequestClose} />
      <ModalContent>
        <Handle />

        <Calendar
          current={selectedDate}
          onDayPress={(day) => handleDateSelect(day.dateString)}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: theme.colors.primary,
            },
          }}
          renderHeader={(date) => {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            return <HeaderText>{`${year}년 ${month}월`}</HeaderText>;
          }}
          theme={{
            backgroundColor: 'transparent',
            calendarBackground: 'transparent',
            textSectionTitleColor: theme.colors.gray800,
            selectedDayBackgroundColor: theme.colors.primary,
            selectedDayTextColor: theme.colors.white,
            todayTextColor: theme.colors.primary,
            dayTextColor: theme.colors.gray800,
            textDisabledColor: theme.colors.gray400,
            dotColor: theme.colors.primary,
            selectedDotColor: theme.colors.white,
            arrowColor: theme.colors.gray600,
            monthTextColor: theme.colors.gray800,
            indicatorColor: theme.colors.primary,
            textDayFontFamily: theme.fonts.Medium,
            textMonthFontFamily: theme.fonts.SemiBold,
            textDayHeaderFontFamily: theme.fonts.Medium,
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
        />

        <CompleteButton onPress={handleComplete}>
          <CompleteButtonText>선택 완료</CompleteButtonText>
        </CompleteButton>
      </ModalContent>
    </Container>
  );
};

export default DatePickerModal;

const Container = styled.View<{ visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: ${({ visible }) => (visible ? 'flex' : 'none')};
`;

const ModalOverlay = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${theme.colors.white};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  padding-bottom: 40px;
`;

const Handle = styled.View`
  width: 40px;
  height: 4px;
  background-color: ${theme.colors.gray300};
  border-radius: 2px;
  align-self: center;
  margin-bottom: 20px;
`;

const CompleteButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  padding: 16px;
  border-radius: 12px;
  align-items: center;
  margin-top: 20px;
`;

const CompleteButtonText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${theme.colors.white};
`;

const HeaderText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 18px;
  color: ${theme.colors.gray800};
  text-align: center;
`;
