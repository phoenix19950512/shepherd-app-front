import OnboardNav from './OnboardNav';
import { Box } from '@chakra-ui/react';
import * as React from 'react';

type Props = {
  children: React.ReactNode;
  hideNav?: boolean;
  handleAuth?: () => Promise<void>;
} & React.ComponentPropsWithoutRef<typeof OnboardNav>;

const OnboardStep: React.FC<Props> = ({
  children,
  nextStep,
  hideNav = false,
  ...rest
}) => {
  return (
    <Box>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          nextStep?.();
        }}
      >
        {children}
        {!hideNav && <OnboardNav {...rest} />}
      </form>
    </Box>
  );
};

export default OnboardStep;
