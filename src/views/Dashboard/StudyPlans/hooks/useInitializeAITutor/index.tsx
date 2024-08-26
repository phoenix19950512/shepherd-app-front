import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import useChatManager from '../../../home-work-help-2/_components/ai-bot-window/hooks/useChatManager';
// Define the options interface for useInitializeAIChat
interface InitializeAIChatOptions {
  onInitialized?: (conversationId: string) => void;
  navigateOnInitialized?: boolean;
}

const useInitializeAIChat = (
  namespace: string,
  chatManagerOptions?: InitializeAIChatOptions
) => {
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState<Record<string, any>>({});
  // Utilize the useChatManager hook
  const {
    startConversation,
    setChatWindowParams,
    disconnectSocket,
    conversationId,
    ...chatManagerProps
  } = useChatManager(namespace, {
    autoPersistChat: true, // Example: set to true or adjust based on your requirements
    autoHydrateChat: true // Adjust based on your requirements
  });

  useEffect(() => {
    if (conversationId) {
      if (chatManagerOptions?.onInitialized) {
        chatManagerOptions.onInitialized(conversationId);
      }
      disconnectSocket();
      if (chatManagerOptions?.navigateOnInitialized) {
        setChatWindowParams({
          isNewWindow: true,
          connectionQuery: queryParams
        });
        navigate(`/dashboard/ace-homework/${conversationId}`, {
          replace: true
        });
      }
    }
  }, [
    conversationId,
    chatManagerOptions,
    queryParams,
    navigate,
    setChatWindowParams,
    disconnectSocket
  ]);
  // Create a wrapper function for starting new conversations that includes calling the onInitialized callback
  const initializeNewConversation = useCallback(
    (queryParams: Record<string, any>) => {
      setQueryParams(queryParams);
      startConversation(queryParams);
    },
    [startConversation]
  );

  // Return the initializeNewConversation function along with other chat manager props that might be needed
  return initializeNewConversation;
};

export default useInitializeAIChat;
