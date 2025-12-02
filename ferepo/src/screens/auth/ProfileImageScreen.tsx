import React, { useState } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import CustomButton from '../../components/common/CustomButton';
import { useAuthStore } from '../../store';
import { uploadImage } from '../../utils/s3';

const ProfileImageScreen = ({ navigation, route }: any) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Zustand 스토어에서 프로필 이미지 설정 함수와 회원가입 데이터 가져오기
  const { setSignupProfileImage } = useAuthStore();
  const { nickname, email: userEmail, provider, providerId, age } = route.params || {};

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleNext = async () => {
    if (!imageUri) {
      // 이미지가 없으면 바로 다음으로
      setSignupProfileImage(null);
      // 약관 동의 화면으로 이동
      const { email: routeEmail, password, nickname, age } = route.params || {};
      navigation.navigate('TermsAgreeMent', {
        email: routeEmail,
        password,
        nickname,
        provider,
        providerId,
        age,
      });
      return;
    }

    setIsUploading(true);
    try {
      // S3에 이미지 업로드
      const fileName = `profile_${Date.now()}.jpg`;
      console.log('업로드 시작:', { email: userEmail || '', fileName });

      const imageUrl = await uploadImage(
        userEmail || '',
        imageUri,
        fileName,
        'image/jpeg',
      );
      console.log('업로드 성공! 이미지 URL:', imageUrl);

      // Zustand 스토어에 업로드된 이미지 URL 저장
      setSignupProfileImage(imageUrl);

      // 약관 동의 화면으로 이동
      const { email: routeEmail, password, nickname, age } = route.params || {};
      navigation.navigate('TermsAgreeMent', {
        email: routeEmail,
        password,
        nickname,
        provider,
        providerId,
        age,
        profileImage: imageUrl,
      });
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Container>
      <Header
        onBackPress={() => navigation.goBack()}
        rightComponent={<ProgressText>6/7</ProgressText>}
      />

      <Content>
        <Title>
          <HighlightText>{nickname}</HighlightText> 님의 프로필 이미지를{'\n'}
          등록해주세요.
        </Title>
        <SubTitle>
          {imageUri
            ? '사람들에게 나를 보여줄 수 있어요.'
            : '단체 구성원들에게 알려줄 수도 있어요!'}
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
        <CustomButton
          text={isUploading ? '업로드 중...' : imageUri ? '다음' : '건너뛰기'}
          onPress={handleNext}
          backgroundColor={theme.colors.primary}
          textColor={theme.colors.white}
          disabled={isUploading}
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
  font-family: ${theme.fonts.SemiBold};
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
