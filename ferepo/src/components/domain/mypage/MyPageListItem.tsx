import React from 'react';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../../styles/theme';
import ToggleSwitch from './ToggleSwitch';

/**
 * MyPageListItem의 props 인터페이스
 */
interface IMyPageListItemProps {
  /** 아이템 제목 */
  title: string;
  /** 아이템 설명 (선택사항) */
  subtitle?: string;
  /** 우측에 표시할 텍스트 (선택사항) */
  rightText?: string;
  /** 우측 텍스트 색상 (기본값: error) */
  rightTextColor?: string;
  /** 클릭 핸들러 */
  onPress?: () => void;
  /** 토글 스위치 사용 여부 */
  isToggle?: boolean;
  /** 토글 상태 */
  toggleValue?: boolean;
  /** 토글 변경 핸들러 */
  onToggleChange?: (value: boolean) => void;
  /** 화살표 표시 여부 (기본값: true) */
  showArrow?: boolean;
  /** 비활성화 여부 */
  disabled?: boolean;
}

/**
 * 마이페이지 리스트 아이템 컴포넌트
 * @param props - 컴포넌트 props
 * @returns 리스트 아이템 컴포넌트
 */
const MyPageListItem = ({
  title,
  subtitle,
  rightText,
  rightTextColor = theme.colors.error,
  onPress,
  isToggle = false,
  toggleValue = false,
  onToggleChange,
  showArrow = true,
  disabled = false,
}: IMyPageListItemProps) => {
  return (
    <Container onPress={onPress} disabled={disabled}>
      <LeftContent>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </LeftContent>

      <RightContent>
        {rightText && <RightText color={rightTextColor}>{rightText}</RightText>}

        {isToggle && onToggleChange && (
          <ToggleSwitch
            isEnabled={toggleValue}
            onToggle={onToggleChange}
            disabled={disabled}
          />
        )}

        {showArrow && !isToggle && (
          <ArrowIcon>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.gray400}
            />
          </ArrowIcon>
        )}
      </RightContent>
    </Container>
  );
};

export default MyPageListItem;

// 스타일 컴포넌트 정의
const Container = styled.TouchableOpacity<{ disabled?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.gray100};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const LeftContent = styled.View`
  flex: 1;
  margin-right: 16px;
`;

const Title = styled.Text`
  font-size: 16px;
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray900};
`;

const Subtitle = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  margin-top: 4px;
`;

const RightContent = styled.View`
  flex-direction: row;
  align-items: center;
`;

const RightText = styled.Text<{ color: string }>`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${(props) => props.color};
  margin-right: 8px;
`;

const ArrowIcon = styled.View`
  margin-left: 4px;
`;
