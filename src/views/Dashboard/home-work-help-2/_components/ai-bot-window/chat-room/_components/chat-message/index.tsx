import { Avatar } from '@chakra-ui/avatar';
import CustomMarkdownView from '../../../../../../../../components/CustomComponents/CustomMarkdownView';
import { cn } from '../../../../../../../../library/utils';

const ChatMessage = ({
  suggestionPromptsVisible, // When it is true, it shows the suggestion prompts i.e 'I don't understand' and 'Teach me more!'
  message,
  type,
  userName,
  userImage,
  streaming,
  id,
  sendSuggestedPrompt // This function is called when the user clicks on the suggestion prompts
}: {
  suggestionPromptsVisible?: boolean;
  streaming?: boolean;
  message: string;
  type: 'user' | 'bot';
  userName?: string;
  userImage?: string;
  sendSuggestedPrompt?: (message: string) => void;
  id?: string;
}) => {
  return (
    <div
      className={`flex gap-3 relative ${
        type === 'user' ? 'flex-row-reverse' : 'flex-row'
      }`}
      id={id}
    >
      <Avatar
        style={{
          width: '36px',
          height: '36px'
        }}
        name={type === 'user' ? userName : 'Socrates'}
        src={type === 'user' ? userImage : ''}
        bgColor={type === 'user' ? '#4CAF50;' : '#fff'}
        color={type === 'user' ? '#fff' : 'blue.500'}
        shadow={'md'}
      />
      <div
        className={cn(
          'message shadow-element rounded-md flex justify-center items-center relative',
          {
            'bg-[#F9FBFF]': type === 'user',
            'bg-[#ffffff]': type === 'bot',
            'text-[#072D5F]': type === 'user'
          }
        )}
      >
        <CustomMarkdownView
          source={message}
          showDot={type === 'bot' && streaming}
          className="text-sm w-full py-2 px-4 font-normal"
        />
        {type === 'bot' && suggestionPromptsVisible && (
          <div className="question-suggestions absolute bottom-[-3.5rem] w-full flex gap-2">
            <div
              role="button"
              className="question-suggestion p-2 border rounded-full cursor-pointer select-none hover:shadow transition-shadow"
              onClick={() => {
                sendSuggestedPrompt?.("I don't understand");
              }}
            >
              <p className="question-suggestion-text text-[#6E7682] text-sm font-normal">
                I don't understand
              </p>
            </div>
            <div
              role="button"
              className="question-suggestion p-2 border rounded-full cursor-pointer select-none hover:shadow transition-shadow"
              onClick={() => {
                sendSuggestedPrompt?.('Teach me more!');
              }}
            >
              <p className="question-suggestion-text text-[#6E7682] text-sm font-normal">
                Teach me more!
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="w-9 h-9 opacity-0 pointer-events-none shrink-0"></div>
    </div>
  );
};

export default ChatMessage;
