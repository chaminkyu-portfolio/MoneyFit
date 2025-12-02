import React, { useState, useRef } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import RoutineItemAdder from './RoutineItemAdder';
import EmojiPickerModal from './EmojiPickerModal';
import TimePickerModal from './TimePickerModal';

interface CompletedRoutineItemProps {
  item: {
    emoji: string;
    text: string;
    time: string;
    isCompleted: boolean;
  };
  index: number;
  onEdit: (index: number, emoji: string, text: string, time: string) => void;
  onDelete: (index: number) => void;
  isEditMode?: boolean; // 수정 모드 prop 추가
}

const CompletedRoutineItem: React.FC<CompletedRoutineItemProps> = ({
  item,
  index,
  onEdit,
  onDelete,
  isEditMode = false, // 기본값 false
}) => {
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const swipeableRef = useRef<Swipeable>(null);

  const handleDelete = () => {
    onDelete(index);
  };

  const handleEmojiClick = () => {
    if (isEditMode) {
      // 수정 모드일 때는 이모지 선택 모달 열기
      console.log('이모지 클릭됨');
      setEmojiPickerVisible(true);
    }
    // 일반 모드일 때는 아무것도 하지 않음 (완료 처리는 ActiveRoutine에서만)
  };

  const handleTimeClick = () => {
    if (!isEditMode) return; // 수정 모드가 아니면 클릭 무시
    console.log('시간 클릭됨');
    setTimePickerVisible(true);
  };

  const handleEmojiSelect = (emoji: string) => {
    console.log('이모지 선택됨:', emoji);
    onEdit(index, emoji, item.text, item.time);
    setEmojiPickerVisible(false);
  };

  const handleTimeSelect = (time: string | number) => {
    console.log('시간 선택됨:', time);
    let timeString = '';
    if (typeof time === 'number') {
      timeString = `${time}분`;
    } else {
      timeString = time;
    }
    onEdit(index, item.emoji, item.text, timeString);
    setTimePickerVisible(false);
  };

  const renderRightActions = () => {
    return (
      <DeleteActionContainer>
        <DeleteActionButton onPress={handleDelete}>
          <Ionicons name="trash-outline" size={24} color={theme.colors.white} />
        </DeleteActionButton>
      </DeleteActionContainer>
    );
  };

  return (
    <>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={isEditMode ? renderRightActions : undefined}
        rightThreshold={40}
        enabled={isEditMode && !emojiPickerVisible && !timePickerVisible}
      >
        <RoutineItemAdder
          onPlusPress={handleEmojiClick}
          onClockPress={handleTimeClick}
          onTextChange={
            isEditMode
              ? (text) => onEdit(index, item.emoji, text, item.time)
              : undefined
          }
          selectedTime={item.time}
          selectedEmoji={item.emoji}
          currentText={item.text}
          placeholder={item.text}
          isCompleted={item.isCompleted}
          editable={isEditMode}
        />
      </Swipeable>

      {/* 모달들을 ReanimatedSwipeable 밖에 배치 */}
      {emojiPickerVisible && (
        <EmojiPickerModal
          visible={emojiPickerVisible}
          onRequestClose={() => setEmojiPickerVisible(false)}
          onEmojiSelect={handleEmojiSelect}
        />
      )}

      {timePickerVisible && (
        <TimePickerModal
          visible={timePickerVisible}
          onRequestClose={() => setTimePickerVisible(false)}
          onTimeSelect={handleTimeSelect}
          type="minutes"
          initialMinutes={parseInt(item.time.replace('분', ''))}
        />
      )}
    </>
  );
};

const DeleteActionContainer = styled.View`
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.error};
  border-radius: 8px;
  margin-left: 10px;
`;

const DeleteActionButton = styled.TouchableOpacity`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const DeleteButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.gray50};
  border-radius: 8px;
  border: 1px solid ${theme.colors.gray200};
`;

export default CompletedRoutineItem;
