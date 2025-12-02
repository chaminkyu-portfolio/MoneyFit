import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Alert,
  Dimensions,
  Easing,
} from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../styles/theme';
import Svg, { G, Path, Text as SvgText, Circle } from 'react-native-svg';
import { useMemo } from 'react';

const { width: screenWidth } = Dimensions.get('window');

// 룰렛 크기/반지름 설정
const WHEEL_SIZE = 280;
const R = WHEEL_SIZE / 2;

interface Participant {
  id: string;
  value: number;
  profileImage?: string;
}

interface RouletteModalProps {
  visible: boolean;
  onClose: () => void;
  onSpin: (winnerName: number) => void;
  // tickets: number;
  isSpinning?: boolean;
  participants?: Participant[];
}

const RouletteModal: React.FC<RouletteModalProps> = ({
  visible,
  onClose,
  onSpin,
  // tickets,
  isSpinning = false,
  participants = [],
}) => {
  const [isLocalSpinning, setIsLocalSpinning] = useState(false);
  const [winnerName, setWinnerName] = useState<number | null>(null);
  const spinValue = useRef(new Animated.Value(0)).current;
  const baseRotationRef = useRef(0); // 누적 회전(도)
  const ticketCost = 1;

  // 언마운트 디버깅 및 모달 열릴 때 상태 초기화
  useEffect(() => {
    console.log('Roulette mounted');
    return () => console.log('Roulette unmounted');
  }, []);

  // 모달이 열릴 때 상태 초기화
  useEffect(() => {
    if (visible) {
      setWinnerName(null);
      setIsLocalSpinning(false);
      // 애니메이션 값을 현재 누적 회전 값으로 설정
      spinValue.setValue(baseRotationRef.current);
    }
  }, [visible]);

  // 포인트 기반 룰렛 섹션 - 메모이제이션
  const rouletteSections = useMemo(() => {
    return participants.map((p: Participant) => p.value);
  }, [participants]);

  // 부채꼴 path를 만들기 위한 헬퍼
  const polarToCartesian = (cx: number, cy: number, radius: number, angleRad: number) => ({
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  });

  // SVG 부채꼴 Path 만들기
  const makeSlicePath = (cx: number, cy: number, radius: number, startRad: number, endRad: number) => {
    const start = polarToCartesian(cx, cy, radius, startRad);
    const end = polarToCartesian(cx, cy, radius, endRad);
    const largeArc = endRad - startRad > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
  };

  // 조각 데이터 (path + 라벨 위치) 메모이제이션
  const slices = useMemo(() => {
    const n = rouletteSections.length;
    const anglePer = (2 * Math.PI) / n;
    const startOffset = -Math.PI / 2; // 12시 기준

    return rouletteSections.map((value, index) => {
      const start = startOffset + index * anglePer;
      const end = start + anglePer;
      const d = makeSlicePath(R, R, R - 2, start, end); // 2px 안쪽으로(테두리)
      const mid = (start + end) / 2;

      // 라벨 위치(중간 반지름)
      const label = polarToCartesian(R, R, R * 0.6, mid);

      // 참가자별로 다른 색상
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB6C1', '#98FB98'];
      const fill = colors[index % colors.length];

      return { d, fill, value, labelX: label.x, labelY: label.y };
    });
  }, [rouletteSections]);
  
  const handleSpin = () => {
    if (isLocalSpinning || participants.length === 0) return;

    setIsLocalSpinning(true);
    setWinnerName(null);

    const n = rouletteSections.length;
    const anglePer = 360 / n;

    // 결과 선택 (참가자 중 랜덤 선택)
    const randomIndex = Math.floor(Math.random() * n);
    const winnerName = rouletteSections[randomIndex];
    const targetCenter = randomIndex * anglePer + anglePer / 2; // 그 조각의 중앙각(도)

    // ★ 현재 애니메이션 값(도)을 안전하게 가져옴 (native driver에서도 OK)
    spinValue.stopAnimation((current) => {
      // 현재 각도와 목표 중앙각 사이의 시계 방향 회전량(0~360)
      const cur = ((current % 360) + 360) % 360;
      const delta =
        ((360 - targetCenter - cur) % 360 + 360) % 360;

      const extraTurns = 5 + Math.floor(Math.random() * 3); // 5~7바퀴 보장
      const to = current + extraTurns * 360 + delta;

      Animated.timing(spinValue, {
        toValue: to,
        duration: 3500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        // 최종 각도 정규화(0~360)
        const final = ((to % 360) + 360) % 360;
        baseRotationRef.current = final;

        // 다음 스핀을 위해 애니메이션 값을 즉시 정규화 (시각적 점프 없음)
        spinValue.setValue(final);

        setIsLocalSpinning(false);
        setWinnerName(winnerName);
        onSpin(winnerName);

        // Alert.alert('축하합니다!', `${winnerName}포인트 획득!`, [
        //   { text: '확인' },
        // ]);

        // 문구는 10초 뒤 자동 숨김(모달은 유지)
        setTimeout(() => setWinnerName(null), 10000);

        // 자가진단 로그 (원인 파악용)
        const landedIndex = Math.floor(((360 - baseRotationRef.current) / anglePer) + 0.5) % n;
        console.log('chosen:', randomIndex, 'landed:', landedIndex);
      });
    });
  };

  const spinInterpolate = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const canSpin = !isSpinning && !isLocalSpinning;

  // 모달이 닫힐 때 상태 초기화
  const handleClose = () => {
    setWinnerName(null);
    setIsLocalSpinning(false);
    // 애니메이션 값도 초기화 (다음 스핀을 위해)
    spinValue.setValue(baseRotationRef.current);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <ModalOverlay>
        <ModalContainer>
          {/* 헤더 */}
          <Header>
            <Title>룰렛</Title>
            <CloseButton onPress={handleClose}>
              <Ionicons name="close" size={24} color="#000" />
            </CloseButton>
          </Header>

          {/* 설명 */}
          {/* <Description>
            룰렛을 돌리면 티켓 {ticketCost}장이 차감됩니다
          </Description> */}

          {/* 티켓 정보 */}
          {/* <TicketInfo>
            <TicketIcon>
              <Ionicons name="ticket" size={20} color="#8B4513" />
            </TicketIcon>
            <TicketText>내 보유티켓 {tickets}장</TicketText>
          </TicketInfo> */}

          {/* 룰렛 */}
          <RouletteContainer>
            <RouletteWheel
              style={{ transform: [{ rotate: spinInterpolate }] }}
            >
              <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
                <G>
                  {slices.map((s, i) => (
                    <G key={i}>
                      <Path d={s.d} fill={s.fill} stroke="#ffffff" strokeWidth={2} />
                      <SvgText
                        x={s.labelX}
                        y={s.labelY}
                        fontSize={14}
                        fontWeight="700"
                        fill="#333"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                      >
                        {s.value}
                      </SvgText>
                    </G>
                  ))}
                  {/* 테두리 */}
                  <Circle cx={R} cy={R} r={R - 2} fill="transparent" stroke="#00000033" strokeWidth={2} />
                </G>
              </Svg>
            </RouletteWheel>

            {/* 중앙 원/포인터 그대로 유지 */}
            
            <Pointer />
          </RouletteContainer>

          {/* 당첨자 표시 */}
          {/* {winnerName !== null && (
            <WonPointsContainer>
              <WonPointsText>
                🎉 {winnerName}포인트 획득! 🎉
              </WonPointsText>
            </WonPointsContainer>
          )} */}

          {/* 스핀 버튼 */}
          <SpinButton disabled={!canSpin} onPress={handleSpin}>
            <ButtonIcon>
              <Ionicons name="ticket" size={20} color="#fff" />
            </ButtonIcon>
            <ButtonText>
              {isSpinning || isLocalSpinning ? '돌리는 중...' : '룰렛 돌리기'}
            </ButtonText>
          </SpinButton>
        </ModalContainer>
      </ModalOverlay>
    </Modal>
  );
};

