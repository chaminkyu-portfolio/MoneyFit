package com.sanae.MoneyFit.domain.shop.service;


import com.sanae.MoneyFit.domain.finance.dto.response.AccountBalanceResponseDto;
import com.sanae.MoneyFit.domain.shop.dto.request.PointShopPostRequestDto;
import com.sanae.MoneyFit.domain.shop.dto.request.ShopAccountTransferRequestDto;
import com.sanae.MoneyFit.domain.shop.dto.response.PointShopDetailResponseDto;
import com.sanae.MoneyFit.domain.shop.dto.response.PointShopListResponseDto;
import com.sanae.MoneyFit.domain.shop.entity.PointShop;
import com.sanae.MoneyFit.domain.shop.enums.PointShopCategory;
import com.sanae.MoneyFit.domain.shop.repository.PointShopRepository;
import com.sanae.MoneyFit.domain.user.entity.User;
import com.sanae.MoneyFit.domain.user.repository.UserRepository;
import com.sanae.MoneyFit.global.common.aop.DistributedLock;
import com.sanae.MoneyFit.global.error.handler.ShopHandler;
import com.sanae.MoneyFit.global.error.handler.UserHandler;
import com.sanae.MoneyFit.global.infra.http.bank.WebClientBankUtil;
import com.sanae.MoneyFit.global.web.response.PaginatedResponse;
import com.sanae.MoneyFit.global.web.response.code.status.ErrorStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PointShopService {

    private final PointShopRepository pointShopRepository;
    private final UserRepository userRepository;
    private final WebClientBankUtil webClientBankUtil;

    @Transactional
    public String postProduct(PointShopPostRequestDto pointShopPostRequestDto) {
        pointShopRepository.save(PointShopPostRequestDto.toEntity(pointShopPostRequestDto));
        return "상품이 등록되었습니다.";
    }

    @Transactional(readOnly = true)
    public String mypoint(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserHandler(ErrorStatus.USER_NOT_FOUND));
        return user.getPoint().toString();
    }

    @Transactional(readOnly = true)
    public PaginatedResponse<PointShopListResponseDto> shopList(Pageable pageable) {
        Page<PointShop> productList = pointShopRepository.findAll(pageable);
        return PaginatedResponse.of(productList,PointShopListResponseDto::toDto);
    }

    @Transactional(readOnly = true)
    public PaginatedResponse<PointShopListResponseDto>  shopCategoryList(Pageable pageable, PointShopCategory category) {
        Page<PointShop> product = pointShopRepository.findByCategory(category,pageable);
        return PaginatedResponse.of(product,PointShopListResponseDto::toDto);

    }
    @Transactional(readOnly = true)
    public PointShopDetailResponseDto getProductDetail(Long productId) {
        PointShop product = pointShopRepository.findById(productId)
                .orElseThrow(() -> new ShopHandler(ErrorStatus.PRODUCT_NOT_FOUND));

        return PointShopDetailResponseDto.toDto(product);
    }


    @DistributedLock(key = "#lockName")
    public String buyProduct(String lockName,UUID userId, Long productId) {
        // 1. 사용자 정보 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserHandler(ErrorStatus.USER_NOT_FOUND));

        // 2. 상품 정보 조회
        PointShop product = pointShopRepository.findById(productId)
                .orElseThrow(() -> new ShopHandler(ErrorStatus.PRODUCT_NOT_FOUND));

        if (product.getStock() <= 0) {
            throw new ShopHandler(ErrorStatus.STOCK_IS_NULL);
        }
        if(user.getPoint()<product.getPrice()){
            throw new ShopHandler(ErrorStatus.USER_POINT_LACK);
        }
        product.minusStock();
        user.usePoints(product.getPrice());
        userRepository.save(user);
        pointShopRepository.save(product);
        // 기프티콘을 보내줘야할 듯 ?

        return "상품 구매가 완료되었습니다.";
    }


    @Transactional
    public Long accountTransfer(UUID userId, ShopAccountTransferRequestDto shopAccountTransferRequestDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserHandler(ErrorStatus.USER_NOT_FOUND));
        if (!user.getBankAccount().equals(shopAccountTransferRequestDto.getAccount())){
            throw new UserHandler(ErrorStatus.USER_NOT_BANK_ACCOUNT);
        }
        if(user.getPoint()<shopAccountTransferRequestDto.getPrice()){
            throw new ShopHandler(ErrorStatus.USER_POINT_LACK);
        }
        user.usePoints(shopAccountTransferRequestDto.getPrice());
        double amount = shopAccountTransferRequestDto.getPrice() * 0.7;
        long roundedAmount = (long) Math.ceil(amount);

        webClientBankUtil.deposit(
                user.getUserKey(),
                user.getBankAccount(),
                roundedAmount,
                "헤이루틴 포인트적립"
        ).block();
        AccountBalanceResponseDto balanceResponse = webClientBankUtil
            .inquireAccountBalance(user.getUserKey(), user.getBankAccount())
            .block();

        return Long.parseLong(balanceResponse.getRec().getAccountBalance());
    }
}
