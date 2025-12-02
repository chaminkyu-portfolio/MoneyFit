import React, { useState } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FlatList,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';

import Header from '../../components/common/Header';
import BottomSheetDialog from '../../components/common/BottomSheetDialog';
import { theme } from '../../styles/theme';
import { useUserStore } from '../../store';
import { shopCategoryList, shopList, myPoint } from '../../api/shop/shop';
// Legacy: 전체를 카테고리 경로로 호출하던 방식
// import { shopCategoryList } from '../../api/shop/shop';

interface IPointGifticonScreenProps {
  navigation: any;
}

type CategoryKey =
  | 'all'
  | 'cafe'
  | 'convenience'
  | 'fastfood'
  | 'dining'
  | 'bakery';

type CategoryMeta = {
  key: CategoryKey;
  label: string;
  icon: ImageSourcePropType;
};

// ===== Legacy: 로컬 목(Mock) 데이터 (API 연동 전 사용) =====
// const MOCK_PRODUCTS = [
//   {
//     id: '1',
//     title: '아이스 카페 아메리카노 Tall',
//     brand: '스타벅스',
//     price: 6100,
//     category: 'cafe' as CategoryKey,
//   },
//   {
//     id: '2',
//     title: '아이스 카페 라떼 Tall',
//     brand: '스타벅스',
//     price: 6600,
//     category: 'cafe' as CategoryKey,
//   },
//   {
//     id: '3',
//     title: '불고기버거 세트',
//     brand: '맥도날드',
//     price: 7900,
//     category: 'fastfood' as CategoryKey,
//   },
//   {
//     id: '4',
//     title: '교촌콤보',
//     brand: '교촌치킨',
//     price: 19000,
//     category: 'dining' as CategoryKey,
//   },
//   {
//     id: '5',
//     title: '소금빵',
//     brand: '파리바게뜨',
//     price: 3500,
//     category: 'bakery' as CategoryKey,
//   },
//   {
//     id: '6',
//     title: '삼각김밥',
//     brand: 'GS25',
//     price: 1200,
//     category: 'convenience' as CategoryKey,
//   },
// ];

// API 카테고리 맵핑
const CATEGORY_MAP: Record<
  Exclude<CategoryKey, 'all'>,
  '카페' | '편의점' | '패스트푸드' | '외식' | '베이커리'
> = {
  cafe: '카페',
  convenience: '편의점',
  fastfood: '패스트푸드',
  dining: '외식',
  bakery: '베이커리',
};

// 현재는 예시 이미지로 party_popper.png를 넣어두었습니다. 실제 아이콘 이미지를 교체하여 사용하세요.
const iconAll = require('../../assets/images/gifticon/total_food.png');
const iconCafe = require('../../assets/images/gifticon/cafe.png');
const iconConvenience = require('../../assets/images/gifticon/convenience_store.png');
const iconFastfood = require('../../assets/images/gifticon/fast_food.png');
const iconDining = require('../../assets/images/gifticon/restaurant.png');
const iconBakery = require('../../assets/images/gifticon/bakery.png');

const CATEGORIES: CategoryMeta[] = [
  { key: 'all', label: '전체', icon: iconAll },
  { key: 'cafe', label: '카페', icon: iconCafe },
  { key: 'convenience', label: '편의점', icon: iconConvenience },
  { key: 'fastfood', label: '패스트푸드', icon: iconFastfood },
  { key: 'dining', label: '외식', icon: iconDining },
  { key: 'bakery', label: '베이커리', icon: iconBakery },
];

