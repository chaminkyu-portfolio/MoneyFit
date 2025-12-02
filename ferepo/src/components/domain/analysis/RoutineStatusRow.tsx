import React from 'react';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../../styles/theme';

/**
 * 루틴 완료 상태 타입
 */
type RoutineStatus = 'completed' | 'incomplete' | 'future' | 'optional';

/**
 * RoutineStatusRow의 props 인터페이스
 */
interface IRoutineStatusRowProps {
  /** 루틴 이름 */
  routineName: string;
  /** 요일별 상태 배열 */
  status: RoutineStatus[];
  /** 현재 선택된 요일 인덱스 */
  selectedDayIndex?: number;
}

/**
 * 루틴 상태 행 컴포넌트
 * 루틴 이름과 요일별 완료 상태를 표시합니다.
 * @param props - 컴포넌트 props
 * @returns 루틴 상태 행 컴포넌트
 */
const RoutineStatusRow = ({
  routineName,
  status,
  selectedDayIndex,
}: IRoutineStatusRowProps) => {
  // 루틴 이름이 4글자를 넘으면 4글자 + ... 으로 표시
  const displayName =
    routineName.length > 4 ? `${routineName.slice(0, 6)}...` : routineName;

  const getStatusStyle = (status: RoutineStatus, dayIndex: number) => {
    switch (status) {
      case 'completed':
        return {
          backgroundColor: theme.colors.primary,
          borderWidth: 0,
        };
      case 'incomplete':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.gray300,
          borderStyle: 'solid',
        };
      case 'optional':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.gray300,
          borderStyle: 'dotted',
        };
      case 'future':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.gray300,
          borderStyle: 'solid',
        };
      default:
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.gray300,
          borderStyle: 'solid',
        };
    }
  };

  return (
    <Container>
      <RoutineNameCell>
        <RoutineName numberOfLines={1}>{displayName}</RoutineName>
      </RoutineNameCell>
      {status.map((dayStatus, dayIndex) => (
        <StatusCell key={dayIndex}>
          <StatusCircle style={getStatusStyle(dayStatus, dayIndex)} />
        </StatusCell>
      ))}
    </Container>
  );
};

export default RoutineStatusRow;

const Container = styled.View`
  flex-direction: row;
  margin-bottom: 8px;
`;

const RoutineNameCell = styled.View`
  width: 80px;
  /* flex: 1; */
  padding: 8px 4px;
`;

const RoutineName = styled.Text`
  font-size: 12px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray700};
`;

const StatusCell = styled.View`
  flex: 1;
  align-items: center;
  padding: 8px 4px;
`;

const StatusCircle = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 10px;
`;
