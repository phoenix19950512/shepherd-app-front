import { MenuButton, MenuList } from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledMenuButton = styled(MenuButton)<{
  isCreateNew?: boolean;
  isWidth?: boolean;
  isCreateNewWidth?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  border: 1px solid #e8eaed;
  border-radius: 6px;
  width: ${({ isCreateNewWidth, isWidth }) =>
    isCreateNewWidth ? '286px' : isWidth ? '150px' : 'auto'};
  height: '40px';
  background: ${({ isCreateNew }) => (isCreateNew ? '#207DF7' : 'transparent')};
  text-align: center;
  color: ${({ isCreateNew }) => (isCreateNew ? '#FFFF' : '#585F68')};
  > span {
    display: ${({ isCreateNew }) => (isCreateNew ? '' : 'flex')};
    align-items: center;
    padding: 10px;
    gap: 6px;
    /* justify-content: center; */
  }
  font-weight: ${({ isCreateNew }) => isCreateNew && '700'};
  font-size: 0.875rem;
`;

export const StyledMenuList = styled(MenuList)<{ isCreateNew?: boolean }>`
  position: absolute;
  top: 100%;
  left: ${({ isCreateNew }) => (isCreateNew ? '34px' : '-88px')};
  z-index: 50;
  margin-top: 0.625rem;
  width: 100%;
  transform-origin: top right;
  border-radius: 0.375rem;
  background-color: white;
  padding: 0.5rem;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  outline: none;
  ring-width: 1px;
  ring-color: gray.900;
  ring-opacity: 0.2;
`;
