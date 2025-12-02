package com.sanae.MoneyFit.domain.user.dto.request;

import com.sanae.MoneyFit.domain.user.enums.Provider;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class SignInDto {
  private String email;
  private String password;

}