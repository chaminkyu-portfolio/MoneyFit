import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import errorHandler from '../../utils/errorHandler';

// 간단한 에러 처리 훅
export const useErrorHandler = () => {
  const navigation = useNavigation();

  // API 에러 처리
  const handleApiError = useCallback(
    (error: any, showAlert: boolean = true) => {
      const message = errorHandler.handleApiError(error);

      if (showAlert) {
        errorHandler.showError(message);
      }

      return message;
    },
    [],
  );

  // 범용 에러 처리
  const handleError = useCallback((error: any, showAlert: boolean = true) => {
    const message = errorHandler.handleError(error);

    if (showAlert) {
      errorHandler.showError(message);
    }

    return message;
  }, []);

  // 에러 처리 + Alert 표시 (한번에)
  const handleAndShowError = useCallback(
    (error: any, title: string = '오류') => {
      errorHandler.handleAndShowError(error, title);
    },
    [],
  );

  return {
    handleApiError,
    handleError,
    handleAndShowError,
  };
};
