import { Box, Heading, Text } from '@chakra-ui/react';
import React from 'react';

type Props = React.ComponentProps<typeof Box> & {
  title: string;
  subtitle: string;
};

const PageTitle: React.FC<Props> = ({ title, subtitle, ...rest }) => {
  return (
    <Box {...rest}>
      <Heading as="h3" marginBottom={'8px'}>
        {title}
      </Heading>
      <Text color={'#585F68'} className="body2">
        {subtitle}
      </Text>
    </Box>
  );
};

export default PageTitle;
