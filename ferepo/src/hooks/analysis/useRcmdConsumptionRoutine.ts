import { useMutation } from '@tanstack/react-query';
import { rcmdConsumptionRoutine } from '../../api/analysis';
import { RcmdConsumptionRoutineParams } from '../../types/api';

/**
 * 소비 루틴 맞춤 추천 훅
 */
export const useRcmdConsumptionRoutine = () => {
  return useMutation({
    mutationFn: (params: RcmdConsumptionRoutineParams) =>
      rcmdConsumptionRoutine(params),
  });
};
