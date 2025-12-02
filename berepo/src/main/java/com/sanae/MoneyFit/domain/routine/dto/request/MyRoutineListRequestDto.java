package com.sanae.MoneyFit.domain.routine.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.sanae.MoneyFit.domain.routine.entity.MyRoutineList;
import com.sanae.MoneyFit.domain.routine.enums.DayType;
import com.sanae.MoneyFit.domain.routine.enums.RoutineType;
import com.sanae.MoneyFit.domain.user.entity.User;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;


/**
 * 개인 루틴리스트 만들기 Request
 */
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MyRoutineListRequestDto {
    private String title;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private RoutineType routineType;
    private List<DayType> dayTypes;

    public static MyRoutineList toEntity(MyRoutineListRequestDto myRoutineListRequestDto, User user){
        return MyRoutineList.builder()
                .title(myRoutineListRequestDto.getTitle())
                .startDate(myRoutineListRequestDto.getStartDate())
                .startTime(myRoutineListRequestDto.getStartTime())
                .endTime(myRoutineListRequestDto.getEndTime())
                .routineType(myRoutineListRequestDto.getRoutineType())
                .user(user)
                .build();
    }
}
