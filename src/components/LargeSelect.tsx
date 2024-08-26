import theme from '../theme';
import { Box, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import * as React from 'react';
import styled from 'styled-components';

const Title = styled(Text)`
  font-weight: bolder;
  font-size: 1.2rem;
  line-height: 21px;
  letter-spacing: -0.003em;
  margin-bottom: 0;
  text-align: left;
`;

const Subtitle = styled(Text)`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #6e7682;
  text-align: left;
  margin-top: 6px;
  margin-bottom: 0;
`;

const Root = styled(Box)`
  justify-content: center;
`;

const IconParent = styled(Box)`
  svg {
    fill: #6e7682;
  }
`;

const StyledOption = styled('button')`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 6px;
  background: ${(props) => (props.title === 'Student' ? '#f2d5c9' : '#abcbfb')};
  transition: transform 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
  transform: translateY(0);

  box-shadow: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  height: 50px;
  width: 60%;
  box-sizing: border-box;
  color: black;
  &:hover {
    background: ${(props) =>
      props.title === 'Student' ? '#fca06d' : '#207df7'};
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.4);
    transform: translateY(-2px) scale(1.05);
  }
  &.active {
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.4),
      0px 6px 18px rgba(136, 139, 143, 0.18);

    ${IconParent} {
      svg {
        fill: #212224;
      }
    }
  }

  &.slide-in {
    transform: translateY(0);
  }

  // Add delay to each button
  &:nth-child(1) {
    transition-delay: 0.1s;
  }
  &:nth-child(2) {
    transition-delay: 0.2s;
  }
  &:nth-child(3) {
    transition-delay: 0.3s;
  }
  // Add more nth-child rules for additional buttons
`;

const Radio = styled.input`
  transform: scale(1.3);
  position: absolute;
  top: 10px;
  right: 10px;
`;

type Option = {
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  icon?: React.ReactNode;
  value: any;
};

type Props = {
  options: Option[];
  value: Option['value'];
  onChange: (value: Props['value']) => void;
  optionProps?: React.ComponentProps<typeof StyledOption>;
  showRadio?: boolean;
};

export const LargeSelect: React.FC<Props> = ({
  value,
  options,
  onChange,
  optionProps = {},
  showRadio = false
}) => {
  return (
    <Root>
      <VStack>
        {options.map((o) => (
          <StyledOption
            {...optionProps}
            onClick={() => onChange(o.value)}
            key={o.value}
            type="button"
            role="button"
            className={value === o.value ? 'active' : ''}
            title={o.title} // Pass the title as a prop
          >
            {/* {!!o.icon && (
              <IconParent
                marginBottom={'25.67px'}
                display="flex"
                alignItems="center"
              >
                {o.icon}
              </IconParent>
            )} */}
            {typeof o.title === 'string' ? (
              <Title color={o.title === 'Student' ? '#207df7' : '#fff'}>
                {`${o.title} sign-up`}
              </Title>
            ) : (
              o.title
            )}
            {/* <Box display="flex" alignItems={'flex-start'} flexShrink={0}>
              {typeof o.subtitle === 'string' ? (
                <Subtitle>{o.subtitle}</Subtitle>
              ) : (
                o.subtitle
              )}
            </Box> */}
            {showRadio && (
              <Radio
                readOnly
                type="radio"
                checked={o.value === value}
                tabIndex={-1}
              />
            )}
          </StyledOption>
        ))}
      </VStack>
    </Root>
  );
};

export default LargeSelect;
