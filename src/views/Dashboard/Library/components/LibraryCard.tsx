import {
  Box,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Flex,
  Checkbox
} from '@chakra-ui/react';
import { capitalize } from 'lodash';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { FaEllipsisV } from 'react-icons/fa';

interface LibraryCardProps {
  question: string;
  answer: string;
  difficulty: string;
  explanation?: string;
  options?: Array<{
    label: string;
    color?: string;
    icon?: JSX.Element;
    onClick?: () => void;
  }>;
  isSelected?: boolean;
  onSelect?: (isSelected: boolean) => void;
}

const MotionBox = motion(Box);

const LibraryCard: React.FC<LibraryCardProps> = ({
  question,
  answer,
  explanation,
  difficulty,
  options = [],
  isSelected,
  onSelect
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [showMoreAnswer, setShowMoreAnswer] = useState(false);
  const answerRef = useRef<HTMLDivElement>(null);
  const maxHeight = 320; // Fixed value for question box
  const initialCardHeight = '400px'; // Set initial fixed height for each card

  useEffect(() => {
    if (answerRef.current && answerRef.current.scrollHeight > maxHeight) {
      setShowMoreAnswer(true);
    }
  }, [answer]);

  return (
    <Box
      bg="#FFFFFF"
      height={showExplanation ? 'auto' : initialCardHeight}
      width="100%"
      borderRadius="8px"
      borderWidth="1px"
      transition="box-shadow 0.3s, height 0.3s ease"
      _hover={{ boxShadow: '0 0 15px rgba(33,33,33,.2)' }}
      borderColor="#EEEFF2"
      display="flex"
      flexDirection="column"
    >
      <Flex
        bg="#F5F9FF"
        w="full"
        p="10px 18px"
        justifyContent="space-between"
        alignItems="center"
      >
        <Checkbox
          isChecked={isSelected}
          onChange={(e) => onSelect?.(e.target.checked)}
        />
        <Text>{capitalize(difficulty)}</Text>
        {/* <Menu>
          <MenuButton
            as={IconButton}
            aria-label="More options"
            icon={<FaEllipsisV />}
            size="sm"
            variant="ghost"
          />
          <MenuList fontSize="14px" minWidth="185px" borderRadius="8px">
            {options.map((option, index) => (
              <MenuItem
                key={index}
                onClick={option.onClick}
                color={option.color || '#212224'}
              >
                {option.icon && <Box mr="2">{option.icon}</Box>}
                {option.label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu> */}
      </Flex>

      <Box
        flex="1"
        fontSize="14px"
        lineHeight="22px"
        color="#212224"
        overflow="auto"
        background={'#F9FAFB'}
      >
        <Box
          p="20px"
          borderBottom="1px solid #EEEFF2"
          background="white"
          height="40%"
          overflow="auto"
        >
          <Text whiteSpace="pre-line" color="#212224">
            {question}
          </Text>
        </Box>
        <Box ref={answerRef} p="20px">
          <Text whiteSpace="pre-line" color="#6D7682">
            {answer}
          </Text>
          {showMoreAnswer && (
            <Button
              variant="link"
              color="#207DF7"
              onClick={() => setShowMoreAnswer((prev) => !prev)}
            >
              {showMoreAnswer ? 'Hide' : 'Show More'}
            </Button>
          )}
        </Box>
      </Box>

      <Box
        bg="#F5F9FF"
        py="8px"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Button
          variant="unstyled"
          color="#207DF7"
          onClick={() => setShowExplanation((prev) => !prev)}
        >
          {showExplanation ? 'Hide Explanation' : 'See Explanation'}
        </Button>
      </Box>

      <AnimatePresence mode="wait">
        {showExplanation && (
          <MotionBox
            initial={{ opacity: 0, maxHeight: 0 }}
            animate={{ opacity: 1, maxHeight: '300px' }}
            exit={{ opacity: 0, maxHeight: 0 }}
            transition={{ duration: 0.3 }}
            p="25px"
            borderTop="1px solid #EEEFF2"
          >
            <Text
              fontSize="14px"
              fontFamily="inter"
              lineHeight="20px"
              color="#585F68"
            >
              {explanation}
            </Text>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default LibraryCard;
