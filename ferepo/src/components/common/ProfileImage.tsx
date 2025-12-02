import React from 'react';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../styles/theme';

/**
 * ProfileImage의 props 인터페이스
 */
interface IProfileImageProps {
  /** 프로필 이미지 URI */
  imageUri?: string;
  /** 편집 버튼 클릭 핸들러 */
  onEditPress: () => void;
  /** 이미지 크기 (기본값: 80) */
  size?: number;
  /** 편집 버튼 표시 여부 (기본값: true) */
  showEditButton?: boolean;
}

/**
 * 프로필 이미지와 편집 버튼을 포함한 컴포넌트
 * @param props - 컴포넌트 props
 * @returns 프로필 이미지 컴포넌트
 */
const ProfileImage = ({
  imageUri,
  onEditPress,
  size = 80,
  showEditButton = true,
}: IProfileImageProps) => {
  return (
    <Container>
      <ProfileImageContainer size={size}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} />
        ) : (
          <DefaultImage size={size}>
            <Ionicons
              name="person"
              size={size * 0.4}
              color={theme.colors.gray400}
            />
          </DefaultImage>
        )}
      </ProfileImageContainer>
      {showEditButton && (
        <EditButton onPress={onEditPress} size={size}>
          <Ionicons name="pencil" size={16} color={theme.colors.white} />
        </EditButton>
      )}
    </Container>
  );
};

export default ProfileImage;

// 스타일 컴포넌트 정의
const Container = styled.View`
  position: relative;
  align-items: center;
  justify-content: center;
`;

const ProfileImageContainer = styled.View<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: ${(props) => props.size / 2}px;
  overflow: hidden;
  background-color: ${theme.colors.gray100};
  border-width: 1px;
  border-color: ${theme.colors.gray200};
`;

const Image = styled.Image`
  width: 100%;
  height: 100%;
`;

const DefaultImage = styled.View<{ size: number }>`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.gray100};
`;

const EditButton = styled.TouchableOpacity<{ size: number }>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: ${theme.colors.primary};
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: ${theme.colors.white};
`;
