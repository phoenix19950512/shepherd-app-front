import theme from '../theme';
import { ButtonGroup as ChakraButtonGroup } from '@chakra-ui/react';
import * as React from 'react';
import styled from 'styled-components';

const Root = styled(ChakraButtonGroup)`
  --chakra-radii-md: 6px;
  box-shadow: 0px 2px 6px rgba(136, 139, 143, 0.1);
  width: 100%;

  button {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.001em;
    color: #6e7682;

    flex: 1 1 0;
    width: 0;

    &[data-active] {
      border-color: ${theme.colors.primary[400]};
      background: transparent;
      z-index: 1;
      color: #212224;
    }
  }
`;

type Props = React.ComponentProps<typeof ChakraButtonGroup>;

const ButtonGroup: React.FC<Props> = (props) => {
  return <Root {...props} />;
};

export default ButtonGroup;
