package com.sanae.MoneyFit.domain.user.dto.response;

import com.sanae.MoneyFit.domain.user.entity.Age;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchInfoDto {
	private Long id;
	private String name;

	public static SearchInfoDto fromUniversity(Age age) {
		return SearchInfoDto.builder()
			.id(age.getId())
			.name(age.getName())
			.build();
	}

}