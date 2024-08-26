import { StyledButton } from './styles';
import React from 'react';

interface CustomButtonProps {
  isCancel?: boolean;
  isDelete?: boolean;
  isPrimary?: boolean;
  title: string;
  onClick: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
  type: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  className?: string;
}
const CustomButton = ({
  isCancel,
  isDelete,
  title,
  onClick,
  active,
  type,
  icon,
  disabled,
  className
}: CustomButtonProps) => {
  return (
    <StyledButton
      disabled={disabled}
      isCancel={isCancel}
      isDelete={isDelete}
      onClick={onClick}
      active={active}
      type={type}
      className={className}
    >
      {icon && icon}
      {title}
    </StyledButton>
  );
};

export default CustomButton;
