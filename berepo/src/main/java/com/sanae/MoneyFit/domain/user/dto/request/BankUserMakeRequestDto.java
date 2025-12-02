package com.sanae.MoneyFit.domain.user.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankUserMakeRequestDto {
    private String apiKey;
    private String userId;
}
