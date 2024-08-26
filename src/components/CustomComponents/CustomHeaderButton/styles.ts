import { AppThemeContext } from './../../../theme/index';
import styled, { DefaultTheme, ThemeProps } from 'styled-components';

export const IconWrapper = styled.button<ThemeProps<DefaultTheme>>`
  background-color: ${(props) => props.theme.color.whiteShade};
  color: ${({ type = 'primary' }) => 'green'};
  border-radius: 100px;
  outline: none;
  appearance: none;
  display: flex;
  align-items: 'center';
  justify-content: 'center';
`;

export const ButtonWrapper = styled.button`
  display: flex;
  align-items: center;
  flex-direction: 'row';
  justify-content: 'center';
`;

export const Title = styled.button`
  color: ${({ type = 'primary' }) => (type === 'primary' ? 'gray' : '#ffffff')};
  margin-left: 10px;
  font-size: 30px;
`;