export default RouletteModal;

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.View`
  width: ${screenWidth - 40}px;
  background-color: #fff;
  border-radius: 20px;
  padding: 24px;
  align-items: center;
`;

const Header = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 24px;
  font-weight: 700;
  color: #000;
`;

const CloseButton = styled.TouchableOpacity`
  padding: 4px;
`;

const Description = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: #333;
  text-align: center;
  margin-bottom: 16px;
`;

const TicketInfo = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #F5F5DC;
  padding: 8px 16px;
  border-radius: 20px;
  margin-bottom: 24px;
`;

const TicketIcon = styled.View`
  margin-right: 8px;
`;

const TicketText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: #8B4513;
`;

const RouletteContainer = styled.View`
  width: ${WHEEL_SIZE}px;
  height: ${WHEEL_SIZE}px;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
  position: relative;
`;

const RouletteWheel = styled(Animated.View)`
  width: ${WHEEL_SIZE}px;
  height: ${WHEEL_SIZE}px;
  border-radius: ${R}px;
  position: absolute;
`;

const CenterCircle = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: #fff;
  border: 3px solid #333;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 10;
`;

const CenterText = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 20px;
  font-weight: 700;
  color: #333;
`;

const Pointer = styled.View`
  position: absolute;
  top: -10px;
  left: 50%;
  margin-left: -8px;
  width: 0;
  height: 0;
  border-left-width: 8px;
  border-right-width: 8px;
  border-top-width: 20px;        /* ▲ 위로 향함 */
  border-left-color: transparent;
  border-right-color: transparent;
  border-top-color: #333;
  z-index: 20;
`;

const SpinButton = styled.TouchableOpacity<{ disabled: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${({ disabled }) => disabled ? '#ccc' : '#8B4513'};
  padding: 16px 32px;
  border-radius: 12px;
  width: 100%;
`;

const ButtonIcon = styled.View`
  margin-right: 8px;
`;

const ButtonText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: #fff;
`;

const WonPointsContainer = styled.View`
  background-color: #4CAF50;
  padding: 12px 24px;
  border-radius: 20px;
  margin-bottom: 16px;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;

const WonPointsText = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  text-align: center;
`;
