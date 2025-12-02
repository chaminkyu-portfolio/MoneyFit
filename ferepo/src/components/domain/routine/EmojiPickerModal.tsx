import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { theme } from '../../../styles/theme';
import BottomSheetDialog from '../../common/BottomSheetDialog';
import { useRoutineEmojis } from '../../../hooks/routine/common/useCommonRoutines';
import SvgImage from '../../common/SvgImage';

// 카테고리 매핑 (한글 표시명 -> 영어 API 값)
const CATEGORY_MAPPING: Record<string, string> = {
  '교통': 'TRANSPORT',
  '음식': 'FOOD',
  '미용': 'BEAUTY',
  '생필품': 'DAILYESSENTIALS',
  '사치품': 'FLEX',
  '기타': 'OTHER',
};

interface EmojiPickerModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onEmojiSelect: (emoji: string, emojiId?: number) => void;
  categories?: string[];
}

const EmojiPickerModal = ({
  visible,
  onRequestClose,
  onEmojiSelect,
  categories = ['교통', '음식', '미용', '생필품', '사치품', '기타'],
}: EmojiPickerModalProps) => {
  // 화면 너비를 기준으로 이모지 크기와 간격 계산
  const screenWidth = Dimensions.get('window').width;
  const containerPadding = 24; // 좌우 패딩
  const availableWidth = screenWidth - containerPadding * 2;
  const numColumns = 6;
  const gap = 8; // 이모지 간 간격
  const totalGaps = numColumns - 1; // 총 간격 수
  const emojiSize = (availableWidth - totalGaps * gap) / numColumns;
  const [selectedCategory, setSelectedCategory] = useState(
    categories.length > 0 ? categories[0] : '교통',
  );

  // 선택된 카테고리를 영어 API 값으로 변환
  const selectedCategoryApi = CATEGORY_MAPPING[selectedCategory] || 'TRANSPORT';

  // 디버깅: API 호출 값 확인
  console.log('🔍 EmojiPickerModal API 호출 값:', {
    selectedCategory,
    selectedCategoryApi,
    mapping: CATEGORY_MAPPING[selectedCategory]
  });

  // 이모지 API 호출
  const { data: emojiData, isLoading: isLoadingEmojis } = useRoutineEmojis({
    category: selectedCategoryApi,
  });

  const handleCategoryPress = (category: string) => {
    console.log('🔍 카테고리 선택:', category, '-> API 호출:', CATEGORY_MAPPING[category]);
    setSelectedCategory(category);
  };

  const handleEmojiPress = (emoji: string, emojiId: number) => {
    console.log('🔍 이모지 선택:', { emoji, emojiId });
    onEmojiSelect(emoji, emojiId);
    onRequestClose();
  };

  // API에서 받아온 이모지 데이터
  const emojis = emojiData?.result?.items || [];

  return (
    <BottomSheetDialog
      visible={visible}
      onRequestClose={onRequestClose}
      dismissible={true}
    >
      <CategoryContainer>
        <CategoryScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <CategoryButton
              key={category}
              onPress={() => handleCategoryPress(category)}
              isSelected={selectedCategory === category}
            >
              <CategoryText isSelected={selectedCategory === category}>
                {category}
              </CategoryText>
            </CategoryButton>
          ))}
        </CategoryScrollView>
      </CategoryContainer>

      <EmojiFlatList
        data={emojis}
        keyExtractor={(item, index) => `${item.emojiId}-${index}`}
        renderItem={({ item }) => (
          <EmojiButton
            onPress={() => handleEmojiPress(item.emojiUrl, item.emojiId)}
            size={emojiSize}
            gap={gap}
          >
            <SvgImage
              uri={item.emojiUrl}
              width={20}
              height={20}
            />
          </EmojiButton>
        )}
        numColumns={6}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => null}
        ListHeaderComponent={() =>
          isLoadingEmojis ? <LoadingText>로딩 중...</LoadingText> : null
        }
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 0 }}
      />
    </BottomSheetDialog>
  );
};

export default EmojiPickerModal;

const CategoryContainer = styled.View`
  margin-bottom: 24px;
`;

const CategoryScrollView = styled.ScrollView`
  flex-direction: row;
`;

const CategoryButton = styled(TouchableOpacity)<{ isSelected: boolean }>`
  padding: 8px 16px;
  margin-right: 16px;
  border-bottom-width: 2px;
  border-bottom-color: ${({ isSelected }) =>
    isSelected ? theme.colors.primary : 'transparent'};
`;

const CategoryText = styled.Text<{ isSelected: boolean }>`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${({ isSelected }) =>
    isSelected ? theme.colors.primary : theme.colors.gray600};
`;

const EmojiFlatList = styled(FlatList)`
  height: 300px;
`;

const EmojiButton = styled(TouchableOpacity)<{ size: number; gap: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  background-color: ${theme.colors.gray50};
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  margin: ${({ gap }) => gap / 2}px;
`;

const EmojiText = styled.Text`
  font-size: 16px;
`;

const LoadingText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray500};
  text-align: center;
  padding: 20px;
`;

const EmptyText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray500};
  text-align: center;
  padding: 20px;
`;
