import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';

interface CommentCardProps {
  profileImage: string;
  nickname: string;
  comment: string;
  timestamp: string;
  likeCount: number;
}

const CommentCard = ({
  profileImage,
  nickname,
  comment,
  timestamp,
  likeCount,
}: CommentCardProps) => {
  return (
    <Container>
      <Header>
        <ProfileImage source={{ uri: profileImage }} />
        <UserInfo>
          <Nickname>{nickname}</Nickname>
          <Timestamp>{timestamp}</Timestamp>
        </UserInfo>
      </Header>
      <CommentText>{comment}</CommentText>
      <LikeButton>
        <LikeIcon>❤️</LikeIcon>
        <LikeCount>{likeCount}</LikeCount>
      </LikeButton>
    </Container>
  );
};

export default CommentCard;

const Container = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const ProfileImage = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  margin-right: 8px;
`;

const UserInfo = styled.View`
  flex: 1;
`;

const Nickname = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.gray800};
`;

const Timestamp = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 12px;
  color: ${theme.colors.gray500};
  margin-top: 2px;
`;

const CommentText = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray700};
  line-height: 20px;
  margin-bottom: 8px;
`;

const LikeButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
`;

const LikeIcon = styled.Text`
  font-size: 14px;
  margin-right: 4px;
`;

const LikeCount = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 12px;
  color: ${theme.colors.gray600};
`;
