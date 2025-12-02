package com.sanae.MoneyFit.domain.routine.controller;

import com.sanae.MoneyFit.domain.routine.dto.response.CommonResponseDto;
import com.sanae.MoneyFit.domain.routine.enums.Category;
import com.sanae.MoneyFit.domain.routine.service.RoutineCommonService;
import com.sanae.MoneyFit.global.error.handler.RoutineHandler;
import com.sanae.MoneyFit.global.web.response.ApiResponse;
import com.sanae.MoneyFit.global.web.response.PaginatedResponse;
import com.sanae.MoneyFit.global.web.response.code.status.ErrorStatus;
import com.sanae.MoneyFit.global.web.response.code.status.SuccessStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 루틴 공통 API 컨트롤러
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/routines")
@Tag(name = "Routine-Common", description = "루틴 공통 API")
public class RoutineCommonController {

    private final RoutineCommonService routineCommonService;

    @GetMapping("/templates")
    @Operation(summary = "루틴 템플릿 목록 조회 API", description = "카테고리에 따른 루틴 템플릿을 페이지네이션하여 조회합니다.")
    public ResponseEntity<ApiResponse<PaginatedResponse<CommonResponseDto.TemplateInfo>>> getRoutineTemplates(
            @RequestParam(required = false) String category,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {



        PaginatedResponse<CommonResponseDto.TemplateInfo> response =
                routineCommonService.getRoutineTemplates(category, pageable);

        if (response.items().isEmpty()) {
            return ResponseEntity.ok(ApiResponse.of(SuccessStatus.NO_CONTENT, response));
        }
        return ResponseEntity.ok(ApiResponse.onSuccess(response, "템플릿 목록 조회 성공"));
    }

    @GetMapping("/emoji")
    @Operation(summary = "이모지 목록 조회 API", description = "카테고리에 따른 이모지 목록을 조회합니다.")
    public ResponseEntity<ApiResponse<CommonResponseDto.EmojiList>> getRoutineEmojis(
            @RequestParam(required = false) String category) {

        Category categoryEnum = Category.from(category);
        if (category != null && categoryEnum == null) {
            throw new RoutineHandler(ErrorStatus.INVALID_CATEGORY);
        }

        CommonResponseDto.EmojiList response = routineCommonService.getRoutineEmojis(categoryEnum);

        if (response.getItems().isEmpty()) {
            return ResponseEntity.ok(ApiResponse.of(SuccessStatus.NO_CONTENT, response));
        }
        return ResponseEntity.ok(ApiResponse.onSuccess(response, "이모지 목록 조회 성공"));
    }
}
