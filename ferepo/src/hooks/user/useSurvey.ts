import { useMutation } from '@tanstack/react-query';
import { postSurvey } from '../../api/user';
import { SurveyRequest } from '../../types/api';

export const useSurvey = () => {
  return useMutation({
    mutationFn: (data: SurveyRequest) => postSurvey(data),
  });
};
