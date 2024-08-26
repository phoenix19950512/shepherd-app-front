import { StyledTag, StyledTagLabel } from './styles';
import { CloseIcon } from '@chakra-ui/icons';
import { TagLabel, TagLeftIcon } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

interface TagProps {
  label: string;
  icon?: boolean;
  onClick?: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
  showClose?: boolean;
}
const TableTag: FC<TagProps> = (props) => {
  const { label, onClick, icon = true, showClose = false } = props;

  const Icon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        width="24px"
        height="24px"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 6h.008v.008H6V6z"
        />
      </svg>
    );
  };

  return (
    <StyledTag onClick={onClick}>
      {/* {icon && <TagLeftIcon>{icon}</TagLeftIcon>} */}
      <TagLeftIcon>{icon && <Icon />}</TagLeftIcon>
      <StyledTagLabel>{label}</StyledTagLabel>
      {showClose && <CloseIcon mx={2} w={'8px'} h={'8px'} />}
    </StyledTag>
  );
};

export default TableTag;
