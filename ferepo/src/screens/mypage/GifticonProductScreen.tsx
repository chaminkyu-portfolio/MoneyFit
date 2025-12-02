import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';

import Header from '../../components/common/Header';
import CustomButton from '../../components/common/CustomButton';
import BottomSheetDialog from '../../components/common/BottomSheetDialog';
import { theme } from '../../styles/theme';
import { useBuyProduct, useProductDetail } from '../../hooks/shop/useShop';
import { useQueryClient } from '@tanstack/react-query';

interface IGifticonProductScreenProps {
  navigation: any;
  route: any;
}

const GifticonProductScreen = ({
  navigation,
  route,
}: IGifticonProductScreenProps) => {
  const { product, productId: paramProductId, userPoints } = route.params || {};
  // Legacy: 라우트 파라미터에서 모든 정보를 직접 받던 방식
  // const brand = product?.brand ?? '브랜드';
  // const title = product?.title ?? '상품명';
  // const price = product?.price ?? 0;
  // const remain = product?.remain ?? 20;
  // const imageSource = product?.image ?? null; // require(...) 또는 { uri }

  // 선택된 상품의 id를 확보하여 상세 API 호출
  const productId = String(product?.id ?? paramProductId ?? '');
  const { data: detailResp } = useProductDetail(productId);

  const brand = detailResp?.result?.brand ?? product?.brand ?? '브랜드';
  const title = detailResp?.result?.productName ?? product?.title ?? '상품명';
  const price = detailResp?.result?.price ?? product?.price ?? 0;
  const remain = detailResp?.result?.stock ?? product?.remain ?? 0;
  const imageSource = detailResp?.result?.imageUrl
    ? { uri: detailResp.result.imageUrl }
    : (product?.image ?? null); // require(...) 또는 { uri }

  const myPoints: number = typeof userPoints === 'number' ? userPoints : 0;
  const hasEnoughPoints = myPoints >= price;

  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [isDoneOpen, setIsDoneOpen] = React.useState(false);
  const [showBarcode, setShowBarcode] = React.useState(false);

  const queryClient = useQueryClient();

  // 구매 API 훅 (성공 시 포인트/목록 캐시 무효화)
  const { mutateAsync: buyProductMutate, isPending: isBuying } =
    useBuyProduct();

  const handlePurchase = () => {
    if (!hasEnoughPoints) return;
    setIsConfirmOpen(true);
  };

  // Legacy: 구매 확인 시 로컬 타이머로 완료 모달만 띄우던 방식
  // const handleConfirmPurchase = () => {
  //   setIsConfirmOpen(false);
  //   setTimeout(() => setIsDoneOpen(true), 150);
  // };

  const handleConfirmPurchase = async () => {
    try {
      setIsConfirmOpen(false);
      // 실제 구매 요청 (성공 시 포인트/리스트 캐시 무효화됨)
      await buyProductMutate(String(productId));
      setIsDoneOpen(true);
      setShowBarcode(false);
    } catch (e) {
      // 구매 실패 시 확인 모달만 닫고 그대로 유지
      setIsConfirmOpen(false);
    }
  };

  const handleCloseDone = () => {
    setIsDoneOpen(false);
    setShowBarcode(false);
  };

  const handleShowBarcode = () => {
    setShowBarcode(true);
  };

  // Legacy: 완료 모달에서 바코드 토글/닫기만 처리
  // const handleDoneConfirm = () => {
  //   setIsDoneOpen(false);
  //   setShowBarcode(false);
  // };

  const handleDoneConfirm = () => {
    setIsDoneOpen(false);
    // 구매 완료 후 포인트 상점으로 복귀 (캐시 강제 갱신)
    queryClient.invalidateQueries({ queryKey: ['shopList'] });
    queryClient.invalidateQueries({ queryKey: ['shopCategoryList'] });
    queryClient.invalidateQueries({ queryKey: ['myPoint'] });
    navigation.navigate('PointGifticon');
  };

  return (
    <Container edges={['top', 'left', 'right']}>
      <Header
        title={product?.title ?? '상품 상세'}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollContent>
        <ImageBox>
          {imageSource ? (
            <ProductImage resizeMode="contain" source={imageSource} />
          ) : (
            <PlaceholderText>이미지</PlaceholderText>
          )}
        </ImageBox>

        <InfoTable>
          <Row>
            <Label>브랜드</Label>
            <Value>{brand}</Value>
          </Row>
          <Divider />
          <Row>
            <Label>상품명</Label>
            <Value>{title}</Value>
          </Row>
          <Divider />
          <Row>
            <Label>포인트</Label>
            <Value>{price.toLocaleString()}P</Value>
          </Row>
          <Divider />
          <Row>
            <Label>남은수량</Label>
            <Value>{remain}개</Value>
          </Row>
        </InfoTable>
      </ScrollContent>

      <ButtonWrapper>
        <CustomButton
          text={
            hasEnoughPoints
              ? isBuying
                ? '구매 중...'
                : '구매하기'
              : '잔액이 부족합니다'
          }
          onPress={handlePurchase}
          disabled={!hasEnoughPoints || isBuying}
          backgroundColor={
            hasEnoughPoints && !isBuying
              ? theme.colors.primary
              : theme.colors.gray200
          }
          textColor={
            hasEnoughPoints && !isBuying
              ? theme.colors.white
              : theme.colors.gray500
          }
        />
      </ButtonWrapper>

      <BottomSheetDialog
        visible={isConfirmOpen}
        onRequestClose={() => setIsConfirmOpen(false)}
      >
        <ModalTitle>구매 확인</ModalTitle>
        <ModalMessage>정말로 구매하시겠습니까?</ModalMessage>
        <ModalButtonsContainer>
          <ModalButton onPress={() => setIsConfirmOpen(false)}>
            <ModalButtonText>취소</ModalButtonText>
          </ModalButton>
          <ModalButton onPress={handleConfirmPurchase} variant="primary">
            <ModalButtonText variant="primary">확인</ModalButtonText>
          </ModalButton>
        </ModalButtonsContainer>
      </BottomSheetDialog>

      <BottomSheetDialog visible={isDoneOpen} onRequestClose={handleCloseDone}>
        <ModalTitle>구매 완료</ModalTitle>
        {!showBarcode && (
          <>
            <ModalMessage>구매가 완료되었습니다.</ModalMessage>
            <ModalButtonsContainer>
              <ModalButton onPress={handleShowBarcode}>
                <ModalButtonText>QR코드 보기</ModalButtonText>
              </ModalButton>
              <ModalButton onPress={handleDoneConfirm} variant="primary">
                <ModalButtonText variant="primary">확인</ModalButtonText>
              </ModalButton>
            </ModalButtonsContainer>
          </>
        )}
        {showBarcode && (
          <>
            <BarcodeBox>
              <BarcodeImage
                source={require('../../assets/images/QR.png')}
                resizeMode="contain"
              />
              <BarcodeHint>매장 직원에게 QR코드를 제시하세요.</BarcodeHint>
            </BarcodeBox>
            <ModalButtonsContainer>
              <ModalButton onPress={handleDoneConfirm} variant="primary">
                <ModalButtonText variant="primary">확인</ModalButtonText>
              </ModalButton>
            </ModalButtonsContainer>
          </>
        )}
      </BottomSheetDialog>
    </Container>
  );
};

export default GifticonProductScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const ScrollContent = styled.ScrollView`
  flex: 1;
  padding: 0 24px;
  padding-bottom: 80px;
`;

const ImageBox = styled.View`
  margin-top: 16px;
  margin-bottom: 24px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${theme.colors.gray200};
  border-radius: 12px;
  overflow: hidden;
  align-self: center;
  width: 200px;
  height: 200px;
  background-color: ${theme.colors.white};
`;

const ProductImage = styled(Image)`
  width: 80%;
  height: 80%;
`;

const PlaceholderText = styled.Text`
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray500};
`;

const InfoTable = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  overflow: hidden;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 4px;
  min-height: 48px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${theme.colors.gray200};
`;

const Label = styled.Text`
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray600};
`;

const Value = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray900};
  max-width: 70%;
  flex-shrink: 1;
`;

const ButtonWrapper = styled.View`
  padding: 24px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${theme.colors.white};
`;

const BarcodeBox = styled.View`
  margin-top: 8px;
  width: 100%;
  align-items: center;
`;

const BarcodeImage = styled(Image)`
  width: 80%;
  height: 140px;
`;

const BarcodeHint = styled.Text`
  margin-top: 8px;
  margin-bottom: 8px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
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
