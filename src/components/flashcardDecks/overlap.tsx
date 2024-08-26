import { Box, BoxProps } from '@chakra-ui/react';

interface CardProps extends BoxProps {
  top: string;
  left: string;
  width: string;
  height: string;
  boxShadow: string;
  backgroundColor: string;
}

const DeckOverLap: React.FC<CardProps> = ({
  top,
  left,
  width,
  height,
  boxShadow,
  backgroundColor,
  children
}) => {
  return (
    <Box
      position="absolute"
      top={top}
      left={left}
      transform="translateX(-50%)"
      borderRadius="5xs"
      backgroundColor={backgroundColor}
      boxShadow={boxShadow}
      width={width}
      height={height}
      overflow="hidden"
    >
      {children}
    </Box>
  );
};
export default DeckOverLap;
