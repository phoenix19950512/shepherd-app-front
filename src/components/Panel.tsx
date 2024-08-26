import { Box } from '@chakra-ui/react';
import * as React from 'react';
import styled from 'styled-components';

const Root = styled(Box)`
  background: #fff;
  border: 1px solid #ebecf0;
`;

type Props = React.ComponentProps<typeof Box>;

const Panel: React.FC<Props> = (props) => {
  return <Root borderRadius="12px" px={'32px'} py={'28px'} {...props} />;
};

export default Panel;
