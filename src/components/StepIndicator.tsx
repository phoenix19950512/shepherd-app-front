import React from 'react';
import styled from 'styled-components';

interface IStepContainerProps {
  width: string;
}

const StepContainer = styled.div<IStepContainerProps>`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  position: relative;
  :before {
    content: '';
    position: absolute;
    background: #dcdedf;
    height: 2px;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
  }
  :after {
    content: '';
    position: absolute;
    background: #207df7;
    height: 2px;
    width: ${({ width }) => width};
    top: 50%;
    transition: 0.4s ease;
    transform: translateY(-50%);
    left: 0;
  }
  @media only screen and (max-width: 992px) {
    padding: 0 20px;
  }
`;

const StepWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

interface IStepStyleProps {
  active: boolean;
}

const StepStyle = styled.div<IStepStyleProps>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 1.5px solid ${({ active }) => (active ? '#207DF7' : '#EFF0F0')};
  transition: 0.4s ease;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StepLabel = styled.span`
  position: absolute;
  font-size: 16px;
  text-align: start;
  left: -12px;
  top: 4px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  white-space: nowrap;
`;

const CheckMark = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #207df7;
  -ms-transform: scaleX(-1) rotate(-46deg);
  -webkit-transform: scaleX(-1) rotate(-46deg);
  transform: scaleX(-1) rotate(-46deg);
`;

const StepCount = styled.span<IStepStyleProps>`
  font-size: 18px;
  font-weight: 600;
  color: ${({ active }) => (active ? '#207DF7' : '#DCDEDF')};
`;

export interface Step {
  title: string;
}

interface StepsIndicatorProps {
  steps: Step[];
  activeStep: number;
}

const StepsLabelContainer = styled.div`
  position: absolute;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #585f68;
  transform: translate(-50%, -50%);
`;

const StepsIndicator: React.FC<StepsIndicatorProps> = ({
  steps,
  activeStep
}) => {
  const width = `${(100 / (steps.length - 1)) * activeStep}%`;
  return (
    <StepContainer width={width}>
      {steps.map((step, index) => (
        <StepWrapper key={index}>
          <StepStyle active={activeStep >= index}>
            {activeStep > index ? (
              <CheckMark>L</CheckMark>
            ) : (
              <StepCount active={activeStep >= index}>{index + 1}</StepCount>
            )}
          </StepStyle>
          <StepsLabelContainer>
            <StepLabel key={index}>{step.title}</StepLabel>
          </StepsLabelContainer>
        </StepWrapper>
      ))}
    </StepContainer>
  );
};

export default StepsIndicator;
