package com.sanae.MoneyFit.domain.routine.repository;

import com.sanae.MoneyFit.domain.routine.entity.UserWeeklyPlanWithRoutine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserWeeklyPlanWithRoutineRepository extends JpaRepository<UserWeeklyPlanWithRoutine, Long> {
}