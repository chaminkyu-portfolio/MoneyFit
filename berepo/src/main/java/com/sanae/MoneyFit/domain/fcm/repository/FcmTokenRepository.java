package com.sanae.MoneyFit.domain.fcm.repository;

import com.sanae.MoneyFit.domain.fcm.entity.FcmToken;
import com.sanae.MoneyFit.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FcmTokenRepository extends JpaRepository<FcmToken, Long> {

    void deleteAllByUser(User user);


    Optional<FcmToken> findByUser(User user);
}