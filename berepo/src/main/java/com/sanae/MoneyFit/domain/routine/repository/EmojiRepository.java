package com.sanae.MoneyFit.domain.routine.repository;

import com.sanae.MoneyFit.domain.routine.entity.Emoji;
import com.sanae.MoneyFit.domain.routine.enums.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmojiRepository extends JpaRepository<Emoji, Long> {
    List<Emoji> findByCategory(Category category);
}