import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { ActivityIndicator } from 'react-native';
import { theme } from '../../styles/theme';

interface Props {
  navigation: any;
}

const FinancialProductLoadingScreen = ({ navigation }: Props) => {
  useEffect(() => {
    const t = setTimeout(() => {
      navigation.replace('FinancialProduct');
    }, 5000);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <Container>
      <Title>맞춤 금융 상품 분석 중...</Title>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Description>잠시만 기다려주세요</Description>
    </Container>
  );
};

export default FinancialProductLoadingScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.white};
  gap: 12px;
`;

const Title = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 18px;
  color: ${theme.colors.gray900};
`;

const Description = styled.Text`
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
`;
