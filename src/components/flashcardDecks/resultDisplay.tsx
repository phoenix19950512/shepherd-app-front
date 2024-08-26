import { Box, Text, BoxProps } from '@chakra-ui/react';

interface ResultDisplayProps {
  badgeText: string;
  score: number;
  badgeColor: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  badgeText,
  score,
  badgeColor
}) => {
  const badgeStyles: BoxProps = {
    width: '12px',
    height: '12px',
    borderRadius: '3px',
    background: badgeColor
  };

  const scoreStyles: BoxProps = {
    fontFamily: 'Inter',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: '17px'
  };

  return (
    <Box display="flex" alignItems="center">
      <Box sx={badgeStyles} mr={2} />
      <Text
        fontFamily="Inter"
        fontSize="12px"
        fontStyle="normal"
        fontWeight="400"
        lineHeight="17px"
        mr={2}
      >
        {badgeText}
      </Text>
      <Box flex="1" />
      <Text sx={scoreStyles}>{score}%</Text>
    </Box>
  );
};

export default ResultDisplay;
