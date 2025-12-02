package com.sanae.MoneyFit.domain.analysis.dto.response;

import com.sanae.MoneyFit.domain.routine.enums.DayType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Map;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class WeeklySummaryDto {
    private String routineTitle;
    private Map<DayType, Boolean> dailyStatus;


}