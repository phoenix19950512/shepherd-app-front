import { Box, Flex, Text, useToast } from '@chakra-ui/react';
import React from 'react';
import { BsFillCheckCircleFill } from 'react-icons/bs';

const CustomToast = ({ title, status }) => {
  return (
    <Box
      bg={status === 'success' ? '#F1F9F1' : '#FEF0F0'}
      p={3}
      boxShadow="md"
      borderRadius="8px"
      color={status === 'success' ? '#66bd6a' : '#F53535'}
    >
      <Flex alignItems="center" gap={2}>
        <BsFillCheckCircleFill />
        <Text fontSize={14}>{title}</Text>
      </Flex>
    </Box>
  );
};

export default CustomToast;
