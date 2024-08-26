import styled from 'styled-components';

export const SidebarContainer = styled.div<{
  isOpen: boolean;
}>`
  position: fixed;
  top: 0;
  right: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
  height: 100vh;
  width: 392px;
  z-index: 1;
  background-color: #fff; /* Replace with your desired background color */
  transition: right 0.3s ease-in-out;
  box-shadow: 0px 8px 20px 0px #454b5433;
`;

export const SidebarContent = styled.div`
  padding: 1rem;
`;
