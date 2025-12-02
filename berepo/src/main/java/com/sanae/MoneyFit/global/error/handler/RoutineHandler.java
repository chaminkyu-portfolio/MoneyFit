package com.sanae.MoneyFit.global.error.handler;


import com.sanae.MoneyFit.global.error.exception.GeneralException;
import com.sanae.MoneyFit.global.web.response.code.BaseErrorCode;

public class RoutineHandler extends GeneralException {

    public RoutineHandler(BaseErrorCode errorCode) {
        super(errorCode);
    }
}
