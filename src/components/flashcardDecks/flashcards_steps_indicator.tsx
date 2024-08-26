import { Box, Flex, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';
import { FaCheck, FaRedo } from 'react-icons/fa';

export interface Step {
  title: string;
}

interface StepIndicatorProps {
  steps: Step[];
  activeStep: number;
  isFirstAttempt: boolean;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  activeStep,
  isFirstAttempt
}) => (
  <Flex
    background={'transparent'}
    direction="row"
    justify="space-between"
    width={'100%'}
    mt={8}
    pos="relative"
  >
    <Box
      h="2px"
      bg="#DCDEDF"
      pos="absolute"
      w="100%"
      top="50%"
      transform="translateY(-50%)"
      left="0"
    />
    <Box
      h="2px"
      bg="#207DF7"
      pos="absolute"
      w={`${(100 / (steps.length - 1)) * activeStep}%`}
      top="50%"
      transform="translateY(-50%)"
      left="0"
      transition="0.4s ease"
    />

    {steps.map((step, index) => (
      <Flex direction="column" alignItems="center" zIndex="1" key={index}>
        <Text
          pos="absolute"
          color="var(--text-500, #969CA6)"
          fontSize="12px"
          fontFamily="Inter"
          lineHeight="17px"
          whiteSpace="nowrap"
          top="-24px"
        >
          {step.title}
        </Text>
        {activeStep === index && !isFirstAttempt ? (
          <Box
            w="20px"
            h="20px"
            borderRadius="50%"
            bg={'#fff'}
            transition="0.4s ease"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <motion.div animate={{ rotate: 360 }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4C9.4095 4 7.10606 5.23053 5.64274 7.14274L8 9.5H2V3.5L4.21863 5.71863C6.05061 3.452 8.85558 2 12 2C17.5228 2 22 6.47715 22 12H20C20 7.58172 16.4183 4 12 4ZM4 12C4 16.4183 7.58172 20 12 20C14.5905 20 16.894 18.7695 18.3573 16.8573L16 14.5H22V20.5L19.7814 18.2814C17.9494 20.548 15.1444 22 12 22C6.47715 22 2 17.5228 2 12H4Z"
                  fill="#F53535"
                />
              </svg>
            </motion.div>
          </Box>
        ) : (
          <Box
            w="20px"
            h="20px"
            borderRadius="50%"
            bg={activeStep >= index ? '#207DF7' : '#E6E8EA'}
            border="1.5px solid"
            borderColor={activeStep >= index ? '#207DF7' : '#EFF0F0'}
            transition="0.4s ease"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {activeStep > index && <FaCheck color="white" size="10px" />}
          </Box>
        )}
      </Flex>
    ))}
  </Flex>
);

export default StepIndicator;
