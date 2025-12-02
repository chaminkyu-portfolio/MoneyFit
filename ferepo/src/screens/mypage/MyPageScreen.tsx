import React, { useState } from 'react';
import styled from 'styled-components/native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { FlatList, Linking } from 'react-native';

import { theme } from '../../styles/theme';
import ProfileImage from '../../components/common/ProfileImage';
import MyPageListItem from '../../components/domain/mypage/MyPageListItem';
import { useUserStore } from '../../store';
import { useMyInfo } from '../../hooks/user/useUser';

/**
 * MyPageScreen의 props 인터페이스
 */
interface IMyPageScreenProps {
  /** 네비게이션 객체 */
  navigation: any;
}

/**
 * 마이페이지 화면 컴포넌트
 * 사용자의 메인 마이페이지를 표시합니다.
 * @param props - 컴포넌트 props
 * @returns 마이페이지 화면 컴포넌트
 */
const MyPageScreen = ({ navigation }: IMyPageScreenProps) => {
  const insets = useSafeAreaInsets();

  // 내 정보 조회 API 호출
  const { data: myInfo, isLoading } = useMyInfo();

  // Zustand 스토어에서 사용자 정보 가져오기 (기존 포인트 정보 등)
  const { userInfo } = useUserStore();

  // 리스트 데이터
  const listData = [
    {
      id: 'profile',
      type: 'item',
      title: '내 정보 관리',
      onPress: () => navigation.navigate('ProfileEdit'),
    },
    {
      id: 'points',
      type: 'item',
      title: '포인트 상점',
      onPress: () => navigation.navigate('PointGifticon'),
    },
    {
      id: 'suggestion',
      type: 'item',
      title: '서비스 건의하기',
      onPress: () =>
        Linking.openURL(
          'https://docs.google.com/forms/d/12zpygPHpxYbzq_QjjkT6dDgMmLB8GZKY-IOeeqcuf_s/edit?hl=ko',
        ),
    },
    {
      id: 'license',
      type: 'item',
      title: '오픈소스 라이선스',
      onPress: () =>
        Linking.openURL(
          'https://ryuwon-project.notion.site/Open-Source-Licenses-23ea58d49be680d5bc21d691a47207cb?source=copy_link',
        ),
    },
    {
      id: 'privacy',
      type: 'item',
      title: '개인정보 처리방침',
      onPress: () =>
        Linking.openURL(
          'https://ryuwon-project.notion.site/25ca58d49be6805497e2f4f26402572e?source=copy_link',
        ),
    },
    {
      id: 'terms',
      type: 'item',
      title: '서비스 이용약관',
      onPress: () =>
        Linking.openURL(
          'https://ryuwon-project.notion.site/25ca58d49be68065aefbffe89d194664?source=copy_link',
        ),
    },
  ];

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <>
        <MyPageListItem
          title={item.title}
          onPress={item.onPress}
          showArrow={true}
        />
        {index === 2 && <Separator />}
      </>
    );
  };

  return (
    <Container edges={['top', 'left', 'right']}>
      <Content>
        <ProfileSection insets={insets}>
          <ProfileImage
            imageUri={
              userInfo?.profileImage || myInfo?.result?.userImage || undefined
            }
            onEditPress={() => {}}
            size={64}
            showEditButton={false}
          />
          <ProfileInfo>
            <UserName>
              {userInfo?.nickname || myInfo?.result?.nickname || '사용자'}
            </UserName>
            <UserUniversity>
              {myInfo?.result?.university && myInfo?.result?.major
                ? `${myInfo.result.university} · ${myInfo.result.major}`
                : userInfo?.university && userInfo?.major
                  ? `${userInfo.university} · ${userInfo.major}`
                  : ''}
            </UserUniversity>
          </ProfileInfo>
        </ProfileSection>

        <Separator />

        <ListContainer>
          <FlatList
            data={listData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </ListContainer>
      </Content>
    </Container>
  );
};

export default MyPageScreen;

// 스타일 컴포넌트 정의
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  flex: 1;
`;

const ProfileSection = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 48px 24px 24px 24px;
`;

const ProfileInfo = styled.View`
  margin-left: 16px;
  flex: 1;
`;

const UserName = styled.Text`
  font-size: 18px;
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray900};
  margin-bottom: 4px;
`;

const UserUniversity = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
`;

const ListContainer = styled.View`
  flex: 1;
`;

const Separator = styled.View`
  height: 4px;
  background-color: ${theme.colors.gray200};
  width: 100%;
`;
