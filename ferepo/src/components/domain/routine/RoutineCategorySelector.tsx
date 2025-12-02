import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Text } from 'react-native';
import { theme } from '../../../styles/theme';

interface RoutineCategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const RoutineCategorySelector = ({
  selectedCategory,
  onCategoryChange,
}: RoutineCategorySelectorProps) => {
  const categories = [
    { id: 'life', name: '생활 루틴' },
    { id: 'finance', name: '소비 루틴' },
  ];

  const selectedCategoryName =
    categories.find((cat) => cat.id === selectedCategory)?.name || '생활 루틴';

  return (
    <Container>
      <HeaderRow>
        <Label>루틴 선택</Label>
        <CategoryButton onPress={onCategoryChange}>
          <CategoryText>{selectedCategoryName}</CategoryText>
        </CategoryButton>
      </HeaderRow>
    </Container>
  );
};

export default RoutineCategorySelector;

const Container = styled.View`
  margin-bottom: 24px;
  padding: 24px;
  background-color: #fafafa;
  border-radius: 10px;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${theme.colors.gray800};
`;

const CategoryButton = styled(TouchableOpacity)`
  padding: 12px 16px;
  border-radius: 10px;
  background-color: #fafafa;
  align-items: center;
`;

const CategoryText = styled(Text)`
  font-family: ${theme.fonts.SemiBold};
  font-size: 18px;
  color: ${theme.colors.primary};
`;
