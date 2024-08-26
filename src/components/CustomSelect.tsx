import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';

const SelectBoxWrapper = styled.div`
  width: 100%;
  position: relative;
`;

const SelectBox = styled.select<{ isPlaceholder: boolean }>`
  appearance: none;
  border-radius: 6px;
  width: 100%;
  border: 1px solid #e4e5e7;
  background: #fff;
  box-shadow: 0px 2px 6px 0px rgba(136, 139, 143, 0.1);
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.042px;
  color: ${({ isPlaceholder }) => (isPlaceholder ? '#9a9da2' : '#000')};
  padding: 10px;
  &:focus {
    outline: none;
  }
  .option_disabled {
    color: #9a9da2;
  }

  option:not(:disabled) {
    color: #000;
  }
`;

const DropdownIcon = styled.div<{ isOpen: boolean }>`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;

  svg {
    width: 100%;
    height: 100%;
    fill: #5c5f64;
    transform: rotate(0deg);
    transition: transform 0.3s ease-in-out;

    ${({ isOpen }) =>
      isOpen &&
      css`
        transform: rotate(180deg);
      `}
  }
`;

interface SelectBoxProps extends React.ComponentPropsWithoutRef<'select'> {
  children: React.ReactNode;
  placeholder?: string;
}

const CustomSelect: React.FC<SelectBoxProps> = ({
  children,
  placeholder,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaceholder, setIsPlaceholder] = useState(true);

  useEffect(() => {
    setIsPlaceholder(!props.value);
  }, [props.value]);

  const toggleOpen = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsOpen(!isOpen);
    // setIsPlaceholder(e.currentTarget.value === '');
  };

  return (
    <SelectBoxWrapper>
      <SelectBox onChange={toggleOpen} isPlaceholder={isPlaceholder} {...props}>
        {placeholder && (
          <option value="" disabled selected>
            {placeholder}
          </option>
        )}
        {children}
      </SelectBox>
      <DropdownIcon isOpen={isOpen}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6.07806 7.74408C6.4035 7.41864 6.93114 7.41864 7.25657 7.74408L10.0007 10.4882L12.7447 7.74408C13.0702 7.41864 13.5978 7.41864 13.9232 7.74408C14.2487 8.06951 14.2487 8.59715 13.9232 8.92259L10.5899 12.2559C10.2645 12.5814 9.73683 12.5814 9.4114 12.2559L6.07806 8.92259C5.75263 8.59715 5.75263 8.06951 6.07806 7.74408Z"
            fill="#5C5F64"
          />
        </svg>
      </DropdownIcon>
    </SelectBoxWrapper>
  );
};

export default CustomSelect;
