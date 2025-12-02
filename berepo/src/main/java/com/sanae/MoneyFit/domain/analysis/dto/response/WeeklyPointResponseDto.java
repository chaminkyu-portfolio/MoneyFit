package com.sanae.MoneyFit.domain.analysis.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class WeeklyPointResponseDto {
	private long awardedPoint;
	private long totalPoint;
}