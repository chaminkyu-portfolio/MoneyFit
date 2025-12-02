package com.sanae.MoneyFit.domain.routine.repository;

import com.sanae.MoneyFit.domain.routine.entity.Template;
import com.sanae.MoneyFit.domain.routine.enums.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TemplateRepository extends JpaRepository<Template, Long> {
    Page<Template> findByCategory(Category category, Pageable pageable);


    boolean existsByName(String routineName);
}
