import Logo from '../components/Logo';
import WelcomeItem from '../components/WelcomeItem';
import theme from '../theme';
import { Box, Heading } from '@chakra-ui/react';
import { Outlet } from 'react-router';
import styled from 'styled-components';

const WelcomeColumn = styled.div`
  position: relative;
  z-index: 5;
  background: #f8f8f8;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  overflow: auto;
`;

const ContentColumn = styled.div`
  position: relative;
  z-index: 4;
  display: flex;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 992px) {
    width: 100%;
    padding: 20px;
  }
`;

const WelcomeHeading = styled(Heading)`
  margin-top: 87px;
  margin-left: 32px;
  margin-bottom: 50px;
`;

const WelcomeItemWrapper = styled(Box)`
  display: inline-block;
`;

const MarqueeWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: auto;
`;

const WelcomeItemRow = styled(Box)`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 24px;
  min-width: 100%;

  animation: scroll-x 20s linear infinite;

  &.reverse {
  }

  @keyframes scroll-x {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(calc(-100% - 24px));
    }
  }
`;

const Marquee = styled(Box)`
  display: flex;
  overflow: hidden;
  gap: 24px;

  &:hover {
    ${WelcomeItemRow} {
      animation-play-state: paused;
    }
  }
`;

const WelcomeItems = styled(Box)`
  overflow: hidden;
  mask-image: linear-gradient(
    to right,
    hsl(0 0% 0% / 0),
    hsl(0 0% 0% / 1) 20%,
    hsl(0 0% 0% / 1) 80%,
    hsl(0 0% 0% / 0)
  );

  ${WelcomeItemRow} {
    padding-bottom: 24px;
  }

  ${[1, 2, 3, 4, 5]
    .map((_, i) => {
      return `${MarqueeWrapper}:nth-of-type(${i}) {
        ${WelcomeItemRow} {
            animation-delay: ${-1 * i}s;
            animation-direction: ${i % 2 === 0 ? 'reverse' : 'normal'};
        }
    }`;
    })
    .join('')}
`;

const Root = styled.div`
  background: #fff;
  min-height: 100vh;
`;

const welcomeItems = [
  {
    title: 'Interactive learning',
    subtitle:
      'Shepherd provides you with numerous engaging features to make learning fun.',
    imageSource: '/images/welcome-interactive-learning.svg'
  },
  {
    title: 'Find the best tutors',
    subtitle:
      'Connect with top-rated tutors and get the support you need to achieve your goals.',
    imageSource: '/images/welcome-find-tutors.svg'
  },
  {
    title: 'Your personal AI assistant',
    subtitle:
      "With your personal AI assistant, you'll have access to a wealth of learning resources.",
    imageSource: '/images/welcome-ai-assistant.svg'
  },
  {
    title: 'Learning insights',
    subtitle:
      'Shepherd provides you with detailed analytics on your study sessions.',
    imageSource: '/images/welcome-learning-insights.svg'
  }
];

const WelcomeLayout = () => (
  <Root className="container-fluid">
    <Box className="min-h-screen flex flex-row">
      <WelcomeColumn className="hidden sm:block sm:w-2/5 p-0">
        <WelcomeHeading as="h1" className="text-3xl font-bold">
          Hi there, <span className="text-primary-400">Welcome!</span>
        </WelcomeHeading>
        <WelcomeItems>
          {[1, 2, 3, 4].map((v) => (
            <MarqueeWrapper key={v}>
              <Marquee>
                <WelcomeItemRow>
                  {welcomeItems.map((wi) => (
                    <WelcomeItemWrapper key={wi.title}>
                      <WelcomeItem {...wi} />
                    </WelcomeItemWrapper>
                  ))}
                </WelcomeItemRow>

                <WelcomeItemRow aria-hidden={true}>
                  {welcomeItems.map((wi) => (
                    <WelcomeItemWrapper key={wi.title}>
                      <WelcomeItem {...wi} />
                    </WelcomeItemWrapper>
                  ))}
                </WelcomeItemRow>
              </Marquee>
            </MarqueeWrapper>
          ))}
        </WelcomeItems>
      </WelcomeColumn>
      <ContentColumn className="sm:w-3/5 sm:ml-auto py-5">
        <Box className="max-w-md w-full">
          <Box className="flex mb-12 justify-center">
            <Logo className="h-24 w-50 mx-auto" noFixedWidth />
          </Box>
          <Outlet />
        </Box>
      </ContentColumn>
    </Box>
  </Root>
);

export default WelcomeLayout;
