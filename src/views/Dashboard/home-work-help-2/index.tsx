import { memo, useMemo, useState, useEffect } from 'react';

import AiChatBotWindow from './_components/ai-bot-window';
import ChatHistory from './_components/chat-history';

import { useCustomToast } from '../../../components/CustomComponents/CustomToast/useCustomToast';
import CodeEditorWindow from './_components/code-editor/CodeEditorWindow';

const Component = () => {
  return (
    <div className="w-full h-full flex gap-[1px] overflow-x-hidden">
      <ChatHistory />
      <div className="h-full flex-[1] flex-col">
        <AiChatBotWindow />
      </div>

      <CodeEditorWindow />
    </div>
  );
};

function HomeWorkHelp2() {
  const component = useMemo(() => <Component />, []);
  return component;
}

export default memo(HomeWorkHelp2, () => true);
