import styled from 'styled-components';

export const StyledButton = styled.button<{
  isCancel?: boolean;
  isDelete?: boolean;
  active?: boolean;
  disabled?: boolean;
}>`
  background: ${({ isCancel, isDelete, active = true }) =>
    !active
      ? 'grey'
      : isCancel
      ? '#FFFFFF'
      : isDelete
      ? '#F53535'
      : 'rgb(32, 125, 247)'};

  color: ${({ isCancel, isDelete }) =>
    isCancel ? '##5C5F64' : isDelete ? '#FFFFFF' : '#FFFFFF'};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : '')};

  border: ${({ isCancel }) => (isCancel ? '1px solid #E7E8E9' : 'none')};
  font-weight: 600;
  font-size: 0.875rem;
  padding: 8px 12px;
  border-radius: 6px;
  outline: none;
  appearance: none;
  display: flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  -webkit-box-shadow: ${({ isCancel }) =>
    isCancel ? '0 1px 2px 0 rgb(0 0 0 / 0.05);' : 'none'};
`;
