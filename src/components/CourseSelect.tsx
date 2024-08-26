import theme from '../theme';
import { Course } from '../types';
import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import { includes, xor } from 'lodash';
import * as React from 'react';
import styled from 'styled-components';

const Root = styled(Box)`
  display: flex;
  gap: 15px;
  justify-content: center;
`;

const StyledOption = styled('button')`
  width: 100%;
  height: 172px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #f7f7f8;
  box-shadow: #e9eaec 0px 0px 0px 1px;
  border-radius: 6px;
  overflow: hidden;
  transition: all 0.2s ease-out;
  color: #585f68;

  &.something-else {
    background: #fff;
    color: #6e7682;
  }

  &:hover {
    box-shadow: ${theme.colors.primary[600]} 0px 0px 0px 1px;
    background: ${theme.colors.gray[50]};
  }

  &.active {
    box-shadow: ${theme.colors.primary[400]} 0px 0px 0px 1.8px,
      0px 6px 18px rgba(136, 139, 143, 0.18);

    svg {
      color: ${theme.colors.primary[500]};
    }
  }
`;

const StyledOptionTitle = styled(Text)`
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;
  letter-spacing: -0.003em;
  margin-bottom: 0;
  max-width: 135px;
`;

const StyledOptionIcon = styled.img`
  margin: 0 auto;
`;

type Option = Omit<Course, 'iconSrc'> & {
  value: any;
  iconSrc?: string | React.ReactNode;
};

type Props = {
  options: Option[];
  value: Option['value'][] | Option['value'];
  onChange: (value: Props['value']) => void;
  multi?: boolean;
};

export const CourseSelect: React.FC<Props> = ({
  value,
  options,
  multi = false,
  onChange
}: Props) => {
  const toggleArrayValue = (v: Option['value']) => {
    multi ? onChange(xor(value, [v])) : onChange(v);
  };

  return (
    <Root>
      <SimpleGrid width={'100%'} columns={{ base: 1, sm: 2 }} spacing="15px">
        {options.map((o) => (
          <StyledOption
            onClick={() => toggleArrayValue(o.value)}
            key={o.value}
            type="button"
            role="button"
            className={`${
              (multi ? includes(value, o.value) : value === o.value)
                ? 'active'
                : ''
            } ${o._id}`}
          >
            <Box>
              {!!o.iconSrc && (
                <Box marginBottom={'18px'}>
                  {typeof o.iconSrc === 'string' ? (
                    <StyledOptionIcon alt={o.label} src={o.iconSrc} />
                  ) : (
                    o.iconSrc
                  )}
                </Box>
              )}
              <StyledOptionTitle>{o.label}</StyledOptionTitle>
            </Box>
          </StyledOption>
        ))}
      </SimpleGrid>
    </Root>
  );
};

export default CourseSelect;
