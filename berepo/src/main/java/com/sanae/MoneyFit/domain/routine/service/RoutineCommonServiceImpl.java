package com.sanae.MoneyFit.domain.routine.service;


import com.sanae.MoneyFit.domain.routine.dto.response.CommonResponseDto;
import com.sanae.MoneyFit.domain.routine.entity.Emoji;
import com.sanae.MoneyFit.domain.routine.entity.Template;
import com.sanae.MoneyFit.domain.routine.enums.Category;
import com.sanae.MoneyFit.domain.routine.repository.EmojiRepository;
import com.sanae.MoneyFit.domain.routine.repository.TemplateRepository;
import com.sanae.MoneyFit.global.web.response.PaginatedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * <h2>RoutineCommonServiceImpl</h2>
 * <p>루틴 관련 공통 API 비즈니스 로직을 구현한 서비스 클래스입니다.</p>
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoutineCommonServiceImpl implements RoutineCommonService {

    private final TemplateRepository templateRepository;
    private final EmojiRepository emojiRepository;

    @Override
    public PaginatedResponse<CommonResponseDto.TemplateInfo> getRoutineTemplates(String category, Pageable pageable) {
        Category categoryEnum = (category == null) ? null : Category.from(category);

        Page<Template> page = (category == null)
                ? templateRepository.findAll(pageable)
                : templateRepository.findByCategory(categoryEnum, pageable);


        return PaginatedResponse.of(page, template -> {
            String imageUrl = emojiRepository.findById(template.getEmoji().getId())
                    .map(emoji -> emoji.getEmojiUrl())   // emoji 엔티티에서 imageUrl 가져오기
                    .orElse(null);
            return CommonResponseDto.TemplateInfo.builder()
                .templateId(template.getId())
                .emojiUrl(imageUrl)
                    .emojiId(template.getEmoji().getId())
                .name(template.getName())
                .content(template.getContent())
                .build();
        });
    }

    @Override
    public CommonResponseDto.EmojiList getRoutineEmojis(Category category) {
        List<Emoji> emojis = (category == null)
                ? emojiRepository.findAll()
                : emojiRepository.findByCategory(category);

        List<CommonResponseDto.EmojiInfo> items = emojis.stream()
                .map(e -> CommonResponseDto.EmojiInfo.builder()
                        .emojiId(e.getId())
                        .emojiUrl(e.getEmojiUrl())
                        .build())
                .collect(Collectors.toList());

        return CommonResponseDto.EmojiList.builder()
                .items(items)
                .build();
    }
}