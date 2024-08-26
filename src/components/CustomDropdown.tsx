import { Box, Icon, Text } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
import { HiChevronDown } from 'react-icons/hi';

interface CustomDropdownProps {
  value?: string;
  placeholder?: string;
  children: React.ReactNode;
  useDefaultWidth?: boolean;
  disabled?: boolean;
  automaticClose?: boolean;
  className?: any;
}

function CustomDropdown({
  value,
  placeholder,
  children,
  useDefaultWidth,
  disabled,
  automaticClose,
  className
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleToggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    if (automaticClose && isOpen) {
      setIsOpen(false);
    }
  }, [automaticClose, isOpen]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Box ref={dropdownRef} position="relative">
      <Box
        onClick={handleToggleDropdown}
        display="flex"
        alignItems="center"
        cursor={disabled ? 'not-allowed' : 'pointer'}
        borderWidth={1}
        fontSize={'14px'}
        borderRadius="md"
        p={2}
        _hover={!disabled ? { borderColor: '#9a9da2' } : undefined}
        opacity={disabled ? 0.6 : 1}
        pointerEvents={disabled ? 'none' : undefined}
      >
        {value ? (
          <Text marginBottom={0} flex={1}>
            {value}
          </Text>
        ) : (
          <Text marginBottom={0} color="#9A9DA2" flex={1}>
            {placeholder}
          </Text>
        )}
        <Icon as={HiChevronDown} />
      </Box>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            className={className}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              zIndex: 20,
              marginTop: 2,
              padding: 2,
              borderWidth: 1,
              borderRadius: 'md',
              background: 'white',
              width: useDefaultWidth ? dropdownRef.current?.clientWidth : 'auto'
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default CustomDropdown;
