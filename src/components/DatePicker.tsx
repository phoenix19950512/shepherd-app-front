import React, { useState } from 'react';
import DatePickerComponent, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';

const DatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  height: 44px;
  border-radius: 6px;
  border: 1px solid #e4e5e7;
  background: #fff;
  box-shadow: 0px 2px 6px 0px rgba(136, 139, 143, 0.1);

  .react-datepicker-wrapper {
    width: 100%;
  }
`;

const CalendarIcon = styled.svg`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  fill: #969ca6;
`;

const DateInput = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  color: ${(props) => (props.value ? '#000' : '#9a9da2')};
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  &::placeholder {
    color: #9a9da2;
  }
  &:focus {
    outline: none;
  }
`;

const usePlaceholderOnEmpty = (
  selected: Date | null | undefined,
  placeholder: string
): [string | undefined, (date: Date | null) => void] => {
  const [value, setValue] = useState<string | undefined>(
    selected ? selected.toISOString() : undefined
  );
  const handleChange = (date: Date | null) => {
    setValue(date ? date.toISOString() : undefined);
  };

  return [value, handleChange];
};

const DatePicker: React.FC<ReactDatePickerProps & { placeholder?: string }> = ({
  placeholder,
  selected,
  onChange,
  ...props
}) => {
  const [value, handleChange] = usePlaceholderOnEmpty(
    selected,
    placeholder || ''
  );

  return (
    <DatePickerWrapper>
      <DatePickerComponent
        placeholderText={placeholder}
        customInput={
          <DateInput placeholder={placeholder || ''} value={value} />
        }
        selected={selected}
        onChange={(date, event) => {
          handleChange(date);
          onChange(date, event);
        }}
        {...props}
      />
      <CalendarIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M14.167 2.50001H17.5003C17.9606 2.50001 18.3337 2.87311 18.3337 3.33334V16.6667C18.3337 17.1269 17.9606 17.5 17.5003 17.5H2.50033C2.04009 17.5 1.66699 17.1269 1.66699 16.6667V3.33334C1.66699 2.87311 2.04009 2.50001 2.50033 2.50001H5.83366V0.833344H7.50032V2.50001H12.5003V0.833344H14.167V2.50001ZM3.33366 7.50001V15.8333H16.667V7.50001H3.33366ZM5.00032 10.8333H9.16699V14.1667H5.00032V10.8333Z" />
      </CalendarIcon>
    </DatePickerWrapper>
  );
};

export default DatePicker;
