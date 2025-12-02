import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';
import BottomSheetDialog from '../../common/BottomSheetDialog';
import CustomButton from '../../common/CustomButton';

interface DeleteRoutineModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
  routineName?: string;
  isDeleting?: boolean;
}

const DeleteRoutineModal = ({
  visible,
  onRequestClose,
  onConfirm,
  routineName = '루틴',
  isDeleting = false,
}: DeleteRoutineModalProps) => {
  return (
    <BottomSheetDialog visible={visible} onRequestClose={onRequestClose}>
      <ModalTitle>루틴 삭제</ModalTitle>
      <ModalSubtitle>"{routineName}" 루틴을 삭제하시겠습니까?</ModalSubtitle>
      <ButtonRow>
        <ButtonWrapper>
          <CustomButton
            text="취소"
            onPress={onRequestClose}
            backgroundColor={theme.colors.gray200}
            textColor={theme.colors.gray700}
            disabled={isDeleting}
          />
        </ButtonWrapper>
        <ButtonWrapper>
          <CustomButton
            text={isDeleting ? '삭제 중...' : '삭제'}
            onPress={onConfirm}
            backgroundColor={theme.colors.error}
            textColor={theme.colors.white}
            disabled={isDeleting}
          />
        </ButtonWrapper>
      </ButtonRow>
    </BottomSheetDialog>
  );
};

export default DeleteRoutineModal;

const ModalTitle = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 18px;
  color: ${theme.colors.gray900};
  text-align: center;
`;

const ModalSubtitle = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 13px;
  color: ${theme.colors.gray600};
  text-align: center;
  margin-top: 8px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-top: 20px;
`;

const ButtonWrapper = styled.View`
  flex: 1;
`;
