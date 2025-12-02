package com.sanae.MoneyFit.domain.shop.repository;

import com.sanae.MoneyFit.domain.shop.entity.PointShop;
import com.sanae.MoneyFit.domain.shop.enums.PointShopCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PointShopRepository extends JpaRepository<PointShop, Long> {

    Page<PointShop> findByCategory(PointShopCategory category, Pageable pageable);
}