const PointGifticonScreen = ({ navigation }: IPointGifticonScreenProps) => {
  const [selectedCategory, setSelectedCategory] =
    React.useState<CategoryKey>('all');
  const [page] = React.useState<number>(0);
  const [showAccountRequiredModal, setShowAccountRequiredModal] =
    useState(false);
  const pageSize = 10;

  // Legacy: 로컬 스토어에서 포인트 조회
  // const points = useUserStore((s) => s.userInfo?.points ?? 0);

  // 서버에서 포인트 조회 (/api/v1/shop/my-point), result가 문자열("10000") 형태
  const { userInfo } = useUserStore();
  const storePoints = useUserStore((s) => s.userInfo?.points ?? 0);
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
  const points = React.useMemo(() => {
    if (!myPointData || isMyPointError) return storePoints;
    const r: any = myPointData.result;
    if (typeof r === 'string' || typeof r === 'number') {
      const n = Number(r);
      return Number.isFinite(n) ? n : storePoints;
    }
    return storePoints;
  }, [myPointData, isMyPointError, storePoints]);

  // ===== Legacy: 로컬 필터링 (API 연동 전) =====
  // const filteredProducts = React.useMemo(() => {
  //   if (selectedCategory === 'all') return MOCK_PRODUCTS;
  //   return MOCK_PRODUCTS.filter((p) => p.category === selectedCategory);
  // }, [selectedCategory]);

  // ===== API 연동: 전체 리스트 (경로: /api/v1/shop/list) =====
  const {
    data: allData,
    isLoading: isAllLoading,
    isFetching: isAllFetching,
    refetch: refetchAll,
  } = useQuery({
    queryKey: ['shopList', { page, size: pageSize }],
    queryFn: () => shopList({ page, size: pageSize }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: selectedCategory === 'all',
  });

  // ===== Legacy: 전체 리스트를 카테고리 경로로 호출하던 방식 =====
  // const {
  //   data: allData,
  //   isLoading: isAllLoading,
  //   isFetching: isAllFetching,
  //   refetch: refetchAll,
  // } = useQuery({
  //   queryKey: ['shopCategoryList', { category: '전체', page, size: pageSize }],
  //   queryFn: () =>
  //     shopCategoryList({
  //       category: '전체' as any,
  //       page,
  //       size: pageSize,
  //     }),
  //   staleTime: 5 * 60 * 1000,
  //   gcTime: 10 * 60 * 1000,
  //   enabled: selectedCategory === 'all',
  // });

  // 카테고리 리스트
  const apiCategory =
    selectedCategory !== 'all' ? CATEGORY_MAP[selectedCategory] : undefined;
  const {
    data: catData,
    isLoading: isCatLoading,
    isFetching: isCatFetching,
    refetch: refetchCat,
  } = useQuery({
    queryKey: [
      'shopCategoryList',
      { category: apiCategory, page, size: pageSize },
    ],
    queryFn: () =>
      shopCategoryList({
        category: apiCategory as any,
        page,
        size: pageSize,
      }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: selectedCategory !== 'all' && !!apiCategory,
  });

  const products = React.useMemo(() => {
    const items =
      selectedCategory === 'all'
        ? allData?.result?.items
        : catData?.result?.items;
    return items ?? [];
  }, [selectedCategory, allData, catData]);

  const isLoading =
    selectedCategory === 'all'
      ? isAllLoading || isAllFetching
      : isCatLoading || isCatFetching;

  // Legacy: 화면 이동 시 기존에는 원본 아이템을 그대로 전달했습니다.
  // navigation.navigate('GifticonProduct', { product, userPoints: points });
  const handlePressProduct = (product: any) => {
    navigation.navigate('GifticonProduct', {
      product: {
        id: product.id,
        title: product.productName,
        brand: product.brand,
        price: product.price,
        remain: product.stock,
        image: product.imageUrl ? { uri: product.imageUrl } : null,
      },
      userPoints: points,
    });
  };

  const handleGoCashout = () => {
    // 계좌 인증이 완료되지 않은 경우 계좌 등록 필요 모달 표시
    if (!userInfo?.accountCertificationStatus) {
      setShowAccountRequiredModal(true);
    } else {
      navigation.navigate('PointCashout');
    }
  };

  const renderProduct = ({ item }: { item: any }) => (
    <ProductItem onPress={() => handlePressProduct(item)}>
      {item.imageUrl ? (
        <ProductImage source={{ uri: item.imageUrl }} resizeMode="contain" />
      ) : (
        <Thumb />
      )}
      <ProductInfo>
        {/* Legacy: {item.title} */}
        <ProductTitle numberOfLines={1}>{item.productName}</ProductTitle>
        <BrandText>{item.brand}</BrandText>
      </ProductInfo>
      {/* Legacy: {item.price.toLocaleString()}P */}
      <PriceText>{item.price?.toLocaleString()}P</PriceText>
    </ProductItem>
  );

  return (
    <Container edges={['top', 'left', 'right']}>
      <Header title="포인트 상점" onBackPress={() => navigation.goBack()} />

      <Content>
        <PointCard>
          <PointHeaderRow>
            <PointHeaderText>포인트</PointHeaderText>
            <PointValue>{points.toLocaleString()}P</PointValue>
          </PointHeaderRow>
          <CashoutTouchable onPress={handleGoCashout}>
            <CashoutText>현금으로 전환하기</CashoutText>
          </CashoutTouchable>
        </PointCard>

        <CategoryScroll
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 12 }}
        >
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.key}
              active={selectedCategory === cat.key}
              onPress={() => setSelectedCategory(cat.key)}
            >
              <CategoryImg source={cat.icon} />
              <CategoryLabel active={selectedCategory === cat.key}>
                {cat.label}
              </CategoryLabel>
            </CategoryChip>
          ))}
        </CategoryScroll>

        <Divider />
      </Content>
      {/* 리스트 스크롤 하면서 탭 세로길이는 동일하게 유지하기 위해 ListContainer 따로 생성 */}
      <ListContainer>
        {/* Legacy:
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        />
        */}
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderProduct}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={() => {
            if (selectedCategory === 'all') refetchAll();
            else refetchCat();
          }}
        />
      </ListContainer>

      {/* 계좌 등록 필요 모달 */}
      <BottomSheetDialog
        visible={showAccountRequiredModal}
        onRequestClose={() => setShowAccountRequiredModal(false)}
      >
        <ModalTitle>계좌 등록 필요</ModalTitle>
        <ModalSubtitle>
          포인트를 현금으로 전환하려면{'\n'}계좌 등록이 필요합니다.
        </ModalSubtitle>
        <ModalButtonsContainer>
          <ModalButton onPress={() => setShowAccountRequiredModal(false)}>
            <ModalButtonText>확인</ModalButtonText>
          </ModalButton>
        </ModalButtonsContainer>
      </BottomSheetDialog>
    </Container>
  );
};

