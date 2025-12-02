package com.sanae.MoneyFit.domain.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MajorMiddle {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "major_middle_id", updatable = false, unique = true, nullable = false)
	private long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "age_id")
	private Age age;


	@Column(nullable = false)
	private Integer score;

	public void increaseScore() {
		this.score = this.score == null ? 1 : this.score + 1;
	}
}
