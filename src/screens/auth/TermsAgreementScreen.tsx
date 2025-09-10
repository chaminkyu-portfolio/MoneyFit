import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { theme } from '../../styles/theme';
import AuthButton from '../../components/domain/auth/AuthButton';
import TermItem from '../../components/domain/auth/TermItem';

const TermsAgreementScreen = ({ navigation, route }: any) => {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  // '완료' 버튼 활성화 조건 (필수 약관 모두 동의)
  const isButtonEnabled = agreeTerms && agreePrivacy;

  const agreeAll = agreeTerms && agreePrivacy && agreeMarketing;

  const handleNext = () => {
    navigation.navigate('Welcome', { ...route.params });
  };

  const handleAgreeAll = () => {
    const nextState = !agreeAll;
    setAgreeTerms(nextState);
    setAgreePrivacy(nextState);
    setAgreeMarketing(nextState);
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackButtonText>&lt;</BackButtonText>
        </BackButton>
        <ProgressText>5/5</ProgressText>
      </Header>

      <Content>
        <TopWrapper>
          <Title>
            <HighlightText>머니핏</HighlightText> 서비스 이용 약관에{'\n'}
            동의해주세요
          </Title>
          <SubTitle>
            사용자의 개인정보 및 서비스 이용 권리{'\n'}잘 지켜드릴게요
          </SubTitle>
        </TopWrapper>

        <BottomWrapper>
          <TermsContainer>
            <TermItem
              isChecked={agreeTerms}
              onPress={() => setAgreeTerms(!agreeTerms)}
              text="서비스 이용약관 동의"
            />
            <TermItem
              isChecked={agreePrivacy}
              onPress={() => setAgreePrivacy(!agreePrivacy)}
              text="개인정보 처리방침 동의"
            />
            <TermItem
              isChecked={agreeMarketing}
              onPress={() => setAgreeMarketing(!agreeMarketing)}
              isOptional={true}
              text="마케팅 수신동의"
            />
          </TermsContainer>

          <Divider />

          <AllTermsRow onPress={handleAgreeAll}>
            <CheckButton>
              <MaterialIcons
                name="check-circle"
                size={24}
                color={agreeAll ? theme.colors.primary : theme.colors.gray300}
              />
            </CheckButton>
            <AllTermTextContainer>
              <AllTermTitle>전체 약관동의</AllTermTitle>
              <AllTermSubText>
                서비스 이용을 위해 약관들을 모두 동의합니다.
              </AllTermSubText>
            </AllTermTextContainer>
          </AllTermsRow>
        </BottomWrapper>
      </Content>

      <ButtonWrapper>
        <AuthButton
          text="완료"
          onPress={handleNext}
          disabled={!isButtonEnabled}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default TermsAgreementScreen;

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

const TopWrapper = styled.View``;

const BottomWrapper = styled.View`
  margin-top: auto;
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
  line-height: 24px;
  margin-top: 8px;
  margin-bottom: 48px;
`;

const TermsContainer = styled.View``;

const Divider = styled.View`
  height: 1px;
  background-color: ${theme.colors.gray100};
  margin: 16px 0;
`;

const AllTermsRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const CheckButton = styled.View`
  margin-right: 12px;
`;

const AllTermTextContainer = styled.View``;

const AllTermTitle = styled.Text`
  font-size: ${theme.fonts.body}px;
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray900};
`;

const AllTermSubText = styled.Text`
  font-size: ${theme.fonts.caption}px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  margin-top: 4px;
`;

const ButtonWrapper = styled.View`
  padding: 24px;
  margin-top: auto;
`;