export default PointGifticonScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  padding: 0 16px 8px 16px;
`;

const PointCard = styled.View`
  background-color: ${theme.colors.gray50};
  border-radius: 16px;
  padding: 16px;
  margin: 8px 0 12px 0;
`;

const PointHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const PointHeaderText = styled.Text`
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray700};
  font-size: ${theme.fonts.subtitle}px;
`;

const PointValue = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: ${theme.fonts.subtitle}px;
  color: ${theme.colors.primary};
`;

const CashoutTouchable = styled(TouchableOpacity)`
  margin-top: 8px;
  align-self: flex-start;
`;

const CashoutText = styled.Text`
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.primary};
`;

const CategoryScroll = styled.ScrollView`
  padding: 8px 0;
`;

const CategoryChip = styled.TouchableOpacity<{ active: boolean }>`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 12px;
  border-radius: 18px;
  margin-right: 12px;
  background-color: transparent;
`;

const CategoryImg = styled(Image)`
  width: 44px;
  height: 44px;
  margin-bottom: 8px;
  border-radius: 8px;
`;

const CategoryLabel = styled.Text<{ active: boolean }>`
  font-family: ${theme.fonts.Medium};
  font-size: ${theme.fonts.caption}px;
  color: ${(p) => (p.active ? theme.colors.primary : theme.colors.gray700)};
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${theme.colors.gray200};
  margin: 8px 0 4px 0;
`;

const ProductItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.gray200};
`;

const Thumb = styled.View`
  width: 48px;
  height: 48px;
  background-color: ${theme.colors.gray100};
  border-radius: 8px;
  margin-right: 12px;
`;

const ProductImage = styled(Image)`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  margin-right: 12px;
`;

const ProductInfo = styled.View`
  flex: 1;
`;

const ProductTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray900};
  margin-bottom: 4px;
`;

const BrandText = styled.Text`
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray500};
`;

const PriceText = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray900};
`;

const ListContainer = styled.View`
  flex: 1;
  padding: 0 16px 16px 16px;
`;

// 모달 관련 스타일
const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${theme.colors.gray800};
  text-align: center;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const ModalSubtitle = styled.Text`
  color: #6f7075;
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  margin-bottom: 36px;
`;

const ModalButtonsContainer = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const ModalButton = styled.TouchableOpacity`
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.primary};
`;

const ModalButtonText = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 16px;
  color: ${theme.colors.white};
`;
