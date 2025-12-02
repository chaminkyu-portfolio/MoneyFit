package com.sanae.MoneyFit.domain.routine.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

/**
 * 루틴 및 이모지의 카테고리
 * <p>
 *  API 요청 시 한글 이름 또는 영문 Enum 이름으로도 파싱될 수 있도록
 *  {@link #from(String)} 메서드를 제공합니다.
 * </p>
 */
@Getter
@RequiredArgsConstructor
public enum Category { // 카테고리

    TRANSPORT("교통"),
    FOOD("음식"),
    BEAUTY("미용"),
    DAILYESSENTIALS("생필품"),
    FLEX("사치품"),
    OTHER("기타");

    private final String name;

    private static final Map<String, Category> LOOKUP = new HashMap<>();

    static {
        for (Category category : values()) {
            LOOKUP.put(category.name(), category);               // 영문 Enum 명칭
            LOOKUP.put(category.name.toUpperCase(), category);    // 한글 명칭
        }
    }

    @JsonCreator
    public static Category from(String value) {
        if (value == null) {
            return null;
        }
        return LOOKUP.get(value.toUpperCase());
    }
}
