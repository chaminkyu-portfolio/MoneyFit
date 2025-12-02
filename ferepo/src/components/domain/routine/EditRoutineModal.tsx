import React, { useState } from 'react';
import { Modal, View, Alert } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import EmojiPickerModal from './EmojiPickerModal';
import TimePickerModal from './TimePickerModal';

interface EditRoutineModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (emoji: string, text: string, time: string) => void;
  initialEmoji: string;
  initialText: string;
  initialTime: string;
}

const EditRoutineModal: React.FC<EditRoutineModalProps> = ({
  visible,
  onClose,
  onSave,
  initialEmoji,
  initialText,
  initialTime,
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState(initialEmoji);
  const [currentText, setCurrentText] = useState(initialText);
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  const handleSave = () => {
    if (!selectedEmoji || !currentText.trim() || !selectedTime) {
      // Alert 제거 - 토스트나 다른 UI 컴포넌트로 대체 예정
      console.log('입력 오류: 모든 필드를 입력해주세요.');
      return;
    }
    onSave(selectedEmoji, currentText.trim(), selectedTime);
    onClose();
  };

  const handleClose = () => {
    // 변경사항이 있으면 확인
    if (
      selectedEmoji !== initialEmoji ||
      currentText !== initialText ||
      selectedTime !== initialTime
    ) {
      // Alert 제거 - 토스트나 다른 UI 컴포넌트로 대체 예정
      console.log('변경사항 저장: 변경사항을 저장하시겠습니까?');
      // 임시로 저장 후 닫기
      handleSave();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <Container>
        <Header>
          <HeaderTitle>루틴 수정</HeaderTitle>
          <CloseButton onPress={handleClose}>
            <Ionicons name="close" size={24} color={theme.colors.gray600} />
          </CloseButton>
        </Header>

        <Content>
          <EditSection>
            <SectionTitle>이모지</SectionTitle>
            <EmojiButton onPress={() => setEmojiPickerVisible(true)}>
              <EmojiText>{selectedEmoji || '😊'}</EmojiText>
              <Ionicons
                name="chevron-down"
                size={16}
                color={theme.colors.gray600}
              />
            </EmojiButton>
          </EditSection>

          <EditSection>
            <SectionTitle>루틴 내용</SectionTitle>
            <TextInput
              value={currentText}
              onChangeText={setCurrentText}
              placeholder="루틴을 입력해주세요"
              multiline
            />
          </EditSection>

          <EditSection>
            <SectionTitle>시간</SectionTitle>
            <TimeButton onPress={() => setTimePickerVisible(true)}>
              <TimeText>{selectedTime || '시간 선택'}</TimeText>
              <Ionicons
                name="chevron-down"
                size={16}
                color={theme.colors.gray600}
              />
            </TimeButton>
          </EditSection>
        </Content>

        <SaveButton onPress={handleSave}>
          <SaveButtonText>저장</SaveButtonText>
        </SaveButton>

        <EmojiPickerModal
          visible={emojiPickerVisible}
          onRequestClose={() => setEmojiPickerVisible(false)}
          onEmojiSelect={(emoji) => {
            setSelectedEmoji(emoji);
            setEmojiPickerVisible(false);
          }}
        />

        <TimePickerModal
          visible={timePickerVisible}
          onRequestClose={() => setTimePickerVisible(false)}
          onTimeSelect={(time) => {
            if (typeof time === 'number') {
              setSelectedTime(`${time}분`);
            } else {
              setSelectedTime(time);
            }
            setTimePickerVisible(false);
          }}
          type="minutes"
        />
      </Container>
    </Modal>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.gray200};
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.gray900};
`;

const CloseButton = styled.TouchableOpacity`
  padding: 4px;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 20px;
`;

const EditSection = styled.View`
  margin-bottom: 24px;
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.gray900};
  margin-bottom: 8px;
`;

const EmojiButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-width: 1px;
  border-color: ${theme.colors.gray300};
  border-radius: 8px;
  background-color: ${theme.colors.white};
`;

const EmojiText = styled.Text`
  font-size: 24px;
`;

const TextInput = styled.TextInput`
  padding: 16px;
  border-width: 1px;
  border-color: ${theme.colors.gray300};
  border-radius: 8px;
  background-color: ${theme.colors.white};
  font-size: 16px;
  min-height: 80px;
  text-align-vertical: top;
`;

const TimeButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-width: 1px;
  border-color: ${theme.colors.gray300};
  border-radius: 8px;
  background-color: ${theme.colors.white};
`;

const TimeText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.gray900};
`;

const SaveButton = styled.TouchableOpacity`
  margin: 20px;
  padding: 16px;
  background-color: ${theme.colors.primary};
  border-radius: 8px;
  align-items: center;
`;

const SaveButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.white};
`;

export default EditRoutineModal;
