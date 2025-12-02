import React, { useState } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';

import Header from '../../components/common/Header';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import PointButton from '../../components/domain/mypage/PointButton';
import MyPageListItem from '../../components/domain/mypage/MyPageListItem';
import BottomSheetDialog from '../../components/common/BottomSheetDialog';
import { theme } from '../../styles/theme';
import { useUserStore, useFinanceStore } from '../../store';
import { myPoint } from '../../api/shop/shop';
import { useAccountTransfer } from '../../hooks/shop';

interface IPointCashoutScreenProps {
  navigation: any;
}

const PointCashoutScreen = ({ navigation }: IPointCashoutScreenProps) => {
  const [pointAmount, setPointAmount] = useState('0');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Zustand 스토어에서 상태 가져오기
  const { userInfo, deductPoints } = useUserStore();
  const { currentBalance, setCurrentBalance } = useFinanceStore();

  // 포인트 전환 API 훅
  const { mutate: transferPoints, isPending: isTransferLoading } =
    useAccountTransfer();

  // Legacy: 스토어에서 보유 포인트 사용
  // const maxPoints = userInfo?.points ?? 0;
  // 입금된 현금, 계좌 잔액 조회
  // 서버에서 보유 포인트 조회 (/api/v1/shop/my-point), result가 문자열("10000") 형태
  const {
    data: myPointData,
    isError: isMyPointError,
    refetch: refetchMyPoint,
  } = useQuery({
    queryKey: ['myPoint'],
    queryFn: () => myPoint(),
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 0,
  });

  // 화면에 포커스될 때마다 최신 포인트 조회
  useFocusEffect(
    React.useCallback(() => {
      refetchMyPoint();
    }, [refetchMyPoint]),
  );

  const maxPoints = React.useMemo(() => {
    if (!myPointData || isMyPointError) return userInfo?.points ?? 0;
    const r: any = myPointData.result;
    if (typeof r === 'string' || typeof r === 'number') {
      const n = Number(r);
      return Number.isFinite(n) ? n : (userInfo?.points ?? 0);
    }
    return userInfo?.points ?? 0;
  }, [myPointData, isMyPointError, userInfo?.points]);

  const handleInputChange = (text: string) => {
    // 숫자만 입력 가능
    const numericValue = text.replace(/[^0-9]/g, '');

    // 최대 포인트를 넘으면 강제로 최대값으로 설정
    const pointValue = parseInt(numericValue) || 0;
    const finalValue =
      pointValue > maxPoints ? maxPoints.toString() : numericValue;

    setPointAmount(finalValue);
  };

  const handlePointChange = (points: number) => {
    // 최대 포인트를 넘으면 강제로 최대값으로 설정
    const finalValue = points > maxPoints ? maxPoints : points;
    setPointAmount(finalValue.toString());
  };

  const handleTransfer = () => {
    const amount = parseInt(pointAmount) || 0;
    if (amount > 0) {
      setIsTransferModalOpen(true);
    }
  };

  // Legacy: 스토어만 차감하고 화면 이동
  // const handleConfirmTransfer = () => {
  //   const amount = parseInt(pointAmount) || 0;
  //   deductPoints(amount);
  //   setCurrentBalance(currentBalance + amount);
  //   setIsTransferModalOpen(false);
  //   navigation.navigate('PointCashoutComplete', { transferredPoints: amount });
  // };

  const handleConfirmTransfer = () => {
    const amount = parseInt(pointAmount) || 0;
    const bankAccount = userInfo?.bankAccount!; // 계좌번호는 반드시 존재함

    // 포인트 전환 API 호출
    transferPoints(
      {
        account: bankAccount,
        price: amount.toString(), // 포인트를 문자열로 전달
      },
      {
        onSuccess: (data) => {
          console.log('🔍 포인트 전환 성공:', data);

          // Optimistic update: 전역 myPoint 캐시 값을 즉시 차감 반영
          const prev = queryClient.getQueryData<any>(['myPoint']);
          if (prev && typeof prev === 'object' && prev !== null) {
            const r: any = prev.result;
            const prevNum =
              typeof r === 'string' || typeof r === 'number'
                ? Number(r)
                : Number(userInfo?.points ?? 0);
            const nextNum = Math.max(0, prevNum - amount);
            queryClient.setQueryData(['myPoint'], {
              ...prev,
              result: String(nextNum),
            });
          } else {
            // 캐시가 없을 때도 최소한 화면상 일관성 유지
            const base = Number(userInfo?.points ?? 0);
            const nextNum = Math.max(0, base - amount);
            queryClient.setQueryData(['myPoint'], {
              isSuccess: true,
              code: 'COMMON200',
              message: '성공입니다.',
              result: String(nextNum),
            });
          }

          // 스토어 차감 및 잔액 증가
          deductPoints(amount);
          setCurrentBalance(currentBalance + amount);

          // 모달 닫기 및 완료 화면 이동 (계좌 잔액 포함)
          setIsTransferModalOpen(false);
          navigation.navigate('PointCashoutComplete', {
            transferredPoints: amount,
            accountBalance: data.result, // API 응답에서 받은 계좌 잔액
          });
        },
        onError: (error) => {
          console.error('🔍 포인트 전환 실패:', error);
          // 에러 처리 (필요시 모달 표시 등)
        },
      },
    );
  };

  return (
    <Container edges={['top', 'left', 'right']}>
      <Header title="포인트 전환하기" onBackPress={() => navigation.goBack()} />

      <Content>
        <TitleSection>
          <Title>얼마나 보낼까요?</Title>
          <SubTitle>1P씩 입력 가능해요</SubTitle>
        </TitleSection>

        <BalanceSection>
          <BalanceLabel>보유 포인트</BalanceLabel>
          <BalanceAmount>{maxPoints.toLocaleString()}P</BalanceAmount>
        </BalanceSection>

        <CustomInput
          value={pointAmount}
          onChangeText={handleInputChange}
          placeholder="포인트를 입력해주세요"
          maxLength={10}
          suffix="P"
          showCharCounter={false}
        />
        <ButtonRow>
          <PointButton
            text="+1백P"
            onPress={() =>
              handlePointChange((parseInt(pointAmount) || 0) + 100)
            }
          />
          <PointButton
            text="+1천P"
            onPress={() =>
              handlePointChange((parseInt(pointAmount) || 0) + 1000)
            }
          />
          <PointButton
            text="+1만P"
            onPress={() =>
              handlePointChange((parseInt(pointAmount) || 0) + 10000)
            }
          />
          <PointButton
            text="전체사용"
            onPress={() => handlePointChange(maxPoints)}
            flex={1.5}
          />
        </ButtonRow>
      </Content>

      <Divider />

      <InfoSection>
        <MyPageListItem
          title="입금계좌"
          rightText={userInfo?.bankAccount!}
          rightTextColor={theme.colors.gray900}
          showArrow={false}
          disabled={true}
        />
        <MyPageListItem
          title="전환비율"
          rightText="1P당 0.7원"
          rightTextColor={theme.colors.gray900}
          showArrow={false}
          disabled={true}
        />
        <MyPageListItem
          title="전환될 금액"
          rightText={`${Math.floor((parseInt(pointAmount) || 0) * 0.7).toLocaleString()}원`}
          rightTextColor={theme.colors.gray900}
          showArrow={false}
          disabled={true}
        />
      </InfoSection>

      <ButtonWrapper>
        <TransferButton onPress={handleTransfer} disabled={isTransferLoading}>
          <TransferButtonText>
            {isTransferLoading ? '전환 중...' : '전환하기'}
          </TransferButtonText>
        </TransferButton>
      </ButtonWrapper>

      <BottomSheetDialog
        visible={isTransferModalOpen}
        onRequestClose={() => setIsTransferModalOpen(false)}
      >
        <ModalTitle>포인트 전환</ModalTitle>
        <ModalMessage>{`${pointAmount}P를 현금으로 전환하시겠습니까?`}</ModalMessage>
        <ModalButtonsContainer>
          <ModalButton onPress={() => setIsTransferModalOpen(false)}>
            <ModalButtonText>취소</ModalButtonText>
          </ModalButton>
          <ModalButton onPress={handleConfirmTransfer} variant="primary">
            <ModalButtonText variant="primary">확인</ModalButtonText>
          </ModalButton>
        </ModalButtonsContainer>
      </BottomSheetDialog>
    </Container>
  );
};

