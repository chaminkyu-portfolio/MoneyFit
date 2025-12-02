package com.sanae.MoneyFit.domain.routine.entity;


import com.sanae.MoneyFit.domain.routine.entity.enums.PointReasonType;
import com.sanae.MoneyFit.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class PointHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private int point;

    // --- 수정된 부분 ---
    @Enumerated(EnumType.STRING) // DB에는 Enum의 이름(문자열)이 저장됩니다.
    @Column(nullable = false)
    private com.sanae.MoneyFit.domain.routine.entity.enums.PointReasonType reason; // 타입을 String에서 PointReasonType으로 변경

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public PointHistory(User user, int point, PointReasonType reason) { // 생성자 타입 변경
        this.user = user;
        this.point = point;
        this.reason = reason;
    }
}
