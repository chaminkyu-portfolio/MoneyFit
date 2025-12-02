import React from 'react';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { formatTime } from '../../utils/timeFormat';

interface TimerProps {
  timeLeft: number;
  isTimeUp?: boolean;
}

const Timer = ({ timeLeft, isTimeUp = false }: TimerProps) => {
  return (
    <TimerContainer>
      <MaterialCommunityIcons
        name="clock-outline"
        size={20}
        color={isTimeUp ? theme.colors.error : theme.colors.gray600}
      />
      <TimerText isTimeUp={isTimeUp}>{formatTime(timeLeft)}</TimerText>
    </TimerContainer>
  );
};

export default Timer;

const TimerContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  margin-bottom: 40px;
`;

const TimerText = styled.Text<{ isTimeUp: boolean }>`
  font-size: ${theme.fonts.body}px;
  font-family: ${theme.fonts.Regular};
  color: ${(props) =>
    props.isTimeUp ? theme.colors.error : theme.colors.gray600};
`;
