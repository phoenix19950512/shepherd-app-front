import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import styled from 'styled-components';

type Props = {
  title: string;
  subtitle: string;
  imageSource: string;
};

const Content = styled(Box)`
  display: flex;
`;

const ImageContainer = styled(Box)`
  width: 60px;
  height: 60px;
  background: #e3e8ff;
  border: 3.5px solid #ffffff;
  box-shadow: 1px 4px 16px rgba(98, 101, 106, 0.2);
  border-radius: 6px;
  margin-right: 15px;
  position: relative;
  flex-shrink: 0;

  img {
    position: absolute;
    z-index: 3;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
  }

  &:before {
    content: '';
    position: absolute;
    height: 33px;
    left: 0;
    right: 0;
    border-top: 1px solid #dbe2ff;
    border-bottom: 1px solid #dbe2ff;
    top: 50%;
    transform: translateY(-50%);
  }

  &:after {
    content: '';
    position: absolute;
    width: 36px;
    top: 0;
    bottom: 0;
    border-left: 1px solid #dbe2ff;
    border-right: 1px solid #dbe2ff;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Meta = styled(Box)``;

const Title = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #212224;
  margin-bottom: 4px;
`;

const Subtitle = styled(Text)`
  font-weight: 400;
  font-size: 12px;
  line-height: 19px;
  letter-spacing: -0.003em;
  color: #6e7682;
  margin-bottom: 0;
`;

const Root = styled(Box)`
  height: 100px;
  width: 366px;
  background: #ffffff;
  border: 1px solid #f4f5f5;
  box-shadow: 0px 6px 16px rgba(102, 92, 112, 0.08),
    0px 0px 0px rgba(102, 92, 112, 0.05);
  border-radius: 10px;
  padding: 20px;
`;

const WelcomeItem: React.FC<Props> = ({ title, subtitle, imageSource }) => {
  return (
    <Root>
      <Content>
        <ImageContainer>
          <img src={imageSource} alt={title} />
        </ImageContainer>
        <Meta>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </Meta>
      </Content>
    </Root>
  );
};

export default WelcomeItem;
