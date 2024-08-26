import theme from '../theme';
import { Slot } from '../types';
import { Box, HStack, Text } from '@chakra-ui/react';
import moment from 'moment';
import * as React from 'react';
import { FiExternalLink } from 'react-icons/fi';
import styled from 'styled-components';

type Props = {
  slot: Slot;
  url: string;
};

const DayOfWeekText = styled(Text)`
  margin: 0;
  font-weight: 500;
  color: ${theme.colors.gray[500]};
`;

const Root = styled('a')`
  border: 1px solid ${theme.colors.gray[200]};
  border-radius: ${theme.radii.md};
  padding: var(--chakra-space-4);
  display: flex;
  width: 100%;

  &:hover {
    border: 1px solid ${theme.colors.gray[500]};
    ${DayOfWeekText} {
      color: ${theme.colors.gray[600]};
    }
  }
`;

const Session: React.FC<Props> = ({ slot, url }) => {
  return (
    <Root href={url} target="_blank">
      <HStack justifyContent={'space-between'} width="100%">
        <DayOfWeekText>
          {moment(slot.begin).format('dddd MMMM Do YYYY')} &middot;{' '}
          {moment(slot.begin).format('hh:mm A')} —{' '}
          {moment(slot.end).format('hh:mm A')}
        </DayOfWeekText>
        <Box>
          <FiExternalLink />
        </Box>
      </HStack>
    </Root>
  );
};

export default Session;
