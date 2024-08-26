import CustomToast from './index';
import { useToast, UseToastOptions } from '@chakra-ui/react';
import { useCallback } from 'react';

export function useCustomToast() {
  const toast = useToast();

  const customToast = useCallback(
    (options: UseToastOptions) => {
      const { title, status, ...rest } = options;
      const toastOptions: UseToastOptions = {
        duration: 3000,
        isClosable: true,
        render: () => <CustomToast title={title} status={status} />,
        ...rest
      };
      return toast(toastOptions);
    },
    [toast]
  );

  return customToast;
}
