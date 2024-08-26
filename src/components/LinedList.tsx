import { Box, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import styled from 'styled-components';

const Title = styled(Text).attrs(() => ({ className: 'sub3' }))`
  margin-bottom: 4px;
  position: relative;
  &:before {
    content: '';
    height: 10px;
    width: 10px;
    display: block;
    border: 1px solid #207df7;
    border-radius: 100%;
    position: absolute;
    left: -21.5px;
    background: #fff;
    top: 50%;
    transform: translateY(-50%);
    z-index: 4;
  }
`;

const Subtitle = styled(Text).attrs(() => ({ className: 'body3' }))`
  margin-bottom: 0;
  color: #585f68;
`;

const Item = styled(Box)``;

const Root = styled(VStack)`
  position: relative;
  margin-left: 8px;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 7px;
    bottom: 0;
    width: 1px;
    background: #e8e9ed;
    z-index: 0;
  }
  padding-left: 17px;

  ${Item}:last-of-type ${Subtitle} {
    position: relative;
    z-index: 3;
    &:before {
      content: '';
      position: absolute;
      display: block;
      background: white;
      z-index: -13;
      left: -17px;
      top: -17px;
      bottom: 0;
      width: 1px;
    }
  }
`;

type Props = React.ComponentProps<typeof Root> & {
  items: Array<{ title: string; subtitle: string }>;
};

const LinedList: React.FC<Props> = ({ items, ...rest }) => {
  return (
    <Root spacing="24px" {...rest} alignItems="flex-start">
      {items.map((i) => (
        <Item key={i.title}>
          <Title>{i.title}</Title>
          <Subtitle>{i.subtitle}</Subtitle>
        </Item>
      ))}
    </Root>
  );
};

export default LinedList;
