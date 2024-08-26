import OnboardNav from './OnboardNav';
import { Box } from '@chakra-ui/react';
import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
  submitFunction: () => Promise<Response>;
} & Omit<React.ComponentPropsWithoutRef<typeof OnboardNav>, 'canGoNext'>;

const OnboardSubmitStep: React.FC<Props> = ({
  children,
  isActive,
  submitFunction,
  nextStep,
  previousStep,
  currentStep
}) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (isActive) {
      submit();
    }
    /* eslint-disable */
  }, [isActive]);

  const submit = async () => {
    try {
      await submitFunction();
      navigate('/verification_pending');
    } catch (e) {
      previousStep?.();
    }
  };

  return <Box>{children}</Box>;
};

export default OnboardSubmitStep;
