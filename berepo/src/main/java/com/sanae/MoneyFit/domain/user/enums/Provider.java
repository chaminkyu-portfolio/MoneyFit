package com.sanae.MoneyFit.domain.user.enums;

public enum Provider {
  LOCAL("LOCAL"),
  KAKAO("KAKAO"),
  NAVER("NAVER");

  private final String provider;

  Provider(String provider) {
    this.provider = provider;
  }

  @Override
  public String toString() {
    return provider;
  }
}
