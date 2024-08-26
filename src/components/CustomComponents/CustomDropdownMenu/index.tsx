import { StyledMenuButton, StyledMenuList } from './styles';
import { Menu } from '@chakra-ui/react';
import React, { ReactElement } from 'react';

interface IDropdownProps {
  menuTitle: string;
  DropdownMenuIcon: ReactElement;
  children?: React.ReactNode;
  isCreateNew?: boolean;
  isWidth?: boolean;
  isCreateNewWidth?: boolean;
  iconPlacement?: any;
}

const DropdownMenu = ({
  menuTitle,
  DropdownMenuIcon,
  children,
  isCreateNew,
  isWidth,
  isCreateNewWidth,
  iconPlacement = 'before'
}: IDropdownProps) => {
  return (
    <Menu>
      <StyledMenuButton
        isWidth={isWidth}
        isCreateNewWidth={isCreateNewWidth}
        isCreateNew={isCreateNew}
      >
        {iconPlacement === 'before' && DropdownMenuIcon}
        <span>{menuTitle}</span>

        {iconPlacement === 'after' && DropdownMenuIcon}
      </StyledMenuButton>
      <StyledMenuList isCreateNew={isCreateNew}>{children}</StyledMenuList>
    </Menu>
  );
};

export default DropdownMenu;
