import { Box, Heading, Stack, Text, theme } from '@chakra-ui/react';
import React from 'react';

type Props = {
  image?: React.ReactNode;
  action?: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode | string;
};

const EmptyState: React.FC<Props> = ({ image, action, title, subtitle }) => {
  return (
    <Box
      backgroundColor="white"
      ml={0}
      mr={0}
      borderRadius={8}
      border="1px solid"
      borderColor="gray.200"
    >
      <Stack
        justifyContent="center"
        alignItems="center"
        spacing={2}
        p={16}
        px={8}
        borderRadius={8}
      >
        <Box mb={3}>{image}</Box>
        <Heading as="h4" textAlign="center">
          {title}
        </Heading>
        {!!subtitle && (
          <Text textAlign={'center'} color={theme.colors.gray[500]}>
            {subtitle}
          </Text>
        )}
        {!!action && <Box pt={3}>{action}</Box>}
      </Stack>
    </Box>
  );
};

export default EmptyState;
