import { Box } from '@chakra-ui/react';
import Editor from '../../../../components/Editor';
import theme from '../../../../theme/';
import styled from 'styled-components';
import tw from 'twin.macro';

export const NewNoteWrapper = styled.section<{
  position?: string;
  width?: string;
  height?: string;
  minHeight?: string;
  background?: string;
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  zIndex?: number;
  overflow: string;
  overflowY: string;
  overflowZ: string;
}>`
  padding: 0;
  position: ${(props) => props.position ?? 'relative'};
  /* width: ${(props) => props.width ?? '210mm'}; */
  width: ${(props) => props.width ?? '250mm'};
  margin: 0 auto;
  height: ${(props) => props.height ?? '297mm'};
  min-height: ${(props) => props.minHeight ?? '100vh'};
  top: ${(props) => props.top ?? undefined};
  right: ${(props) => props.right ?? undefined};
  bottom: ${(props) => props.bottom ?? undefined};
  left: ${(props) => props.left ?? undefined};
  z-index: ${(props) => props.zIndex ?? undefined};
  background-color: ${(props) => props.background ?? theme?.color?.background};
  overflow: ${(props) => props.overflow ?? undefined};
  overflow-y: ${(props) => props.overflowY ?? undefined};
  overflow-x: ${(props) => props.overflowZ ?? undefined};
`;
export const FullScreenNoteWrapper = styled.div`
  width: 70% !important;
  margin: 0 auto;
  position: relative;
`;

export const PDFWrapper = styled.div`
  display: flex;
  width: '100%';
  flex-direction: column;
  height: '100%';
  align-items: flex-start;
  justify-content: center;
`;

export const Header = styled(Box)`
  && {
  }
`;

export const FirstSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px;
  .back-btn {
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.25rem;
    color: #585f68;
    margin-left: -0.5em;
    cursor: pointer;
  }
  .zoom__icn {
    border-right: 1px solid #e0e1e1;
    padding-right: 20px;
    cursor: pointer;
  }

  .doc__name {
    ${tw`w-full min-w-[120px] max-w-[150px] md:max-w-[300px] cursor-text text-[#525456] flex text-[11pt] max-h-[30px] border-r border-[#e0e1e1] pr-[10px]`};
    > input {
      width: inherit;
      height: 'inherit';
      margin: 0;
      padding: 0;
      border-style: flat !important;
      font-size: 11pt;
      color: #525456;
      background: #fafafa !important;
      ${tw`min-w-[200px] md:max-w-[300px]`}
    }
  }

  .doc__name:hover {
    > div {
      border: 1px solid #e0e1e1;
    }
  }

  .timestamp {
    color: #9a9c9e;
    font-size: 0.875rem;
    cursor: default;
  }
`;

export const SecondSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px;

  .pin__icn {
    border-right: 1px solid #e0e1e1;
    padding-right: 20px;
    cursor: pointer;
  }
  .pin-icon {
    cursor: pointer;
    font-size: 1.5em;
  }

  .pin-icon.pinned {
    color: rgb(32, 125, 247);
  }

  .pin-icon.not-pinned {
    color: grey;
  }
`;

export const NoteBody = styled(Box)`
  && {
  }
`;

export const DropDownLists = styled.div`
  display: flex;
  align-items: center;
  padding: 4px;
  font-size: 0.875rem;

  :hover {
    background: #f2f4f8;
    border-radius: 6px;
    cursor: pointer;
  }

  &:nth-child(5) {
    border-bottom: 1px solid #e8e8e9;
  }
`;

export const DropDownFirstPart = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  gap: 6px;
  justify-content: space-between;
  width: 100%;

  > div {
    display: flex;
    align-items: center;

    &p:nth-child(last) {
      color: #f53535;
    }
  }
`;

export const DropDownDelete = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const HeaderButton = styled.div`
  && {
  }
`;

export const HeaderWrapper = styled(Box)`
  && {
    position: sticky;
    top: 0;
    z-index: 2;
  }
`;

export const HeaderTagsWrapper = styled.div`
  width: 85%;
`;

export const HeaderButtonText = styled.p`
  && {
  }
`;

// export const StyledEditor = styled(Editor)`
//   && {
//     .toolbar {
//       ${tw`z-1`}
//     }
//   }
// `;

export const StyledEditor = styled(Editor)`
  && {
    ${tw`mt-2 relative w-[90vw]`};

    .toolbar {
      ${tw`z-1 rounded-tl-none rounded-tr-none static border-b border-gray-200 shadow-xl`};
    }

    .editor-container {
      ${tw`rounded-none max-h-[calc(100dvh-12.5rem)] p-4 md:p-0 overflow-y-auto`};
      ::-webkit-scrollbar {
        width: 0px;
      }

      ::-webkit-scrollbar-track {
        background: transparent;
      }

      ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 3px;
      }
      .editor {
        ${tw`max-h-[68vh] md:max-h-[80vh] overflow-auto`};
        ::-webkit-scrollbar {
          width: 0px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
      }
    }
  }
`;

export const StyledNoteWrapper = styled(Box)`
  && {
    ${tw``}
  }
`;

export const StyledNoteContainer = styled(Box)`
  && {
    ${tw``}
  }
`;

export const StyledNoteContent = styled(Box)`
  && {
    ${tw``}
  }
`;

export const StyledToolbar = styled.div`
  margin-top: 30px;
  margin-left: 100px;
  display: flex;

  .status {
    margin: auto;
    margin-left: 20px;
    font-size: 14px;
    user-select: none;
    display: flex;
  }

  .saveBtn, .downloadBtn {
    background-color: rgb(73, 81, 255);
    color: #fff;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 6px;
    transition: 0.3s;
    display: flex;

    &:hover,
    &:focus,
    &:active {
      background-color: rgb(36, 44, 255);
    }
    .icon {
      margin-top: 3px;
      margin-right: 5px;
    }
  }
  .downloadBtn {
    background-color: rgb(0, 161, 77);
    margin-left: 1rem;

    &:hover,
    &:focus,
    &:active {
      background-color: rgb(5, 137, 68);
    }
  }
`;
