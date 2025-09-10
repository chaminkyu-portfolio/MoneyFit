import React, { useState } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { theme } from '../../styles/theme';
import AuthButton from '../../components/domain/auth/AuthButton';

const ProfileImageScreen = ({ navigation, route }: any) => {
  const { nickname } = route.params;
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('갤러리 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleNext = () => {
    navigation.navigate('TermsAgreeMent', { nickname, imageUri });
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackButtonText>&lt;</BackButtonText>
        </BackButton>
        <ProgressText>4/5</ProgressText>
      </Header>

      <Content>
        <Title>
          <HighlightText>{nickname}</HighlightText> 님의 프로필 이미지를{'\n'}
          등록해주세요.
        </Title>
        <SubTitle>
          {imageUri
            ? '사람들에게 나를 보여줄 수 있어요.'
            : '그 그룹 구성원들에게 알려줄 수도 있어요!'}
        </SubTitle>

        <ProfileImageContainer onPress={handlePickImage}>
          <ProfileImage
            source={
              imageUri
                ? { uri: imageUri }
                : require('../../assets/images/default_profile.png')
            }
          />
          <EditIconWrapper>
            <MaterialCommunityIcons
              name="pencil"
              size={18}
              color={theme.colors.white}
            />
          </EditIconWrapper>
        </ProfileImageContainer>
      </Content>

      <ButtonWrapper>
        <AuthButton
          text={imageUri ? '다음' : '건너뛰기'}
          onPress={handleNext}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default ProfileImageScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
`;

const BackButton = styled.TouchableOpacity``;

const BackButtonText = styled.Text`
  font-size: 24px;
`;

const ProgressText = styled.Text`
  font-size: ${theme.fonts.caption}px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
`;

const Content = styled.View`
  flex: 1;
  padding: 24px;
`;

const Title = styled.Text`
  font-size: ${theme.fonts.title}px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.gray900};
  line-height: 34px;
  margin-top: 16px;
`;

const HighlightText = styled.Text`
  color: ${theme.colors.primary};
`;

const SubTitle = styled.Text`
  font-size: ${theme.fonts.body}px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  margin-top: 8px;
  margin-bottom: 60px;
`;

const ProfileImageContainer = styled.TouchableOpacity`
  align-self: center;
  position: relative;
`;

const ProfileImage = styled.Image`
  width: 150px;
  height: 150px;
  border-radius: 75px;
  background-color: ${theme.colors.gray100};
`;

const EditIconWrapper = styled.View`
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: ${theme.colors.primary};
  width: 32px;
  height: 32px;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  border-width: 2px;
  border-color: ${theme.colors.white};
`;

const ButtonWrapper = styled.View`
  padding: 24px;
  margin-top: auto;
`;
