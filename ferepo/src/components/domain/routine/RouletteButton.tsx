import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import Svg, { G, Path } from 'react-native-svg';
import { theme } from '../../../styles/theme';
import RouletteModal from './RouletteModal';

interface Participant {
  id: string;
  value: number;
  profileImage?: string;
}

interface RouletteButtonProps {
  // tickets?: number;
  onPointsEarned?: (winnerName: number) => void;
  isSpinning?: boolean;
  participants?: Participant[];
}

const RouletteButton: React.FC<RouletteButtonProps> = ({
  // tickets = 0,
  onPointsEarned,
  isSpinning = false,
  participants = [],
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSpin = (winnerName: number) => {
    onPointsEarned?.(winnerName);
    // setModalVisible(false)를 제거 - 모달을 바로 닫지 않음
    // 사용자가 X 버튼을 누르거나 Alert 확인을 눌렀을 때만 닫히도록 함
  };

  // 6조각 피자 모양 SVG 생성
  const createPizzaSlice = (index: number, colors: string[]) => {
    const angle = 60; // 360도 / 6조각 = 60도
    const startAngle = index * angle;
    const endAngle = (index + 1) * angle;
    
    const centerX = 12;
    const centerY = 12;
    const radius = 10;
    
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    return (
      <Path
        key={index}
        d={pathData}
        fill={colors[index]}
        stroke="#fff"
        strokeWidth="0.5"
      />
    );
  };

  const sliceColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

  return (
    <>
      <Button onPress={() => setModalVisible(true)}>
        <ButtonIcon>
          <Svg width={28} height={28} viewBox="0 0 24 24">
            <G>
              {Array.from({ length: 6 }, (_, index) => createPizzaSlice(index, sliceColors))}
            </G>
          </Svg>
        </ButtonIcon>
      </Button>

      <RouletteModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSpin={handleSpin}
        // tickets={tickets}
        isSpinning={isSpinning}
        participants={participants}
      />
    </>
  );
};

export default RouletteButton;

const Button = styled(TouchableOpacity)`
  position: absolute;
  bottom: 80px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 32px;
  background-color: #FF6B6B;
  justify-content: center;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 10;
  z-index: 999;
  border: 2px solid #fff;
`;

const ButtonIcon = styled.View`
  align-items: center;
  justify-content: center;
`;
