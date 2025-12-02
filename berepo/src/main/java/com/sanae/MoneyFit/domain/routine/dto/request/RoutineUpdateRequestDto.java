package com.sanae.MoneyFit.domain.routine.dto.request;

import lombok.*;


/**
 * 루틴 업데이트 Request
 */
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor

public class RoutineUpdateRequestDto extends RoutineRequestDto {
    private Long id;

}
