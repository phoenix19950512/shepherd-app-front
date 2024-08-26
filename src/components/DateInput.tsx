import {
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  Text
} from '@chakra-ui/react';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import InputMask from 'react-input-mask';

// @ts-ignore: deliberate choice to incorrectly extend InputProps
interface DateInputProps extends InputProps {
  value: string;
  onChange: (value: string) => void;
}

export const FORMAT = 'MM/DD/YYYY';

const DateInput: React.FC<DateInputProps> = ({ value, onChange, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const date = moment(value, FORMAT, true);
    if (date.isValid()) {
      onChange(date.format(FORMAT));
    }
  }, [value, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target?.value.replace(/_/g, '');
    if (inputRef.current) {
      const previousCursorPosition = inputRef.current.selectionStart;
      onChange(newValue);
      if (previousCursorPosition !== null) {
        const cursorPosition = Math.min(
          previousCursorPosition + newValue.length - value.length,
          10
        );
        inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }
    }
  };

  return (
    <InputMask
      maskChar=""
      mask="**/**/****"
      value={value}
      onChange={handleInputChange}
    >
      {
        // @ts-ignore: Does this work?
        (inputProps: InputProps) => (
          <InputGroup>
            <Input
              {...inputProps}
              ref={inputRef}
              isInvalid={!moment(value, FORMAT, true).isValid() && !!value}
              pr="4.5rem"
              {...rest}
            />
            <InputRightElement
              top={'50%'}
              transform={'translateY(-50%)'}
              paddingRight={'20px'}
              width="4.5rem"
            >
              <Text
                color={'#969CA6'}
                fontSize="12px"
                fontWeight={400}
                margin={0}
              >
                {FORMAT.toLowerCase()}
              </Text>
            </InputRightElement>
          </InputGroup>
        )
      }
    </InputMask>
  );
};

export default DateInput;
