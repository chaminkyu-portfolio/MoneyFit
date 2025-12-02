import React, { useState } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../../styles/theme';

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (keyword: string) => void;
  onClear?: () => void;
  hasSearchResults?: boolean;
}

const SearchInput = ({
  placeholder = '루틴 명을 입력해주세요.',
  onSearch,
  onClear,
  hasSearchResults = false,
}: SearchInputProps) => {
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    if (onSearch && keyword.trim()) {
      onSearch(keyword.trim());
    }
  };

  const handleClear = () => {
    setKeyword('');
    if (onClear) {
      onClear();
    }
  };

  // 검색 결과가 있을 때 X 버튼을 누르면 전체 목록으로 돌아가기
  const handleXButtonPress = () => {
    if (hasSearchResults && keyword.length > 0) {
      // 검색 결과가 있고 키워드가 있으면 전체 목록으로 돌아가기
      setKeyword('');
      if (onClear) {
        onClear();
      }
    } else {
      // 그렇지 않으면 기존처럼 키워드만 지우기
      setKeyword('');
    }
  };

  return (
    <Container>
      <Input
        value={keyword}
        onChangeText={setKeyword}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.gray400}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />

      {keyword.length > 0 && (
        <ClearButton onPress={handleXButtonPress}>
          <Ionicons
            name="close-circle"
            size={20}
            color={theme.colors.gray500}
          />
        </ClearButton>
      )}

      <SearchButton onPress={handleSearch}>
        <Ionicons name="search" size={20} color={theme.colors.primary} />
      </SearchButton>
    </Container>
  );
};

export default SearchInput;

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #f7f8fa;
  border-radius: 12px;
  padding: 12px 16px;
`;

const Input = styled.TextInput`
  flex: 1;
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray800};
  padding: 2px;
`;

const ClearButton = styled(TouchableOpacity)`
  margin-left: 8px;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
`;

const SearchButton = styled(TouchableOpacity)`
  margin-left: 8px;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
`;
