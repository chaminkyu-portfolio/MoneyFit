package com.sanae.MoneyFit.domain.routine.repository;


import com.sanae.MoneyFit.domain.routine.entity.PointHistory;
import com.sanae.MoneyFit.domain.routine.entity.enums.PointReasonType;
import com.sanae.MoneyFit.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;

public interface PointHistoryRepository extends JpaRepository<PointHistory, Long> {

    /**
     * 특정 사용자가 특정 사유로 특정 기간 내에 포인트를 지급받은 내역이 있는지 확인
     */
    boolean existsByUserAndReasonAndCreatedAtBetween(User user, PointReasonType reason, LocalDateTime start, LocalDateTime end);
}
