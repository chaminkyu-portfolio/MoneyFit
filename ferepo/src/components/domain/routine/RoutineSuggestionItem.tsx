import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../styles/theme';
import SvgImage from '../../common/SvgImage';

interface RoutineSuggestionItemProps {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
}

const RoutineSuggestionItem: React.FC<RoutineSuggestionItemProps> = ({
  icon,
  title,
  description,
  onPress,
}) => {
  // 이모지가 URL인지 텍스트 이모지인지 판단 (성능 최적화)
  const isEmojiUrl = icon && icon.startsWith('http');
  const isTextEmoji = icon && icon.length <= 4 && !isEmojiUrl; // 이모지 텍스트는 보통 1-4자

  // 유효하지 않은 아이콘인 경우 기본 아이콘 사용
  const displayIcon = icon && icon.trim() !== '' ? icon : '📝';

  return (
    <Container onPress={onPress}>
      <IconContainer>
        {isEmojiUrl ? (
          <SvgImage uri={displayIcon} width={20} height={20} />
        ) : (
          <IconText>{displayIcon}</IconText>
        )}
      </IconContainer>

      <ContentContainer>
        <TitleText>{title}</TitleText>
        <DescriptionText>{description}</DescriptionText>
      </ContentContainer>

      <AddButton>
        <Ionicons name="add" size={24} color={theme.colors.gray400} />
      </AddButton>
    </Container>
  );
};

export default RoutineSuggestionItem;

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: flex-start;
  background-color: ${theme.colors.white};
  padding: 16px;
  margin-bottom: 8px;
`;

const IconContainer = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${theme.colors.gray100};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const IconText = styled.Text`
  font-size: 28px;
`;

const EmojiImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const ContentContainer = styled.View`
  flex: 1;
`;

const TitleText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${theme.colors.gray800};
  /* margin-bottom: 4px; */
`;

const DescriptionText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 13px;
  color: ${theme.colors.gray400};
  line-height: 18px;
`;

const AddButton = styled.View`
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
`;
