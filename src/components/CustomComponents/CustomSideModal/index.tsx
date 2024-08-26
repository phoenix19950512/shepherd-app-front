import CloseIcon from '../../../assets/shadow-close-icon.svg?react';
import CustomScrollbar from '../CustomScrollBar';
import { SidebarContainer, SidebarContent } from './styles';
import clsx from 'clsx';
import React from 'react';

interface ICustomSideModalProp {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  height?: string;
}
const CustomSideModal = ({
  children,
  isOpen,
  onClose,
  height = '100vh',
  ...props
}: ICustomSideModalProp) => {
  return (
    <SidebarContainer
      className={clsx('custom-sidebar-wrapper')}
      isOpen={isOpen}
      {...props}
    >
      <div
        className={clsx(
          'custom-sidebar-icon relative top-[120px] right-[17px] cursor-pointer'
        )}
      >
        {/* <CloseIcon className={clsx('')} onClick={onClose} /> */}
        <CloseIcon onClick={onClose} />
      </div>

      <CustomScrollbar height={height}>
        <SidebarContent className={clsx('custom-sidebar-content')}>
          {children}
        </SidebarContent>
      </CustomScrollbar>
    </SidebarContainer>
  );
};

export default CustomSideModal;
