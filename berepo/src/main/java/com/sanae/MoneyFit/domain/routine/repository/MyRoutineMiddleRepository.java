package com.sanae.MoneyFit.domain.routine.repository;

import com.sanae.MoneyFit.domain.routine.entity.MyRoutineList;
import com.sanae.MoneyFit.domain.routine.entity.MyRoutineMiddle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MyRoutineMiddleRepository extends JpaRepository<MyRoutineMiddle, Long> {
    long countByRoutineList(MyRoutineList routineList);

    List<MyRoutineMiddle> findByRoutineList(MyRoutineList routineList);
}