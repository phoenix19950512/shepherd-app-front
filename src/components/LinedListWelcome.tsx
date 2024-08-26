import { Box, Text, VStack, Button } from '@chakra-ui/react';
import React from 'react';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import styled from 'styled-components';

const Title = styled(Text).attrs(() => ({
  className: 'sub3'
}))<{ read: boolean }>`
  margin-bottom: 0px;
  position: relative;
  &:before {
    content: '';
    height: 10px;
    width: 10px;
    display: block;
    border: 1px solid #287ce6;
    border-radius: 50%;
    position: absolute;
    left: -21.5px;
    background: ${(props) => (props.read ? '#287ce6' : '#e8e9ed')};
    top: 50%;
    transform: translateY(-50%);
    z-index: 20;
  }
`;

const Subtitle = styled(Text).attrs(() => ({ className: 'body3' }))`
  margin-bottom: 0;
  color: #585f68;
`;

const Item = styled(Box)``;

const Root = styled(VStack)`
  position: relative;
  margin-left: 3px;
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 7px;
    bottom: 0;
    width: 1px;
    background: #287ce1;
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
  items: Array<{ title: string; read: boolean; id: number }>;
  clickHandler: (id: number) => void;
};

const LinedListWelcome: React.FC<Props> = ({
  items,
  clickHandler,
  ...rest
}) => {
  return (
    <Root spacing="10px" {...rest} alignItems="flex-start" width={80}>
      {items.map((i) => (
        <Item key={i.id}>
          <Title read={i.read}>
            <button
              onClick={() => clickHandler(i.id)}
              className={` ${
                i.read ? 'bg-[#f2ffff]' : 'bg-transparent	'
              } !pointer-events-auto !cursor-pointer whitespace-nowrap px-3 py-1 rounded-2xl border-solid border-2 ${
                i.read ? 'text-[#287ce6] border-blue-500' : 'text-gray-400'
              }`}
              style={{
                width: '310px',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              {i.read && <IoMdCheckmarkCircleOutline />}
              {i.title}
            </button>
          </Title>
        </Item>
      ))}
    </Root>
  );
};

export default LinedListWelcome;
