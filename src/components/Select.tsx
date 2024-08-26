import { Checkbox, Flex } from '@chakra-ui/react';
import { GroupBase, Select, SelectInstance } from 'chakra-react-select';
import React, { Ref } from 'react';
import styled from 'styled-components';

export interface Option {
  value: string;
  label: string;
}

type Props = React.ComponentProps<typeof Select>;

const StyledCheckbox = styled(Checkbox)`
  display: none;

  pointer-events: none;
  [data-invalid] {
    border-color: inherit !important;
  }
`;

const StyledSelect = styled(Select)`
  [role='button'] {
    ${StyledCheckbox} {
      display: flex;
    }
  }
`;
const SelectComponent: React.FC<Props> = ({ options, ref, ...rest }) => {
  return (
    <StyledSelect
      options={(options as Option[]).map((o) => {
        if (rest.isMulti) {
          const isSelected = !![
            ...((rest.defaultValue || rest.value) as Option[])
          ].find((v) => v.value === o.value);
          return {
            ...o,
            label: (
              <Flex gap="5px">
                <StyledCheckbox readOnly isChecked={isSelected} />
                {o.label}
              </Flex>
            )
          };
        }

        return o;
      })}
      closeMenuOnSelect={!rest.isMulti}
      hideSelectedOptions={false}
      chakraStyles={{
        menu: () => ({
          zIndex: 1,
          maxHeight: '300px',
          position: 'absolute',
          left: 0,
          right: 0
        }),
        option: (provided, { isSelected, isFocused }) => ({
          ...provided,
          color: '#585F68',
          fontWeight: '500',
          fontSize: '12px',
          ...((isSelected || isFocused) && {
            fontSize: '14px',
            background: '#F2F4F7'
          })
        }),
        control: (provided) => ({
          ...provided,
          fontSize: '0.875rem' // Set font size for the input/control part
        })
      }}
      {...rest}
      ref={
        ref as unknown as Ref<
          SelectInstance<unknown, boolean, GroupBase<unknown>>
        >
      }
    />
  );
};

export default SelectComponent;
