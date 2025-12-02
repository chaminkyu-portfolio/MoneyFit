import React, { useState } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Text } from 'react-native';

import { theme } from '../../styles/theme';

/**
 * TabNavigation의 props 인터페이스
 */
interface ITabNavigationProps {
  /** 현재 선택된 탭 인덱스 */
  selectedIndex: number;
  /** 탭 변경 시 호출되는 콜백 */
  onTabChange: (index: number) => void;
  /** 탭 라벨 배열 */
  tabs: string[];
  /** 컨테이너 스타일 */
  containerStyle?: any;
}

/**
 * 범용 탭 네비게이션 컴포넌트
 * @param props - 컴포넌트 props
 * @returns 탭 네비게이션 컴포넌트
 */
const TabNavigation = ({
  selectedIndex,
  onTabChange,
  tabs,
  containerStyle,
}: ITabNavigationProps) => {
  const [textWidths, setTextWidths] = useState<number[]>([]);

  const handleTextLayout = (index: number, event: any) => {
    const { width } = event.nativeEvent.layout;
    setTextWidths((prev) => {
      const newWidths = [...prev];
      newWidths[index] = width;
      return newWidths;
    });
  };

  return (
    <UnderlineContainer style={containerStyle}>
      {tabs.map((tab, index) => (
        <UnderlineTabButton
          key={index}
          onPress={() => onTabChange(index)}
          isSelected={selectedIndex === index}
        >
          <UnderlineTabText
            isSelected={selectedIndex === index}
            onLayout={(event) => handleTextLayout(index, event)}
          >
            {tab}
          </UnderlineTabText>
          {selectedIndex === index && (
            <SelectedIndicator style={{ width: textWidths[index] || 0 }} />
          )}
        </UnderlineTabButton>
      ))}
    </UnderlineContainer>
  );
};

export default TabNavigation;

// Underline 스타일 (기본)
const UnderlineContainer = styled.View`
  flex-direction: row;
  gap: 16px;
`;

const UnderlineTabButton = styled(TouchableOpacity)<{ isSelected: boolean }>`
  align-items: flex-start;
  padding: 16px 0;
`;

const UnderlineTabText = styled.Text<{ isSelected: boolean }>`
  font-size: 16px;
  font-family: ${(props) =>
    props.isSelected ? theme.fonts.SemiBold : theme.fonts.Regular};
  color: ${(props) =>
    props.isSelected ? theme.colors.primary : theme.colors.gray400};
  margin-bottom: 8px;
  align-self: flex-start;
`;

const SelectedIndicator = styled.View`
  height: 2px;
  background-color: ${theme.colors.primary};
  border-radius: 1px;
`;
