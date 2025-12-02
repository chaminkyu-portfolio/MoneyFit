package com.sanae.MoneyFit.domain.user.dto.request;

import com.sanae.MoneyFit.domain.user.enums.Provider;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class OauthCheckRequestDto {

  private String email;
  private Provider provider;
  private String providerId;

}
