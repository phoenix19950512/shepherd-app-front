import { createContext, useContext } from 'react';

export const DocChatContext = createContext({
  chatHistory: {},
  highlights: ''
});

export function useDocChatContext() {
  const { chatHistory, highlights } = useContext(DocChatContext);

  return { chatHistory, highlights };
}

export function DocChatProvider({ children }) {
  const chatHistory = { mane: 'mogwau' };
  const highlights = ['heyyyy'];
  return (
    // @ts-ignore: will come back to this
    <DocChatContext.Provider value={{ chatHistory, highlights }}>
      {children}
    </DocChatContext.Provider>
  );
}
