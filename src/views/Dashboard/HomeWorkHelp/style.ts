import { SimpleGrid } from '@chakra-ui/react';
import styled from 'styled-components';

export const HomeWorkHelpContainer = styled.section`
  display: flex;
  height: 100%;
  // position: fixed;
  overflow: hidden;
  width: 100%;
  max-height: calc(100vh - 80px);
`;

export const HomeWorkHelpHistoryContainer = styled.section`
  width: 70%;
  height: 100vh;
  background: rgb(255, 255, 255);
  overflow-y: scroll;
  margin: 0px 10px;
  left: 15px;
  display: block;

  /* Hide scrollbar for Chrome, Safari, and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;

  /* Hide scrollbar for IE, Edge, and other browsers */
  -ms-overflow-style: none;

  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

export const MobileHomeWorkHelpHistoryContainer = styled.section`
  // width: 29%;
  // height: 100vh;
  // padding-right: 10px;
  // background: #fff;
  // overflow-y: scroll;
  width: 100%;
  height: 100vh;
  background: rgb(255, 255, 255);
  overflow-y: scroll;
  margin: 0px 10px;
  // position: absolute;
  left: 15px;
  display: block;

  /* Hide scrollbar for Chrome, Safari and Opera */
  ::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
  -ms-overflow-style: none; /* IE and Edge */

  @media only screen and (max-width: 768px) {
    display: block;
  }
`;

export const HomeWorkHelpChatContainer = styled.section`
  // flex-grow: 1;
  // width: 100%;
  // position: fixed;
  border-left: 1px solid rgb(249, 249, 251);

  @media only screen and (max-width: 768px) {
    position: absolute;
  }
`;

export const TutorsBackIcn = styled.div`
  border-bottom: 1px solid #eeeff2;
  width: 100%;
  padding: 12px 30px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

export const ViewTutorSection = styled.div`
  width: 100%;
  height: 100%;
`;

export const PreviouslyText = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: #212224;
  padding: 22px 120px;

  @media only screen and (max-width: 768px) {
    padding: 22px 30px;
  }
`;
export const DiscoverMore = styled.p`
  color: #207df7;
  padding: 42px 120px;
  font-weight: 500;
  cursor: pointer;

  @media only screen and (max-width: 768px) {
    padding: 42px 30px;
  }
`;

export const SimpleGridContainer = styled(SimpleGrid)`
  padding: 0 120px;

  @media only screen and (max-width: 768px) {
    padding: 0 26px;
  }
`;
