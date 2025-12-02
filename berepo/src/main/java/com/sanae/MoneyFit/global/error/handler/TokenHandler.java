package com.sanae.MoneyFit.global.error.handler;


import com.sanae.MoneyFit.global.error.exception.GeneralException;
import com.sanae.MoneyFit.global.web.response.code.BaseErrorCode;

public class TokenHandler extends GeneralException {
  public TokenHandler(BaseErrorCode errorCode) {
    super(errorCode);
  }
}
