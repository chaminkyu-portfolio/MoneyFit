package com.sanae.MoneyFit.domain.routine.service;

import com.sanae.MoneyFit.domain.routine.dto.response.RankResponseDto;
import com.sanae.MoneyFit.domain.user.entity.Age;
import com.sanae.MoneyFit.domain.user.entity.User;
import com.sanae.MoneyFit.domain.user.repository.AgeRepository;
import com.sanae.MoneyFit.domain.user.repository.UserRepository;
import com.sanae.MoneyFit.global.error.handler.UserHandler;
import com.sanae.MoneyFit.global.web.response.code.status.ErrorStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RankService {

	private final AgeRepository ageRepository;
	private final UserRepository userRepository;

	@Transactional(readOnly = true)
	public RankResponseDto.RankPage getRanking(UUID userId, Pageable pageable) {
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new UserHandler(ErrorStatus.USER_NOT_FOUND));


			return getUniversityRanking(user, pageable);

	}

	private RankResponseDto.RankPage getUniversityRanking(User user, Pageable pageable) {
		PageRequest pageRequest = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
			Sort.by(Sort.Direction.DESC, "score"));
		Page<Age> page = ageRepository.findAll(pageRequest);

		List<RankResponseDto.RankInfo> items = new ArrayList<>();
		for (Age u : page.getContent()) {
			int rank = (int) ageRepository.countByScoreGreaterThan(u.getScore()) + 1;
			items.add(RankResponseDto.RankInfo.builder()
				.rank(rank)
				.name(u.getName())
				.score(u.getScore())
				.build());
		}

		Age myAge = user.getAge();
		long higherCount = ageRepository.countByScoreGreaterThan(myAge.getScore());
		RankResponseDto.MyRankInfo myItem = RankResponseDto.MyRankInfo.builder()
			.rank((int) higherCount + 1)
			.universityName(myAge.getName())
			.score(myAge.getScore())
			.build();

		return RankResponseDto.RankPage.builder()
			.page(page.getNumber())
			.pageSize(page.getSize())
			.totalItems(page.getTotalElements())
			.totalPages(page.getTotalPages())
			.myItem(myItem)
			.items(items)
			.build();
	}

}