package com.sanae.MoneyFit.domain.routine.entity;

import com.sanae.MoneyFit.domain.user.entity.User;
import com.sanae.MoneyFit.global.common.util.BaseTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Guestbook extends BaseTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "guestbook_id", updatable = false, unique = true, nullable = false)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_routine_list_id", nullable = false)
    private GroupRoutineList groupRoutineList;

    @Column(name = "content", nullable = false, length = 255)
    private String content;
}
