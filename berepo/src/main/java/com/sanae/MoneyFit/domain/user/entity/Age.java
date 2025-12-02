package com.sanae.MoneyFit.domain.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Age {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "age_id", updatable = false, unique = true, nullable = false)
	private long id;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private String imageUrl;

	@Column(nullable = false)
	private int score;

	public void increaseScore() {
		this.score += 1;
	}
}
