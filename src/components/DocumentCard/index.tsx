import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
  Box,
  Flex,
  Tag,
  Checkbox,
  IconButton,
  useDisclosure
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import ShareModalMenu from '../ShareModalMenu';

interface DocumentData {
  updatedAt: string;
  tags: string[];
  topic?: string;
  id?: string;
}

interface DocumentCardProps {
  data: DocumentData;
}

interface Option {
  key?: string;
  label: string;
  color?: string;
  onClick?: () => void;
  icon?: JSX.Element; // Optional icon element
}

interface DocumentCardProps {
  data: DocumentData;
  options: Option[];
  onClick?: () => void;
  onTagClick: (tag: string) => void;
  onSelect?: (checked: boolean) => void;
  isSelected?: boolean;
  footerColor?: string;
}

const MotionBox = motion(Box);

const DocumentCard: React.FC<DocumentCardProps> = ({
  data,
  options,
  onTagClick,
  onClick,
  onSelect,
  isSelected,
  footerColor
}) => {
  const { updatedAt, tags } = data;
  const { isOpen, onToggle } = useDisclosure();
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (initialLoad) {
      onToggle();
      setInitialLoad(false);
    }
  }, [initialLoad, onToggle]);

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <MotionBox
      w="auto"
      h="100%"
      bg="white"
      borderWidth="1px"
      display={'flex'}
      justifyContent="space-between"
      height="fit-content"
      flexDirection={'column'}
      borderRadius="8px"
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box cursor="pointer" onClick={handleCardClick}>
        <Box display="flex" flexDirection="column" p="18px">
          <Text
            height="30px"
            mt={2}
            w="80%"
            mb="0px"
            fontSize="md"
            fontWeight="bold"
            isTruncated
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {data.topic || 'No title available'}
          </Text>

          <Text color="#6E7682" fontSize={'14px'} mt={2}>
            Last updated: {new Date(updatedAt).toLocaleString() || 'Unknown'}
          </Text>
          <Flex minHeight="50px" wrap="wrap" my={4}>
            {tags &&
              tags.slice(0, 3).map((tag, index) => (
                <Tag
                  key={index}
                  height="fit-content"
                  p="8px 12px"
                  mr={'8px'}
                  borderRadius={'4px'}
                  fontSize="sm"
                  cursor="pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTagClick(tag);
                  }}
                >
                  {tag}
                </Tag>
              ))}
          </Flex>
        </Box>
      </Box>
      <Flex
        borderBottomEndRadius={'8px'}
        borderBottomLeftRadius={'8px'}
        bg={footerColor || '#F0F6FE'}
        w="full"
        p="10px 18px"
        h="fit-content"
        justifyContent="space-between"
      >
        <Checkbox
          isChecked={isSelected}
          iconColor="white"
          onChange={(e) => onSelect && onSelect(e.target.checked)}
        />
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="More options"
            icon={<FaEllipsisV fontSize={'12px'} />}
            size="sm"
            variant="ghost"
          />
          <MenuList fontSize="14px" minWidth={'185px'} borderRadius="8px">
            {options.map((option, index) => (
              <MenuItem
                key={index}
                p="6px 8px 6px 8px"
                color={option.color || '#212224'}
                _hover={{ bgColor: '#F2F4F7' }}
                onClick={() => option.onClick && option.onClick()}
              >
                {option.icon && <Box mr={2}>{option.icon}</Box>}
                <Text fontSize="14px" lineHeight="20px" fontWeight="400">
                  {option.label}
                </Text>
              </MenuItem>
            ))}
            {data.id && <ShareModalMenu type="note" id={data.id} />}
          </MenuList>
        </Menu>
      </Flex>
    </MotionBox>
  );
};

export default DocumentCard;
