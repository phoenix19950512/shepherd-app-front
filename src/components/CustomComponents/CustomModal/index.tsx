import { StyledModalBoby } from './styles';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter
} from '@chakra-ui/react';
import React from 'react';

interface ICustomModalProps {
  modalTitle?: string | React.ReactNode;
  onClose: () => void;
  isOpen: boolean;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
  modalSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  style?: {
    height: string;
    maxWidth: string;
  };
  isModalCloseButton?: boolean;
  modalTitleStyle?: object;
}

const CustomModal = ({
  modalTitle,
  onClose,
  children,
  isOpen,
  footerContent,
  modalSize,
  style,
  isModalCloseButton,
  modalTitleStyle
}: ICustomModalProps) => {
  return (
    <Modal
      isCentered
      onClose={onClose}
      isOpen={isOpen}
      motionPreset="slideInBottom"
      size={modalSize}
    >
      <ModalOverlay
        bg="rgba(0, 0, 0, 0.6)"
        backdropFilter="blur(0.9px)"
        zIndex="overlay"
      />
      <ModalContent
        height={style?.height ?? '350px'}
        maxWidth={style?.maxWidth ?? '100%'}
        containerProps={{ justifyContent: 'end' }}
      >
        {modalTitle && (
          <ModalHeader style={modalTitleStyle}>{modalTitle}</ModalHeader>
        )}
        {isModalCloseButton && <ModalCloseButton />}
        <StyledModalBoby>{children}</StyledModalBoby>
        {footerContent && <ModalFooter>{footerContent}</ModalFooter>}
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
