import { Box, Button } from '@chakra-ui/react';
import * as React from 'react';
import { StepWizardChildProps } from 'react-step-wizard';
import { useNavigate } from 'react-router-dom';

type Props = {
  canGoNext: boolean;
  showOAuthButton?: boolean;
  handleAuth?: () => void;
  stepIndicatorId?: string;
} & Partial<StepWizardChildProps>;

const OnboardNav: React.FC<Props> = ({
  previousStep,
  showOAuthButton = false,
  nextStep,
  currentStep,
  canGoNext,
  handleAuth,
  stepIndicatorId
}) => {
  const navigate = useNavigate();

  return (
    <Box
      display={'flex'}
      flexDirection="column"
      gap={4}
      marginTop={45}
      justifyContent="flex-end"
    >
      <Button
        variant="solid"
        colorScheme={'primary'}
        type="submit"
        display={
          currentStep === 1 && window.location.pathname === '/signup'
            ? 'none'
            : 'block'
        }
        isDisabled={!canGoNext}
        size={'lg'}
      >
        Next
      </Button>

      {showOAuthButton && (
        <Button
          variant="solid"
          bg="#F2F2F3"
          onClick={() => handleAuth && handleAuth()}
          colorScheme={'primary'}
          type="submit"
          size={'lg'}
          color="#000"
          leftIcon={<img src="/images/google.svg" alt="" />}
        >
          Continue With Google
        </Button>
      )}
      {currentStep !== undefined &&
        currentStep > 1 &&
        stepIndicatorId !== 'parent-or-student' &&
        stepIndicatorId !== 'about-you' && (
          <Button
            onClick={
              currentStep === 1 ? () => navigate('/signup') : previousStep
            }
            variant="link"
          >
            Previous
          </Button>
        )}
      {stepIndicatorId === 'about-you' && (
        <Button
          onClick={currentStep === 1 ? () => navigate('/signup') : previousStep}
          variant="link"
        >
          Previous
        </Button>
      )}
    </Box>
  );
};

export default OnboardNav;
