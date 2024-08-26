import { Link, useParams } from 'react-router-dom';
import Options from './_components/options';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useChatManager from '../../../../ai-bot-window/hooks/useChatManager';
import { useCustomToast } from '../../../../../../../../components/CustomComponents/CustomToast/useCustomToast';
import useListItem from '../../../../hooks/useListItem';

const CHAT_WINDOW_CONFIG_PARAMS_LOCAL_STORAGE_KEY = 'CHAT_WINDOW_CONFIG_PARAMS';

const ListItem = ({
  id,
  title = 'Chat title',
  topic,
  subject,
  level
}: {
  id: string;
  title: string;
  topic: string;
  subject: string;
  level: string;
}) => {
  const inputRef = useRef<HTMLInputElement | null>();
  const toast = useCustomToast();
  const navigate = useNavigate();
  const { id: conversationId } = useParams();

  const { setChatWindowParams } = useChatManager('homework-help');

  const [renameMode, setRenameMode] = useState({
    enabled: false,
    title: title
  });
  const { renameConversation, renaming, deleteConversationById, deleting } =
    useListItem({
      onRenameSuccess: (values: any) => {
        setRenameMode((prev) => ({ title: values.newTitle, enabled: false }));
        toast({
          status: 'success',
          title: 'Conversation renamed successfully'
        });
      },
      onDeletedSuccess: (id: string) => {
        toast({
          status: 'success',
          title: 'Conversation deleted successfully'
        });
      }
    });

  const handleRename = () => {
    setRenameMode((prev) => ({ ...prev, enabled: true }));
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleRenameOnBlur = () => {
    renameConversation(id, inputRef.current?.value || '');
  };

  const handleDelete = (id: string) => {
    deleteConversationById(id);
  };

  const handleConversationClick = () => {
    setChatWindowParams({
      connectionQuery: { topic, subject, level },
      isNewWindow: false
    });

    navigate(id);
  };

  return (
    <div
      className={`flex w-full h-[36px] text-[#000000] justify-between leading-5 text-[12px] rounded-[8px] border gap-2 font-normal bg-[#F9F9FB] border-none px-2 hover:bg-[#e5e5e5ba] hover:cursor-pointer ${
        id === conversationId ? 'bg-[#e5e5e5ba]' : ''
      } ${renaming || deleting ? 'opacity-50' : ''}`}
    >
      {renameMode.enabled ? (
        <input
          ref={inputRef}
          onBlur={handleRenameOnBlur}
          type="text"
          defaultValue={title}
          className="w-full py-2 pl-2 text-[12px] border-none bg-blue-100 italic"
          value={renameMode.title}
          onChange={(e) =>
            setRenameMode((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      ) : (
        <button
          onClick={() => handleConversationClick()}
          className="flex-1 py-2 text-ellipsis text-start truncate"
        >
          <span className="w-full text-ellipsis truncate">{title}</span>
        </button>
      )}
      <Options
        id={id}
        actions={{
          handleRename,
          handleDelete
        }}
      />
    </div>
  );
};

export default ListItem;