export default PointCashoutScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  padding: 24px;
`;

const TitleSection = styled.View`
  margin-bottom: 32px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.gray900};
  line-height: 34px;
  margin-bottom: 8px;
`;

const SubTitle = styled.Text`
  font-size: 16px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  text-align: right;
`;

const BalanceSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: ${theme.colors.gray50};
  border-radius: 8px;
  margin-bottom: 24px;
`;

const BalanceLabel = styled.Text`
  font-size: 16px;
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray700};
`;

const BalanceAmount = styled.Text`
  font-size: 18px;
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.primary};
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 8px;
  margin-top: 16px;
`;

const Divider = styled.View`
  height: 8px;
  background-color: ${theme.colors.gray100};
  margin: 0;
`;

const InfoSection = styled.View`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const ButtonWrapper = styled.View`
  padding: 24px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${theme.colors.white};
`;

const TransferButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  padding: 16px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
`;

const TransferButtonText = styled.Text`
  font-size: 16px;
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.white};
`;

// 모달 관련 스타일
const ModalTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 24px;
  color: ${theme.colors.gray900};
  text-align: center;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const ModalMessage = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
  text-align: center;
  margin-bottom: 36px;
`;

const ModalButtonsContainer = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const ModalButton = styled.TouchableOpacity<{ variant?: 'primary' }>`
  flex: 1;
  padding: 16px 12px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  background-color: ${(p) =>
    p.variant === 'primary' ? theme.colors.primary : theme.colors.gray200};
`;

const ModalButtonText = styled.Text<{ variant?: 'primary' }>`
  font-family: ${theme.fonts.SemiBold};
  font-size: 16px;
  color: ${(p) =>
    p.variant === 'primary' ? theme.colors.white : theme.colors.gray600};
`;
