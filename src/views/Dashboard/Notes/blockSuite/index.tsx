import { useEffect, useRef, useState } from 'react';

import { EditorProvider } from './components/EditorProvider';
import EditorContainer from './components/EditorContainer';
import AIInputComponent from './aipanel/ai-input';
import AILoadingComponent from './aipanel/ai-generating';
import AIAnswerComponent from './aipanel/ai-answer';

import './index.css';
import './aipanel/styles.scss';

const BlockSuite = (setDoc: any) => {
  const [state, setState] = useState('init');
  /* const [aiResult, setAIResult] = useState(`
\\[ \\frac{\\partial u}{\\partial t} + u \\frac{\\partial u}{\\partial x} = -\\frac{1}{\\rho} \\frac{\\partial p}{\\partial x} + g_x \\]
- \\( u \\): Velocity of the fluid along the streamline (in the x-direction).
  `); */
  const [aiResult, setAIResult] = useState('')
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState(null);
  const [history, setHistory] = useState([]);
  // const [position, setPosition] = useState({ width: 500, left: 200, top: 300 });
  const [position, setPosition] = useState({ width: 0, left: 0, top: 0 });
  const abortControllerRef = useRef(null);

  const askAI = (ele) => {
    const container = ele.querySelector('.affine-block-children-container');
    const left = container.offsetLeft;
    const top = container.offsetTop + container.offsetHeight + 160;
    const width = container.offsetWidth;
    return { left, top, width };
  };

  return (
    <div>
      <EditorProvider>
        <div className="">
          <div className="main-content">
            <EditorContainer
              setState={setState}
              state={state}
              askAI={askAI}
              setPosition={setPosition}
              setModel={setModel}
            />
          </div>
        </div>
      </EditorProvider>
      <div className="ai-panel" style={position}>
        {state == 'input' && (
          <AIInputComponent
            setState={setState}
            history={history}
            setAIResult={setAIResult}
            prompt={prompt}
            setPrompt={setPrompt}
            abortControllerRef={abortControllerRef}
          />
        )}
        {state == 'generating' && (
          <AILoadingComponent
            setState={setState}
            abortControllerRef={abortControllerRef}
            aiResult={aiResult}
          />
        )}
        {state == 'result' && (
          <AIAnswerComponent
            history={history}
            setHistory={setHistory}
            aiResult={aiResult}
            setState={setState}
            prompt={prompt}
            setPrompt={setPrompt}
            setAIResult={setAIResult}
            abortControllerRef={abortControllerRef}
            model={model}
          />
        )}
      </div>
    </div>
  );
};

export default BlockSuite;
