package com.sanae.MoneyFit.domain.routine.dto.response;

import com.sanae.MoneyFit.domain.routine.entity.MyRoutineList;
import com.sanae.MoneyFit.domain.routine.enums.DayType;
import com.sanae.MoneyFit.domain.routine.enums.RoutineType;
import lombok.*;

import java.time.LocalTime;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 개인 루틴 목록보기 Response
 */
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
public class MyRoutineListResponseDto {
    private Long id;
    private String title;
    private LocalTime startTime;
    private LocalTime endTime;
    private RoutineType routineType;
    private Set<DayType> dayTypes;

    /**
     * 현재 루틴 진행률(%)
     */
    private double percent;

    public static MyRoutineListResponseDto toDto(MyRoutineList myRoutineList){
        Set<DayType> days = myRoutineList.getRoutineDays().stream()
                .map(routineDay -> routineDay.getDayType())
                .collect(Collectors.toSet()); // toList() -> toSet()으로 변경
        return MyRoutineListResponseDto.builder()
                .id(myRoutineList.getId())
                .title(myRoutineList.getTitle())
                .startTime(myRoutineList.getStartTime())
                .endTime(myRoutineList.getEndTime())
                .routineType(myRoutineList.getRoutineType())
                .dayTypes(days)
                .percent(0)
                .build();
    }
}
