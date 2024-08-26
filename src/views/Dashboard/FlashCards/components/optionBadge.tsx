import { Box, Badge } from '@chakra-ui/react';
import React, { ReactNode, useMemo, useState } from 'react';

interface CustomBadgeProps {
  text: string;
  icon: (isActive: boolean) => ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const CustomBadge: React.FC<CustomBadgeProps> = ({
  text,
  icon,
  isActive,
  onClick
}) => {
  const [isHovored, setIsHovered] = useState(false);
  const hasBeenActivated = useMemo(
    () => [isActive, isHovored].some(Boolean),
    [isActive, isHovored]
  );
  return (
    <Badge
      as={Box}
      display="flex"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      alignItems="center"
      justifyContent="center"
      padding="10px 20px"
      borderRadius="100px"
      background={
        hasBeenActivated
          ? 'linear-gradient(0deg, #6E7682, #6E7682), linear-gradient(0deg, #EAEBEB, #EAEBEB)'
          : 'transparent'
      }
      border="1px solid #EAEBEB"
      cursor="pointer"
      onClick={onClick}
    >
      {icon(hasBeenActivated)}
      <Box
        marginLeft={'10px'}
        fontSize="14px"
        color={hasBeenActivated ? '#FFFFFF' : '#3B3F45'}
      >
        {text}
      </Box>
    </Badge>
  );
};

export default CustomBadge;
