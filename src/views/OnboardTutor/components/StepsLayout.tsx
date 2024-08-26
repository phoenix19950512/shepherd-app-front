import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';

interface StepsLayoutProps {
  currentStep: number;
  totalSteps: number;
  stepText: string;
  mainText: string;
  supportingText: string;
  nextStep: string;
  onBackClick: () => void;
  onNextClick: () => void;
  children: React.ReactNode;
  isValid: boolean;
}

// Helper function to format the nextStep text
const formatNextStepText = (nextStep: string) => {
  if (!nextStep) return '';
  const words = nextStep.split('_').map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return words.join(' ');
};

const StepsLayout: React.FC<StepsLayoutProps> = ({
  currentStep,
  totalSteps,
  stepText,
  mainText,
  supportingText,
  nextStep,
  onBackClick,
  onNextClick,
  children,
  isValid
}) => {
  const [mainTextAnimationComplete, setMainTextAnimationComplete] =
    useState(false);
  const [supportingTextAnimationComplete, setSupportingTextAnimationComplete] =
    useState(false);

  useEffect(() => {
    setMainTextAnimationComplete(false);
    setSupportingTextAnimationComplete(false);
  }, [mainText, supportingText]);

  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  const textVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  };

  const childrenVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  const formattedNextStepText = formatNextStepText(nextStep);

  const handleMainTextAnimationComplete = () => {
    setMainTextAnimationComplete(true);
  };

  const handleSupportingTextAnimationComplete = () => {
    setSupportingTextAnimationComplete(true);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Box
        border="1px solid #EBECF0"
        borderRadius="12px"
        marginTop={'100px'}
        minWidth={'700px'}
        maxWidth={'800px'}
        padding="20px"
        width="fit-content"
        position="relative"
      >
        <Flex alignItems="center" marginBottom="10px">
          <Box
            display="flex"
            flexDirection="row"
            fontWeight={500}
            fontSize="14px"
            alignItems="flex-start"
            padding="7px 15px"
            background="#F1F2F3"
            borderRadius="50px"
            color={'#585F68'}
          >
            Step {currentStep} of {totalSteps}
          </Box>
          <Text
            fontWeight="500"
            marginLeft={'20px'}
            marginBottom={0}
            fontSize="14px"
            lineHeight="17px"
            color="#585F68"
          >
            {stepText}
          </Text>
        </Flex>

        <motion.div
          key={`mainText-${currentStep}`}
          variants={textVariants}
          initial="hidden"
          animate={mainTextAnimationComplete ? 'visible' : 'hidden'}
          exit="exit"
          onAnimationComplete={handleMainTextAnimationComplete}
        >
          <Text
            fontFamily="Inter"
            fontStyle="normal"
            fontWeight={600}
            fontSize="24px"
            marginTop={'40px'}
            width="85%"
            lineHeight="34px"
            letterSpacing="-0.02em"
            color="#212224"
            flex="none"
            order={0}
            flexGrow={0}
          >
            {mainText}
          </Text>
        </motion.div>

        <motion.div
          key={`supportingText-${currentStep}`}
          variants={textVariants}
          initial="hidden"
          animate={supportingTextAnimationComplete ? 'visible' : 'hidden'}
          exit="exit"
          onAnimationComplete={handleSupportingTextAnimationComplete}
        >
          <Text
            fontStyle="normal"
            fontWeight={400}
            width="80%"
            fontSize="14px"
            lineHeight="21px"
            color="#585F68"
            flex="none"
            order={1}
            flexGrow={0}
            marginBottom="16px"
          >
            {supportingText}
          </Text>
        </motion.div>

        <Box marginTop={10}>
          <AnimatePresence>
            {currentStep > 0 && (
              <motion.div
                key={currentStep}
                variants={childrenVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.1 }}
              >
                {React.cloneElement(children as React.ReactElement, {
                  key: currentStep
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        <Flex
          marginTop={'48px'}
          marginBottom={'40px'}
          justifyContent="space-between"
        >
          {currentStep > 1 ? (
            <Button
              variant="ghost"
              colorScheme="white"
              padding={0}
              onClick={onBackClick}
              display="flex"
              alignItems="center"
              color={'#6E7682'}
              justifyContent={'center'}
            >
              <Box
                borderRadius="full"
                background="#EEF0F1"
                padding="4px"
                width="40px"
                height="40px"
                marginRight="10px"
                display="flex"
                alignItems="center"
                justifyContent={'center'}
              >
                <ArrowBackIcon color={'#969CA6'} fontSize={'24px'} />
              </Box>
              Back
            </Button>
          ) : (
            <Box></Box>
          )}
          <Button
            onClick={onNextClick}
            isDisabled={!isValid}
            justifyContent="center"
            alignItems="center"
            padding="10px 32px"
            height="40px"
            background="#207DF7"
            borderRadius="8px"
            color="white"
          >
            {'Next ->'} {formattedNextStepText}
          </Button>
        </Flex>
      </Box>
    </motion.div>
  );
};

export default StepsLayout;
