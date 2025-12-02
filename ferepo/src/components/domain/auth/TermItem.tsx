import React from 'react';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';

import { theme } from '../../../styles/theme';

interface ITermItemProps {
  isChecked: boolean;
  onPress: () => void;
  isOptional?: boolean;
  text: string;
}

const TermItem = ({
  isChecked,
  onPress,
  isOptional = false,
  text,
}: ITermItemProps) => {
  return (
    <Container>
      <CheckButton onPress={onPress}>
        <MaterialIcons
          name="check"
          size={24}
          color={isChecked ? theme.colors.primary : theme.colors.gray300}
        />
      </CheckButton>
      <TermTextContainer>
        <TermText>
          <TermHighlightText>
            ({isOptional ? '선택' : '필수'})
          </TermHighlightText>{' '}
          {text}
          {!isOptional && <RequiredStar>*</RequiredStar>}
        </TermText>
      </TermTextContainer>
      <ViewDetailsButton>
        <ViewDetailsText>보기</ViewDetailsText>
      </ViewDetailsButton>
    </Container>
  );
};

export default TermItem;

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const CheckButton = styled.TouchableOpacity`
  margin-right: 12px;
`;

const TermText = styled.Text`
  font-size: ${theme.fonts.body}px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray800};
  flex: 1;
`;

const TermHighlightText = styled.Text`
  font-family: ${theme.fonts.Medium};
`;

const ViewDetailsButton = styled.TouchableOpacity``;

const ViewDetailsText = styled.Text`
  font-size: ${theme.fonts.caption}px;
  color: ${theme.colors.gray500};
  text-decoration-line: underline;
`;

const TermTextContainer = styled.View`
  flex: 1;
  flex-direction: row;
`;

const RequiredStar = styled.Text`
  color: red;
  margin-left: 4px;
`;
