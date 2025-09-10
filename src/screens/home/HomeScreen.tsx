import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../../styles/theme';

/**
 * HomeScreen의 props 인터페이스
 */
interface IHomeScreenProps {
  /** 네비게이션 객체 */
  navigation: any;
}

/**
 * 홈 화면 컴포넌트
 * 사용자의 메인 대시보드를 표시합니다.
 * @param props - 컴포넌트 props
 * @returns 홈 화면 컴포넌트
 */
const HomeScreen = ({ navigation }: IHomeScreenProps) => {
  return (
    <Container>
      <Content>
        <Title>홈</Title>
        <Subtitle>메인 홈 화면입니다.</Subtitle>
      </Content>
    </Container>
  );
};

export default HomeScreen;

// 스타일 컴포넌트 정의
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.gray900};
  margin-bottom: 8px;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
`;