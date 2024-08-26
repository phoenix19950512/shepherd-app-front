import { Tutor } from '../types';
import Panel from './Panel';
import { Avatar, Box, HStack, Text } from '@chakra-ui/react';
import { capitalize } from 'lodash';
import React, { ComponentProps } from 'react';
import styled from 'styled-components';

type Props = {
  tutor: Tutor;
} & ComponentProps<typeof Box>;

const Root = styled(Panel)`
  background: #fff;
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
`;
const TutorCard: React.FC<Props> = ({ tutor, ...rest }) => {
  return (
    <Root {...rest}>
      <Box width={'100%'} display={'flex'} flexDirection="row" gap="20px">
        <Box>
          <Avatar
            width={'45px'}
            height="45px"
            name={`${tutor?.user?.name?.first} ${tutor?.user?.name?.last}`}
            src={tutor.avatar}
          />
        </Box>
        <Box flexGrow={1}>
          <HStack justifyContent={'space-between'}>
            <Text className="sub2" color={'text.200'} mb={0}>
              {capitalize(tutor?.user?.name?.first)}{' '}
              {capitalize(tutor?.user?.name?.last)}
            </Text>
          </HStack>
          <Text
            noOfLines={2}
            whiteSpace={'normal'}
            mt={1}
            mb={0}
            className="body2"
            color={'text.200'}
          >
            {tutor?.description}
          </Text>
        </Box>
        <Text color="text.200" className="sub2" mb={0}>
          ${tutor?.rate}/hour
        </Text>
      </Box>
    </Root>
  );
};

export default TutorCard;
