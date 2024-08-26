import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

interface Template {
  id: number;
  icon: string;
  title: string;
}

interface NoteSampleProps {
  template: Template;
  onSelectTemplate: (templateId: number) => void;
}

function NoteSample({ template, onSelectTemplate }: NoteSampleProps) {
  return (
    <Box
      display="block"
      m="15px"
      className="cursor-pointer"
      onClick={() => onSelectTemplate(template.id)}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="450px"
        border="1px solid #E2E8F0"
        borderRadius="10px"
      >
        <AddIcon w={10} h={10} />
      </Box>
      <Text
        fontFamily="Inter"
        fontWeight="600"
        fontSize={{ base: '18px', md: '24px' }}
        m="20px 0 0 5px"
        lineHeight="30px"
        letterSpacing="-2%"
        color="#212224"
      >
        {template.title}
      </Text>
    </Box>
  );
}

export default NoteSample;
