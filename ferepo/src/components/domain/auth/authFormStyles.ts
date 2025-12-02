// src/components/auth/authFormStyles.ts

import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';

// 여러 화면에서 재사용될 '입력창 단체' 스타일
export const FormGroup = styled.View`
  width: 100%;
  margin-bottom: 24px;
`;

// 여러 화면에서 재사용될 '라벨' 스타일
export const Label = styled.Text`
  font-family: ${theme.fonts.Medium};
  font-size: 14px;
  color: ${theme.colors.gray800};
  margin-bottom: 8px;
`;
