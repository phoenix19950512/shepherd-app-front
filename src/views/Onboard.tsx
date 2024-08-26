import Header from '../components/Header';
import { Box } from '@chakra-ui/react';
import React from 'react';
import { Outlet } from 'react-router';
import styled from 'styled-components';

const Root = styled(Box)`
  margin: 30px auto 30px auto;
  max-width: 500px;
  width: 100%;
  padding-inline: 16px;
`;

const Onboard = () => {
  return (
    <>
      <Header />
      <Root>
        <Outlet />
      </Root>
    </>
  );
};

export default Onboard;
