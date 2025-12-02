package com.sanae.MoneyFit.domain.user.repository;

import com.sanae.MoneyFit.domain.user.entity.UserSurveyFlags;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserSurveyFlagsRepository extends JpaRepository<UserSurveyFlags, Long> {


    Optional<UserSurveyFlags> findByUserId(String string);
}