import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text
} from '@chakra-ui/react';
import { LANGUAGE_VERSIONS } from '../../../../../util';

const languages = Object.entries(LANGUAGE_VERSIONS);
const ACTIVE_COLOR = 'blue.400';

const LanguageSelector = ({ language, onSelect }) => {
  return (
    <Box ml={2} mb={4}>
      <h4 className="font-medium text-sm mb-2">Language:</h4>
      <Menu isLazy>
        <MenuButton as={Button} variant="outline" size="sm">
          {language}
        </MenuButton>
        <MenuList>
          {languages.map(([lang, version]) => (
            <MenuItem
              key={lang}
              color={lang === language ? ACTIVE_COLOR : ''}
              bg={lang === language ? 'gray.200' : 'transparent'}
              _hover={{
                color: ACTIVE_COLOR,
                bg: 'gray.200'
              }}
              onClick={() => onSelect(lang)}
            >
              {lang}
              &nbsp;
              <Text as="span" color="gray.600" fontSize="sm">
                ({version})
              </Text>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};
export default LanguageSelector;
