package com.sanae.MoneyFit.global.error.handler;


import com.sanae.MoneyFit.global.error.exception.GeneralException;
import com.sanae.MoneyFit.global.web.response.code.BaseErrorCode;

public class UserHandler extends GeneralException {

    public UserHandler(BaseErrorCode errorCode) {
        super(errorCode);
    }
}
