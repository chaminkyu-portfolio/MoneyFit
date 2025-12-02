package com.sanae.MoneyFit.domain.user.dto.request;

import com.sanae.MoneyFit.domain.user.entity.Age;
import com.sanae.MoneyFit.domain.user.entity.User;
import com.sanae.MoneyFit.domain.user.enums.Provider;
import com.sanae.MoneyFit.domain.user.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignUpDto {

    private String email; // 이메일
    private String password; // 비밀번호
    private String nickname; //닉네임
    private String profileImage;
    private List<Role> roles;
    private Long age; // 나이
    private Boolean isMarketing; // 마케팅 수신 동의 여부
    private Provider provider;
    private String providerId;

    /**
     * Convert this DTO to a {@link User} entity.
     *
     * @param encodedPassword 인코딩된 비밀번호
     * @param age      사용자 대학교
     * @return 생성된 {@link User}
     */
    public User toEntity(String encodedPassword, Age age){
        return User.builder()
                .email(this.email)
                .password(encodedPassword)
                .nickname(this.nickname)
                .profileImage(this.profileImage)
                .point(0L)
                .roles(this.roles)
                .isMarketing(this.isMarketing)
                .provider(this.provider)
                .providerId(this.providerId)
                .age(age)
                .build();
    }
}