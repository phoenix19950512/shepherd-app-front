import userStore from '../state/userStore';
import theme from '../theme';
import Logo from './Logo';
import {
  Avatar,
  Box,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { getAuth, signOut } from 'firebase/auth';
import * as React from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

const Root = styled(Box)`
  height: 72px;
  width: 100%;
  border-bottom: 1px solid ${theme.colors.gray[200]};
  padding-inline: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

type Props = {
  showUserPill?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

const Header: React.FC<Props> = ({ left, right, showUserPill = true }) => {
  const { user, logoutUser } = userStore();
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSignOut = async () => {
    await signOut(auth).then(() => {
      logoutUser();
    });
  };

  const menuListBg = useColorModeValue('white', 'gray.900');
  const menuListBorderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Root as="header">
      <Logo onClick={() => navigate('/')} />

      <HStack flexGrow="1" justifyContent="space-between">
        <Box>{left}</Box>
        <Box>
          {right}
          {user && showUserPill && (
            <Menu>
              <MenuButton
                py={2}
                transition="all 0.3s"
                _focus={{ boxShadow: 'none' }}
                bg="#F4F5F5"
                borderRadius={'40px'}
                px={3}
              >
                <HStack>
                  <Avatar
                    size="sm"
                    color="white"
                    name={`${user.name?.first} ${user.name?.last}`}
                    bg="#4CAF50"
                  />
                  <Text
                    fontSize="0.875rem"
                    fontWeight={500}
                    color="text.200"
                  >{`${user.name?.first} ${user.name?.last}`}</Text>
                  <Box display={{ base: 'none', md: 'flex' }}>
                    <FiChevronDown />
                  </Box>
                </HStack>
              </MenuButton>
              <MenuList bg={menuListBg} borderColor={menuListBorderColor}>
                <MenuItem>Profile</MenuItem>
                <MenuDivider />
                <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
              </MenuList>
            </Menu>
          )}
        </Box>
      </HStack>
    </Root>
  );
};

export default Header;
