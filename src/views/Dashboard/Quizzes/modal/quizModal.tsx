import { MULTIPLE_CHOICE_SINGLE, TRUE_FALSE } from '../../../../types';
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Progress,
  Box,
  VStack,
  RadioGroup,
  Stack,
  Radio,
  Textarea
} from '@chakra-ui/react';
import React from 'react';

export const QuizModal = ({
  isOpen,
  onClose,
  closeOnOverlayClick = false,
  size = '800px',
  questionType,
  options,
  question,
  index
}: {
  isOpen: boolean;
  onClose: () => void;
  closeOnOverlayClick?: boolean;
  size?: string;
  questionType?: string;
  options?: string[];
  question?: string;
  index?: number | string;
}) => {
  let inputs = (
    <Box mt={2} w={'100%'} mb="24px">
      <Textarea
        h={'32px'}
        maxHeight={'64px'}
        p={'12px 14px'}
        border={'none'}
        borderBottom={'1px'}
        borderRadius={'0px'}
      />
    </Box>
  );

  if (questionType === MULTIPLE_CHOICE_SINGLE) {
    inputs = (
      <RadioGroup onChange={() => ''} value={''} mb="24px">
        <Stack direction="column">
          {options?.map((option, optionIndex) => (
            <Box
              key={optionIndex}
              display={'flex'}
              flexDirection={'row'}
              alignItems={'center'}
            >
              <Radio
                value={option}
                type="radio"
                id={`option${optionIndex}`}
                name={`question${index}`}
                mr={1}
              />
              <label
                className="font-[Inter] text-dark font-[400] text-[14px] leading-[20px]"
                htmlFor={`option${optionIndex}`}
              >
                {option}
              </label>
            </Box>
          ))}
        </Stack>
      </RadioGroup>
    );
  }

  if (questionType === TRUE_FALSE) {
    inputs = (
      <RadioGroup onChange={() => ''} value={''} mb="24px">
        <Stack direction="column">
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
            <Radio
              value={'1'}
              type="radio"
              id={`true-${index}`}
              name={`question-${index}`}
              mr={1}
            />
            <label
              className="font-[Inter] text-dark font-[400] text-[14px] leading-[20px]"
              htmlFor={`true-${index}`}
            >
              True
            </label>
          </Box>

          <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
            <Radio
              value={'1'}
              type="radio"
              id={`false-${index}`}
              name={`question-${index}`}
              mr={1}
            />
            <label
              className="font-[Inter] text-dark font-[400] text-[14px] leading-[20px]"
              htmlFor={`false-${index}`}
            >
              False
            </label>
          </Box>
        </Stack>
      </RadioGroup>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={closeOnOverlayClick}
      size={size}
    >
      <ModalOverlay />
      <ModalContent w={'740px'} h={'510px'}>
        <ModalHeader bg={'#F9F9FB'}>
          <HStack
            p={'24px 30px 0px'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Text>Study Session</Text>
            <Button
              onClick={onClose}
              bg={'red.400'}
              w={'124px'}
              h={'34px'}
              _hover={{ bg: 'red.200' }}
            >
              End
            </Button>
          </HStack>
        </ModalHeader>
        <Progress h={'2px'} value={20} colorScheme="blue" />
        <ModalBody bg={'#F9F9FB'}>
          <VStack w={'100%'} h={'100%'} justifyContent={'center'}>
            <Box bg={'whiteAlpha.900'} w={'585px'} h={'240px'} p="12px 24px">
              <Box>
                <Text
                  fontSize={'16px'}
                  fontFamily={'Inter'}
                  fontWeight={'500'}
                  lineHeight={'21px'}
                  textColor={'text.200'}
                >
                  {null ||
                    'Which of the following is the main goal of physics?'}
                </Text>
              </Box>
              <Box>{inputs}</Box>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter bg={'#F9F9FB'}>
          <Button
            bg={'blue.200'}
            w={'184px'}
            colorScheme="blue"
            mr={3}
            onClick={onClose}
          >
            Next Question
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default QuizModal;
