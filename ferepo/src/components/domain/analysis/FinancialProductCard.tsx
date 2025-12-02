import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../../../styles/theme';

interface FinancialProductCardProps {
  title: string;
  features: string[];
  interestRate: string;
  hashtags: string[];
}

const FinancialProductCard = ({
  title,
  features,
  interestRate,
  hashtags,
}: FinancialProductCardProps) => {
  return (
    <Container>
      <ProductTitle>{title}</ProductTitle>
      <ProductContent>
        <FeaturesContainer>
          {features.map((feature, index) => (
            <FeatureText key={index}>{feature}</FeatureText>
          ))}
        </FeaturesContainer>
        <InterestContainer>
          <InterestRate>{interestRate}</InterestRate>
        </InterestContainer>
      </ProductContent>
      <HashtagContainer>
        {hashtags.map((hashtag, index) => (
          <Hashtag key={index}>{hashtag}</Hashtag>
        ))}
      </HashtagContainer>
    </Container>
  );
};

export default FinancialProductCard;

const Container = styled.View`
  background-color: #fafafa;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid ${theme.colors.gray200};
  margin-bottom: 16px;
`;

const ProductTitle = styled.Text`
  font-size: 18px;
  font-family: ${theme.fonts.SemiBold};
  color: ${theme.colors.gray800};
  margin-bottom: 8px;
`;

const ProductContent = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const FeaturesContainer = styled.View`
  flex: 1;
  /* gap: 8px; */
`;

const FeatureText = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  line-height: 18px;
`;

const InterestContainer = styled.View`
  align-items: flex-end;
  margin-left: 16px;
`;

const InterestRate = styled.Text`
  font-size: 18px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.primary};
`;

const HashtagContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
`;

const Hashtag = styled.Text`
  font-size: 12px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray400};
`;
