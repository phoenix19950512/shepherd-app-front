import { Text, Box, useDisclosure } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

interface TitleData {
  name: string;
}

interface TitleCardProps {
  data: TitleData;
  onClick?: () => void;
}

const MotionBox = motion(Box);

const TitleCard: React.FC<TitleCardProps> = ({ data, onClick }) => {
  const { name } = data;
  const { isOpen, onToggle } = useDisclosure();
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (initialLoad) {
      onToggle();
      setInitialLoad(false);
    }
  }, [initialLoad, onToggle]);

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <MotionBox
      w="auto"
      h="100%"
      bg="white"
      borderWidth="1px"
      display={'flex'}
      justifyContent="space-between"
      height="fit-content"
      flexDirection={'column'}
      borderRadius="8px"
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box cursor="pointer" onClick={handleCardClick}>
        <Box display="flex" flexDirection="column" p="18px">
          <Text
            height="30px"
            mt={2}
            mb="0px"
            fontSize="md"
            fontWeight="bold"
            isTruncated
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {data.name || 'No Name available'}
          </Text>
        </Box>
      </Box>
    </MotionBox>
  );
};

export default TitleCard;
