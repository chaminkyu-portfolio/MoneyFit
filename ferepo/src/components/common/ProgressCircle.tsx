import React, { useEffect, useRef } from 'react';
import styled from 'styled-components/native';
import { Animated } from 'react-native';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import { theme } from '../../styles/theme';

interface ProgressCircleProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  /** 과거 prop 호환용 */
  color?: string;
  /** 진행 원 색상 (권장) */
  progressColor?: string;
  /** 배경 원 색상 (옵션) */
  backgroundColor?: string;
  /** 가운데 % 텍스트 표시 여부 (기본값: true) */
  showText?: boolean;
  /** 진행 방향을 반대로(가득 찬 상태에서 감소) 표시 */
  reverse?: boolean;
}

const ProgressCircle = ({
  progress,
  size = 200,
  strokeWidth = 8,
  color = theme.colors.primary,
  progressColor,
  backgroundColor,
  showText = true,
  reverse = false,
}: ProgressCircleProps) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const animatedText = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedProgress, {
        toValue: progress,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(animatedText, {
        toValue: progress,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
  }, [progress]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: reverse ? [0, circumference] : [circumference, 0],
  });

  const animatedTextValue = animatedText.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 100],
  });

  const progressStrokeColor = progressColor ?? color ?? theme.colors.primary;
  const backgroundStrokeColor = backgroundColor ?? theme.colors.gray200;

  return (
    <Container size={size}>
      <Svg width={size} height={size}>
        {/* 배경 원 */}
        <SvgCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundStrokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* 진행률 원 */}
        <AnimatedSvgCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressStrokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {showText && (
        <AnimatedProgressText>{Math.round(progress)}%</AnimatedProgressText>
      )}
    </Container>
  );
};

export default ProgressCircle;

const Container = styled.View<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const AnimatedSvgCircle = Animated.createAnimatedComponent(SvgCircle);

const AnimatedProgressText = styled(Animated.Text)`
  position: absolute;
  font-size: 24px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.gray900};
`;
