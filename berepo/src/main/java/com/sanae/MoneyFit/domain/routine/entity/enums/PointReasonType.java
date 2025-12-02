package com.sanae.MoneyFit.domain.routine.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 포인트 지급 사유를 정의하는 Enum
 */
@Getter
@RequiredArgsConstructor
public enum PointReasonType {
    GROUP_ROUTINE_COMPLETION("단체 루틴 완료"),
    PERSONAL_ROUTINE_COMPLETION("개인 루틴 완료");

    private final String description;
}
