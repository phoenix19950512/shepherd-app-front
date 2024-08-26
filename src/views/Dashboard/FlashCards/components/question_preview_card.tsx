import { CheckIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Text,
  Icon,
  IconButton,
  Stack,
  RadioGroup,
  Radio,
  keyframes,
  HStack
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const MotionBox = motion(Box);

interface Option {
  label: string;
  value: string;
}

interface QuestionReviewCardProps {
  question: string;
  correctAnswer: string;
  isCurrentQuestion: boolean;
  index: number;
  options?: Option[];
  onDelete: () => void;
  onEdit: () => void;
}

const spreadBorderColor = keyframes`
  0% {
    border-top-color: #207DF7;
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-left-color: transparent;
  }
  25% {
    border-top-color: #207DF7;
    border-right-color: #207DF7;
  }
  50% {
    border-top-color: #207DF7;
    border-right-color: #207DF7;
    border-bottom-color: #207DF7;
  }
  75% {
    border-top-color: #207DF7;
    border-right-color: #207DF7;
    border-bottom-color: #207DF7;
    border-left-color: #207DF7;
  }
  100% {
    border-top-color: #207DF7;
    border-right-color: #207DF7;
    border-bottom-color: #207DF7;
    border-left-color: #207DF7;
  }
`;

const QuestionReviewCard: React.FC<QuestionReviewCardProps> = ({
  question,
  index,
  correctAnswer,
  isCurrentQuestion,
  onEdit,
  options,
  onDelete
}) => {
  const [selectedValue, setSelectedValue] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const handleDelete = () => {
    onDelete();
    setIsVisible(false);
  };

  const isCorrect = selectedValue === correctAnswer;

  return (
    <AnimatePresence>
      {isVisible && (
        <MotionBox
          initial={{ height: 'auto' }}
          animate={{}}
          width={'100%'}
          exit={{ height: 0 }}
          height="auto"
          borderWidth="1.5px"
          borderRadius="15px"
          bg="#FFFFFF"
          boxShadow="rgba(149, 157, 165, 0.2) 0px 8px 24px"
          borderColor={!isCurrentQuestion ? 'transparent' : '#207DF7'}
          animation={
            isCurrentQuestion ? `${spreadBorderColor} 2s forwards` : undefined
          }
        >
          <Box onClick={onEdit} cursor={'pointer'} p="24px">
            <Text
              fontWeight="500"
              fontSize="16px"
              lineHeight="21px"
              letterSpacing="0.7%"
              color="#212224"
            >
              {index + 1}. {'  '}
              {question}
            </Text>
            <RadioGroup onChange={setSelectedValue} value={selectedValue}>
              <Stack mt="20px" spacing="15px" direction="column">
                {options?.map((option, index) => (
                  <Radio value={option.value} key={index}>
                    <Text
                      fontWeight={'400'}
                      fontSize="14px"
                      lineHeight="20px"
                      color="#212224"
                    >
                      {option.label}
                    </Text>
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </Box>

          <Flex
            borderTop="1px solid #EEEFF2"
            p="14px 24px"
            justifyContent={'space-between'}
            alignItems="center"
          >
            {isCorrect ? (
              <Icon as={CheckIcon} color="green.500" />
            ) : (
              <Icon as={CheckIcon} color="#969CA6" />
            )}
            <HStack spacing={'0px'} width={'fit-content'}>
              <Box
                marginLeft={'20px'}
                _hover={{ transform: 'scale(1.2)' }}
                transition="all 0.2s"
              >
                <IconButton
                  aria-label="Edit"
                  height={'fit-content'}
                  width={'fit-content'}
                  icon={<EditIcon boxSize="18px" color="#969CA6" />}
                  variant="unstyled"
                  p={0}
                  _hover={{ bg: 'none', padding: '0px' }}
                  _active={{ bg: 'none', padding: '0px' }}
                  _focus={{ boxShadow: 'none' }}
                  onClick={onEdit}
                />
              </Box>
              <Box _hover={{ transform: 'scale(1.2)' }} transition="all 0.2s">
                <IconButton
                  aria-label="Delete"
                  height={'fit-content'}
                  width={'fit-content'}
                  icon={<DeleteIcon boxSize="18px" color="#969CA6" />}
                  variant="unstyled"
                  p={0}
                  _hover={{ bg: 'none', padding: '0px' }}
                  _active={{ bg: 'none', padding: '0px' }}
                  _focus={{ boxShadow: 'none' }}
                  onClick={handleDelete}
                />
              </Box>
            </HStack>
          </Flex>
        </MotionBox>
      )}
    </AnimatePresence>
  );
};

export default QuestionReviewCard;
