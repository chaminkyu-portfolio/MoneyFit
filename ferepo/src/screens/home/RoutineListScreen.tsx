import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import { DeleteRoutineModal } from '../../components/domain/routine';
import {
  usePersonalRoutines,
  useDeletePersonalRoutineList,
} from '../../hooks/routine/personal/usePersonalRoutines';

interface RoutineListScreenProps {
  navigation: any;
}

const RoutineListScreen = ({ navigation }: RoutineListScreenProps) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<any>(null);

  // 루틴 리스트 조회
  const { data: routinesData, isLoading } = usePersonalRoutines({
    date: new Date().toISOString().split('T')[0], // 오늘 날짜
  });

  // 루틴 삭제 훅
  const { mutate: deleteRoutine, isPending: isDeleting } =
    useDeletePersonalRoutineList();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEditRoutine = (routine: any) => {
    navigation.navigate('CreateRoutine', {
      mode: 'edit',
      routineData: routine,
    });
  };

  const handleDeleteRoutine = (routine: any) => {
    setSelectedRoutine(routine);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedRoutine?.id) return;

    deleteRoutine(selectedRoutine.id.toString(), {
      onSuccess: (data) => {
        setDeleteModalVisible(false);
        setSelectedRoutine(null);
        // 성공 메시지나 토스트 표시
      },
      onError: (error) => {
        console.error('🔍 루틴 삭제 실패:', error);
        setDeleteModalVisible(false);
        setSelectedRoutine(null);
        // 에러 메시지나 토스트 표시
      },
    });
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setSelectedRoutine(null);
  };

  const routines = routinesData?.result?.items || [];

  return (
    <Container edges={['top', 'left', 'right', 'bottom']}>
      <Header title="루틴 리스트" onBackPress={handleBack} />
      <Content>
        <Title>내 루틴 목록</Title>

        {isLoading ? (
          <LoadingContainer>{null}</LoadingContainer>
        ) : routines.length === 0 ? (
          <EmptyContainer>
            <EmptyText>등록된 루틴이 없습니다.</EmptyText>
          </EmptyContainer>
        ) : (
          <RoutineList>
            {routines.map((routine: any) => (
              <RoutineItem key={routine.id}>
                <RoutineInfo>
                  <RoutineName>{routine.title}</RoutineName>
                  <RoutineTime>
                    {routine.startTime} ~ {routine.endTime}
                  </RoutineTime>
                  <RoutineType>
                    {routine.routineType === 'DAILY' ? '생활' : '재정'}
                  </RoutineType>
                  <RoutineDays>{routine.dayTypes?.join(', ')}</RoutineDays>
                </RoutineInfo>
                <ActionButtons>
                  <EditButton onPress={() => handleEditRoutine(routine)}>
                    <EditButtonText>수정</EditButtonText>
                  </EditButton>
                  <DeleteButton onPress={() => handleDeleteRoutine(routine)}>
                    <DeleteButtonText>삭제</DeleteButtonText>
                  </DeleteButton>
                </ActionButtons>
              </RoutineItem>
            ))}
          </RoutineList>
        )}
      </Content>

      <DeleteRoutineModal
        visible={deleteModalVisible}
        onRequestClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        routineName={selectedRoutine?.title}
        isDeleting={isDeleting}
      />
    </Container>
  );
};

export default RoutineListScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const Title = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 24px;
  color: ${theme.colors.gray800};
  margin-bottom: 24px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const LoadingText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 16px;
  color: ${theme.colors.gray500};
`;

const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const EmptyText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 16px;
  color: ${theme.colors.gray500};
`;

const RoutineList = styled.View`
  gap: 16px;
`;

const RoutineItem = styled.View`
  background-color: ${theme.colors.gray50};
  border-radius: 12px;
  padding: 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const RoutineInfo = styled.View`
  flex: 1;
`;

const RoutineName = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${theme.colors.gray800};
  margin-bottom: 4px;
`;

const RoutineTime = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
  margin-bottom: 4px;
`;

const RoutineType = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 12px;
  color: ${theme.colors.primary};
  margin-bottom: 4px;
`;

const RoutineDays = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 12px;
  color: ${theme.colors.gray500};
`;

const ActionButtons = styled.View`
  flex-direction: row;
  gap: 8px;
`;

const EditButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  border-radius: 8px;
  padding: 8px 12px;
`;

const EditButtonText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 12px;
  color: ${theme.colors.white};
`;

const DeleteButton = styled.TouchableOpacity`
  background-color: ${theme.colors.error};
  border-radius: 8px;
  padding: 8px 12px;
`;

const DeleteButtonText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 12px;
  color: ${theme.colors.white};
`;
