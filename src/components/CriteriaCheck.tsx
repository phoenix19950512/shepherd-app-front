import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

type Props = React.ComponentProps<typeof Flex> & {
  text: string;
  checked?: boolean;
};

const CriteriaCheck: React.FC<Props> = ({ text, checked = false, ...rest }) => {
  return (
    <Flex gap={7.67} {...rest}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.99984 17.3333C4.39746 17.3333 0.666504 13.6023 0.666504 8.99996C0.666504 4.39758 4.39746 0.666626 8.99984 0.666626C13.6022 0.666626 17.3332 4.39758 17.3332 8.99996C17.3332 13.6023 13.6022 17.3333 8.99984 17.3333ZM8.16867 12.3333L14.0613 6.44073L12.8828 5.26223L8.16867 9.97629L5.81168 7.61921L4.63316 8.79779L8.16867 12.3333Z"
          fill={checked ? '#4CAF50' : '#CDD1D5'}
        />
      </svg>
      <Text m={0} className="body3" color={'#6E7682'}>
        {text}
      </Text>
    </Flex>
  );
};

export default CriteriaCheck;
