package com.sanae.MoneyFit.domain.user.repository;

import com.sanae.MoneyFit.domain.user.entity.Age;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AgeRepository extends JpaRepository<Age, Long> {
	List<Age> findTop10ByNameContainingIgnoreCase(String keyword);

	long countByScoreGreaterThan(int score);

	Optional<Age> findByName(String age);
}
