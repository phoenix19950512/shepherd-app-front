import { AIStarIconWithAnimation, AIStopIcon } from '@blocksuite/blocks';
import MathMarkdown from './mathmarkdown';

const AILoadingComponent = ({ setState, abortControllerRef, aiResult }) => {
  const handleClick = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState('result');
  };
  return (
    <div className="ai-panel-container">
      <div className="answer">
        <MathMarkdown content={aiResult} />
      </div>
      <div className="ai-panel-container" style={{ flexDirection: 'row' }}>
        <div
          className="icon"
          dangerouslySetInnerHTML={{
            __html: AIStarIconWithAnimation.strings[0]
          }}
        />
        <div className="textarea-container">
          <textarea
            rows={1}
            className="textarea readonly"
            readOnly={true}
            defaultValue="AI is generating..."
          />
          <div className="stop" onClick={handleClick}>
            <span
              className="stop-icon"
              dangerouslySetInnerHTML={{ __html: AIStopIcon.strings[0] }}
            />
            <span className="esc-label">ESC</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AILoadingComponent;
