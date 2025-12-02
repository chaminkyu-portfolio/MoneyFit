import React from 'react';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../styles/theme';

interface IHeaderProps {
  /** 헤더 제목 (선택사항) */
  title?: string;
  /** 뒤로가기 버튼 클릭 핸들러 (선택사항) */
  onBackPress?: () => void;
  /** 헤더 우측에 표시할 컴포넌트 (선택사항) */
  rightComponent?: React.ReactNode;
}

/**
 * 공통 헤더 컴포넌트
 * 뒤로가기 버튼과 제목을 포함한 일관된 헤더를 제공합니다.
 * @param props - 컴포넌트 props
 * @returns 헤더 컴포넌트
 */
const Header = ({ title, onBackPress, rightComponent }: IHeaderProps) => {
  return (
    <Container>
      {onBackPress ? (
        <BackButton onPress={onBackPress}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.gray900}
          />
        </BackButton>
      ) : (
        <Spacer />
      )}
      {title ? <Title>{title}</Title> : <Spacer />}
      {rightComponent ? rightComponent : <Spacer />}
    </Container>
  );
};

export default Header;

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  min-height: 56px;
`;

const BackButton = styled.TouchableOpacity`
  padding: 4px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray900};
`;

const Spacer = styled.View`
  width: 40px;
`;
