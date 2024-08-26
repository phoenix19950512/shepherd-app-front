import { CreatableSelect } from 'chakra-react-select';

type Props = React.ComponentProps<typeof CreatableSelect>;

const CreatableSelectComponent: React.FC<Props> = ({ ...rest }) => {
  return (
    <CreatableSelect
      chakraStyles={{
        option: (provided, { isSelected, isFocused }) => ({
          ...provided,
          color: '#585F68',
          fontWeight: '500',
          fontSize: '14px',
          ...((isSelected || isFocused) && {
            background: '#F2F4F7'
          })
        })
      }}
      {...rest}
    />
  );
};

export default CreatableSelectComponent;
