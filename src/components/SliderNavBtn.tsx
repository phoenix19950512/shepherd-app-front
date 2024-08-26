import theme from '../theme';
import styled from 'styled-components';

const SliderNavBtn = styled('button')`
  border-radius: 100%;
  height: 30px;
  width: 30px;
  color: ${theme.colors.gray[600]};
  justify-content: center;
  display: flex;
  align-items: center;
  position: absolute;
  top: 25px;
  font-size: 20px;
  background: transparent;
  border-bottom: 4px solid transparent;

  &:before {
    content: '';
    inset: 0px;
    position: absolute;
    z-index: 1;
    border-radius: 100%;
    background: #f5f5f5;
    box-shadow: ${theme.colors.gray[200]} 0px -4px 0px 0px inset;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 30px;
    height: 30px;
    display: block;
  }

  &:active {
    box-shadow: none;
    padding-bottom: 0;
    transform: translateY(4px) translateZ(0);
    &:before {
      box-shadow: none;
    }
  }

  * {
    z-index: 1;
  }

  &.left {
    left: 16px;
  }
  &.right {
    right: 16px;
  }
`;

export default SliderNavBtn;
