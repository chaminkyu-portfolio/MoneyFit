package com.sanae.MoneyFit.global.error.handler;

import com.sanae.MoneyFit.global.error.exception.GeneralException;
import com.sanae.MoneyFit.global.web.response.code.BaseErrorCode;

public class AnalysisHandler extends GeneralException {
	public AnalysisHandler(BaseErrorCode errorCode) {
		super(errorCode);
	}
}