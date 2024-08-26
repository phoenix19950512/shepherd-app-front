import { Box, Button, Text } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface MnemonicCardProps {
  answer: string;
  explanation: string;
}

const MotionBox = motion(Box);

const MnemonicCard: React.FC<MnemonicCardProps> = ({ answer, explanation }) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [showMoreAnswer, setShowMoreAnswer] = useState(false);
  const [isAnswerTooLong, setIsAnswerTooLong] = useState(false);

  const maxHeight = 320; // you can adjust this value

  const checkIfAnswerIsTooLong = (ref) => {
    if (ref && ref.scrollHeight > maxHeight) {
      setIsAnswerTooLong(true);
    }
  };

  return (
    <Box
      bg="#FFFFFF"
      height="fit-content"
      width="100%"
      borderRadius="8px"
      borderWidth="1px"
      transition="box-shadow 0.3s"
      _hover={{
        boxShadow: '0 0 15px rgba(33,33,33,.2)'
      }}
      borderColor="#EEEFF2"
    >
      <Box
        minHeight={`${maxHeight}px`}
        maxHeight={
          showMoreAnswer || showExplanation ? 'none' : `${maxHeight}px`
        }
        width="100%"
      >
        <Box
          width="100%"
          padding="25px"
          paddingBottom={'20px'}
          fontSize="14px"
          lineHeight="22px"
          color="#212224"
          minHeight={`${maxHeight - 20}px`}
          maxHeight={showMoreAnswer ? 'none' : `${maxHeight - 20}px`}
          height="100%"
          overflow="hidden"
          ref={checkIfAnswerIsTooLong}
        >
          <Text whiteSpace={'pre-line'}>{answer}</Text>
        </Box>

        {isAnswerTooLong && (
          <Box
            width="100%"
            display={'flex'}
            justifyContent={'center'} // Right align the button
            alignItems={'center'}
          >
            <Button
              variant="link" // Use link variant for button without a background
              color="#207DF7"
              fontSize="12px"
              _hover={{ textDecoration: 'none', color: '#207DF7' }}
              _active={{ textDecoration: 'none', color: '#207DF7' }}
              _focus={{ boxShadow: 'none' }}
              onClick={() => setShowMoreAnswer((prev) => !prev)}
            >
              {!showMoreAnswer ? 'Show More' : 'Hide'}
            </Button>
          </Box>
        )}
        <AnimatePresence mode="wait">
          {showExplanation && (
            <MotionBox
              initial={{ opacity: 0, maxHeight: 0 }}
              animate={{ opacity: 1, maxHeight: '300px' }}
              exit={{ opacity: 0, maxHeight: 0 }}
              transition={{ duration: 0.3 }}
              fontSize="12px"
              lineHeight="20px"
              color="#585F68"
              p="25px"
              borderRadius="8px"
              borderTop="1px solid #EEEFF2"
              layout
            >
              <Text>{explanation}</Text>
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
      <Box
        bg="#F5F9FF"
        width="100%"
        display={'flex'}
        py="8px"
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Button
          variant="unstyled"
          color="#207DF7"
          fontSize="12px"
          onClick={() => setShowExplanation(!showExplanation)}
          _hover={{ bg: 'none', color: '#207DF7' }}
          _active={{ bg: 'none', color: '#207DF7' }}
          _focus={{ boxShadow: 'none' }}
        >
          {showExplanation ? 'Hide Explanation' : 'See Explanation'}
        </Button>
      </Box>
    </Box>
  );
};

export default MnemonicCard;
