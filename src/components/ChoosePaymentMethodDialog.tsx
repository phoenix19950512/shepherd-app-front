import userStore from '../state/userStore';
import theme from '../theme';
import { PaymentMethod } from '../types';
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Radio,
  Text,
  VStack,
  HStack,
  useDisclosure
} from '@chakra-ui/react';
import * as React from 'react';
import { useRef, useState } from 'react';
import styled from 'styled-components';

export interface ChoosePaymentMethodDialogRef {
  choosePaymentMethod: () => Promise<PaymentMethod | null>;
  setupNewPaymentMethod?: () => Promise<void>;
}

interface Props {
  prefix?: React.ReactNode;
  onSetupNewPaymentMethod?: () => Promise<void>;
  settingUpPaymentMethod?: boolean;
}

const Root = styled(Box)`
  #payment-form {
    width: 100%;
  }
`;

const CardRoot = styled(Box)`
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: 10px;
  padding-inline: 16px;
  padding-block: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;

  &:hover {
    border-color: ${theme.colors.gray[400]};
  }
`;

const CardBrand = styled.img`
  height: 30px;
  width: 30px;
`;

const CardMeta = styled(Box)`
  flex-grow: 1;
  p {
    margin: 0;
  }
`;

const getBrandLogo = (brand: string) => {
  if (brand === 'mastercard') {
    return <CardBrand src="/images/mastercard.svg" />;
  }
  if (brand === 'amex') {
    return <CardBrand src="/images/amex.svg" />;
  }
  if (brand === 'discover') {
    return <CardBrand src="/images/discover.svg" />;
  }
  if (brand === 'diners') {
    return <CardBrand src="/images/diners.svg" />;
  }
  if (brand === 'jcb') {
    return <CardBrand src="/images/jcb.svg" />;
  }
  if (brand === 'unionpay') {
    return <CardBrand src="/images/unionpay.svg" />;
  }
  if (brand === 'visa') {
    return <CardBrand src="/images/visa.svg" />;
  }

  return <CardBrand src="/images/generic-card-brand.svg" />;
};

const ChoosePaymentMethodDialog = React.forwardRef<
  ChoosePaymentMethodDialogRef,
  Props
>(({ prefix, onSetupNewPaymentMethod, settingUpPaymentMethod }, ref) => {
  const { user } = userStore();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPaymentMethod, setCurrentPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const promiseResolve = useRef<
    ((value: PaymentMethod | PromiseLike<PaymentMethod>) => void) | null
  >(null);
  const promiseReject = useRef<(() => void) | null>(null);

  React.useImperativeHandle(ref, () => {
    return {
      choosePaymentMethod: async () => {
        onOpen();
        return new Promise<PaymentMethod>((resolve, reject) => {
          promiseResolve.current = resolve;
          promiseReject.current = reject;
        });
      },
      setupNewPaymentMethod: onSetupNewPaymentMethod
    };
  });

  return (
    <Root>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          promiseReject.current?.();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose a payment method</ModalHeader>
          <ModalCloseButton />
          <ModalBody flexDirection={'column'}>
            {prefix}
            <VStack width={'100%'}>
              {user?.paymentMethods.map((pm) => (
                <CardRoot
                  onClick={() => setCurrentPaymentMethod(pm)}
                  key={pm._id}
                >
                  {getBrandLogo(pm.brand)}
                  <CardMeta>
                    <Text>•••• {pm.last4}</Text>
                    <Text>
                      {pm.expMonth}/{pm.expYear}
                    </Text>
                  </CardMeta>
                  <Radio
                    readOnly
                    isChecked={currentPaymentMethod?._id === pm._id}
                  />
                </CardRoot>
              ))}
            </VStack>
            <Box width={'100%'} mt={5}>
              <HStack spacing={4}>
                {onSetupNewPaymentMethod && (
                  <Button
                    onClick={() => {
                      onSetupNewPaymentMethod();
                    }}
                    isLoading={settingUpPaymentMethod}
                    variant={'solid'}
                    isDisabled={settingUpPaymentMethod}
                    flexGrow={1}
                  >
                    Add Payment Method
                  </Button>
                )}
                <Button
                  onClick={() => {
                    onClose();
                    promiseResolve.current?.(
                      currentPaymentMethod as PaymentMethod
                    );
                  }}
                  type="submit"
                  variant={'solid'}
                  isDisabled={currentPaymentMethod === null}
                  flexGrow={1}
                >
                  Continue
                </Button>
              </HStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Root>
  );
});

export default ChoosePaymentMethodDialog;
