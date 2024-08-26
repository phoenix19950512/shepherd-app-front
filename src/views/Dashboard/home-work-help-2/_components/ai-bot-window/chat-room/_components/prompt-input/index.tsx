import { RightArrowIcon } from '../../../../../../../../components/icons';
import FindATutorButton from '../find-a-tutor';
import { useRef, useState } from 'react';
import useDynamicTextareaSize from './hook/useDynamicTextArea';
import { cn } from '../../../../../../../../library/utils';
import { PauseIcon } from '@radix-ui/react-icons';
import { Tooltip } from '@chakra-ui/react';
const PromptInput = ({
  onSubmit,
  conversationId,
  disabled,
  onClick,
  streaming
}: {
  onSubmit: (message) => void;
  conversationId: string;
  disabled?: boolean;
  onClick?: () => void;
  streaming: boolean;
}) => {
  const inputRef = useRef();
  const [message, setMessage] = useState('');
  useDynamicTextareaSize(inputRef, message);
  const handleSendMessage = () => {
    if (message.trim() === '') return;
    onSubmit(message);
    setMessage('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full h-full flex gap-5 flex-col items-center justify-center max-w-[600px] z-10">
      <div className="find-tutor-button flex justify-end w-full">
        <FindATutorButton conversationId={conversationId} disabled={disabled} />
      </div>
      {!streaming ? (
        <div
          className="input-box flex gap-2 flex-row items-center bg-white rounded-md shadow-element w-full px-4 py-2.5"
          onClick={() => {
            if (onClick) onClick();
          }}
        >
          <div className="input-element w-full flex-1 flex">
            <textarea
              ref={inputRef}
              className={cn(
                'w-full input flex-1 border-none bg-transparent outline-none active:outline-none active:ring-0 border-transparent focus:border-transparent focus:ring-0 placeholder:text-[#CDD1D5] placeholder:font-normal text-[#6E7682] font-normal p-0 resize-none',
                {
                  'pointer-events-none': disabled
                }
              )}
              placeholder="Ask a question?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ whiteSpace: 'pre-line' }}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={disabled}
            />
          </div>
          <div className="submit-button">
            <button
              className="w-[28px] h-[28px] rounded-full bg-[#207DF7] flex items-center justify-center"
              onClick={handleSendMessage}
              disabled={disabled || streaming}
            >
              {!streaming ? <RightArrowIcon /> : <PauseIcon />}
            </button>
          </div>
          {/* <div className="file-uploader-submit-section flex-1 flex justify-between px-2">
          <div className="file-uploader flex gap-[1px] mb-1">
            <button className="flex items-center justify-center w-[28px] h-[28px] rounded-tl-md rounded-bl-md bg-[#F9F9FB]">
              <ShareIcon />
            </button>
            <span className="text-[#969CA6] bg-[#F9F9FB] font-normal h-[28px] text-[10px] flex items-center px-2">
              <span>File.txt</span>
            </span>
          </div>
        </div> */}
        </div>
      ) : (
        <Tooltip label="Shepherd is thinking..." placement="top">
          <div
            className="input-box flex gap-2 flex-row items-center bg-white rounded-md shadow-element w-full px-4 py-2.5"
            onClick={() => {
              if (onClick) onClick();
            }}
          >
            <div className="input-element w-full flex-1 flex">
              <textarea
                ref={inputRef}
                className={cn(
                  'w-full input flex-1 border-none bg-transparent outline-none active:outline-none active:ring-0 border-transparent focus:border-transparent focus:ring-0 placeholder:text-[#CDD1D5] placeholder:font-normal text-[#6E7682] font-normal p-0 resize-none',
                  {
                    'pointer-events-none': disabled
                  },
                  {
                    'cursor-not-allowed': streaming
                  }
                )}
                placeholder="Ask a question?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ whiteSpace: 'pre-line' }}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={disabled || streaming}
              />
            </div>
            <div className="submit-button">
              <button
                className="w-[28px] h-[28px] rounded-full bg-[#207DF7] flex items-center justify-center"
                onClick={handleSendMessage}
                disabled={disabled || streaming}
              >
                {!streaming ? <RightArrowIcon /> : <PauseIcon />}
              </button>
            </div>
            {/* <div className="file-uploader-submit-section flex-1 flex justify-between px-2">
          <div className="file-uploader flex gap-[1px] mb-1">
            <button className="flex items-center justify-center w-[28px] h-[28px] rounded-tl-md rounded-bl-md bg-[#F9F9FB]">
              <ShareIcon />
            </button>
            <span className="text-[#969CA6] bg-[#F9F9FB] font-normal h-[28px] text-[10px] flex items-center px-2">
              <span>File.txt</span>
            </span>
          </div>
        </div> */}
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default PromptInput;
