import theme from '../../../theme';

import { IconWrapper, ButtonWrapper, Title } from './styles';
import React from 'react';
import { ThemeProvider } from 'styled-components';

interface ButtonProps {
  title: string;
  onClick: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
  type: 'primary' | 'secondary';
  icon?: React.ReactNode;
  active?: boolean;
}

const HeaderButton = ({ title, onClick, icon }: ButtonProps) => {
  return (
    <ThemeProvider theme={theme}>
      <ButtonWrapper onClick={onClick}>
        <IconWrapper>{icon && icon}</IconWrapper>
        <Title>{title}</Title>
      </ButtonWrapper>
    </ThemeProvider>
  );
};

export default HeaderButton;
