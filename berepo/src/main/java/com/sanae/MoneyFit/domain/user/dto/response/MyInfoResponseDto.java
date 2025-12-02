package com.sanae.MoneyFit.domain.user.dto.response;

import lombok.*;

@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MyInfoResponseDto {
    private String nickname;
    private String age;
    private String major;
    private String profileImage;
    private String bankAccount;
    private Long point;
    private Boolean isMarketing;
    private Boolean accountCertificationStatus;
}
