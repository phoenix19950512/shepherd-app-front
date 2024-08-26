import React from 'react';
import styled, { keyframes } from 'styled-components';

const waveAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const ChatLoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-start;

  height: 50px;
`;

const DotContainer = styled.div`
  display: flex;
  align-self: flex-start;
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #cbd5e0;
  margin: 0 5px;
  animation: ${waveAnimation} 0.8s infinite;

  &:nth-child(1) {
    animation-delay: 0s;
  }

  &:nth-child(2) {
    animation-delay: 0.5s;
  }

  &:nth-child(3) {
    animation-delay: 1s;
  }
`;

const ChatLoader = ({ className }: { className?: string }) => {
  return (
    <ChatLoaderWrapper className={className}>
      <DotContainer>
        <Dot />
        <Dot />
        <Dot />
      </DotContainer>
    </ChatLoaderWrapper>
  );
};

export default ChatLoader;
