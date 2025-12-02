import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { TextInput } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';

interface OtpInputProps {
  code: string;
  onChangeText: (text: string) => void;
  maxLength?: number;
  autoFocus?: boolean;
}

export interface OtpInputRef {
  focusLastInput: () => void;
  focusFirstInput: () => void;
}

const OtpInput = forwardRef<OtpInputRef, OtpInputProps>(
  ({ code, onChangeText, maxLength = 4, autoFocus = true }, ref) => {
    const inputRefs = useRef<TextInput[]>([]);
    const [focusedIndex, setFocusedIndex] = useState(0);

    const handleCodeChange = (text: string, index: number) => {
      const numericText = text.replace(/[^0-9]/g, ''); // 숫자만 허용

      if (numericText.length > 0) {
        // 현재 입력값을 code 배열에 반영
        const newCode = code.split('');
        newCode[index] = numericText;
        onChangeText(newCode.join(''));

        // 다음 입력창으로 포커스 이동
        if (index < maxLength - 1) {
          inputRefs.current[index + 1]?.focus();
          setFocusedIndex(index + 1);
        }
      } else {
        // 삭제 시 현재 위치의 값을 지우고 이전 입력창으로 포커스 이동
        const newCode = code.split('');
        newCode[index] = '';
        onChangeText(newCode.join(''));

        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
          setFocusedIndex(index - 1);
        }
      }
    };

    const handleKeyPress = (e: any, index: number) => {
      if (e.nativeEvent.key === 'Backspace') {
        if (code[index] === '') {
          // 빈 칸에서 백스페이스 시 이전 입력창으로 이동하고 값 삭제
          if (index > 0) {
            const newCode = code.split('');
            newCode[index - 1] = '';
            onChangeText(newCode.join(''));
            inputRefs.current[index - 1]?.focus();
            setFocusedIndex(index - 1);
          }
        } else {
          // 값이 있는 칸에서 백스페이스 시 현재 값 삭제
          const newCode = code.split('');
          newCode[index] = '';
          onChangeText(newCode.join(''));
        }
      }
    };

    const handleFocus = (index: number) => {
      setFocusedIndex(index);
    };

    // ref를 통해 외부에서 마지막 입력창에 포커스할 수 있도록 함
    useImperativeHandle(ref, () => ({
      focusLastInput: () => {
        if (inputRefs.current[maxLength - 1]) {
          inputRefs.current[maxLength - 1].focus();
          setFocusedIndex(maxLength - 1);
        }
      },
      focusFirstInput: () => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
          setFocusedIndex(0);
        }
      },
    }));

    return (
      <OtpInputContainer>
        {Array.from({ length: maxLength }).map((_, index) => (
          <OtpBox
            key={index}
            ref={(ref) => {
              if (ref) inputRefs.current[index] = ref;
            }}
            value={code[index] || ''}
            onChangeText={(text) => handleCodeChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => handleFocus(index)}
            maxLength={1}
            keyboardType="number-pad"
            autoFocus={autoFocus && index === 0}
            isFocused={index === focusedIndex}
          />
        ))}
      </OtpInputContainer>
    );
  },
);

export default OtpInput;

const OtpInputContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 24px;
  gap: 8px;
`;

const OtpBox = styled.TextInput<{ isFocused: boolean }>`
  flex: 1;
  max-width: 48px;
  min-width: 36px;
  height: 50px;
  border-bottom-width: 2px;
  border-color: ${(props) =>
    props.isFocused ? theme.colors.primary : theme.colors.gray300};
  text-align: center;
  font-size: ${theme.fonts.title}px;
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray900};
`;
