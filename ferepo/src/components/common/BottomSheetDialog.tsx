import React from 'react';
import styled from 'styled-components/native';
import { Modal, Dimensions } from 'react-native';
import { theme } from '../../styles/theme';

interface BottomSheetDialogProps {
  visible: boolean;
  onRequestClose?: () => void;
  /** 모달 내용 */
  children: React.ReactNode;
  /** 핸들 표시 여부 (기본 true) */
  showHandle?: boolean;
  /** 배경 터치로 닫기 가능 여부 (기본 true) */
  dismissible?: boolean;
}

const BottomSheetDialog: React.FC<BottomSheetDialogProps> = ({
  visible,
  onRequestClose,
  children,
  showHandle = true,
  dismissible = true,
}) => {
  const handleBackdropPress = () => {
    if (dismissible && onRequestClose) {
      onRequestClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <ModalBackdrop onPress={handleBackdropPress} activeOpacity={1}>
        <BottomSheet>
          {showHandle && <SheetHandle />}
          <ContentContainer>{children}</ContentContainer>
        </BottomSheet>
      </ModalBackdrop>
    </Modal>
  );
};

export default BottomSheetDialog;

// styles
const ModalBackdrop = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.35);
  justify-content: flex-end;
`;

const BottomSheet = styled.View`
  background-color: ${theme.colors.white};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px 20px 16px 20px;
  width: 100%;
  max-height: 80%;
`;

const SheetHandle = styled.View`
  align-self: center;
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background-color: ${theme.colors.gray300};
  margin-bottom: 14px;
`;

const ContentContainer = styled.View`
  width: 100%;
  padding: 0;
`;
