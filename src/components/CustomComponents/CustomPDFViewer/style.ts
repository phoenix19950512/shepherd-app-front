import theme from '../../../theme/';
import styled from 'styled-components';

export const NotePDFWrapper = styled.section<{
  position?: string;
  width?: string;
  height?: string;
  background?: string;
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  zIndex?: number;
}>`
  padding: 0;
  position: ${(props) => props.position ?? 'relative'};
  width: ${(props) => props.width ?? '210mm'};
  margin: 0 auto;
  height: ${(props) => props.height ?? '297mm'};
  top: ${(props) => props.top ?? undefined};
  right: ${(props) => props.right ?? undefined};
  bottom: ${(props) => props.bottom ?? undefined};
  left: ${(props) => props.left ?? undefined};
  z-index: ${(props) => props.zIndex ?? undefined};
  background-color: ${(props) => props.background ?? theme?.color?.background};
`;
