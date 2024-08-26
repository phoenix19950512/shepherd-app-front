import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button } from '../../../../../../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../../../../../../components/ui/dropdown-menu';
import useListItem from '../../../../hooks/useListItem';
import { useRef, useState } from 'react';
import useStudentConversations from '../../../../hooks/useStudentConversations';
import useUserStore from '../../../../../../../../state/userStore';
import { useCustomToast } from '../../../../../../../../components/CustomComponents/CustomToast/useCustomToast';
import { cn } from '../../../../../../../../library/utils';
import { useNavigate } from 'react-router';
import useChatManager from '../../../hooks/useChatManager';

function ChatInfoDropdown({
  id,
  disabled,
  title
}: {
  id: string;
  disabled: boolean;
  title: string | null;
}) {
  const toast = useCustomToast();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const studentId = useUserStore((state) => state.user?._id);

  const [renameMode, setRenameMode] = useState({
    enabled: false,
    title: 'Chat title'
  });
  const { setTitle } = useChatManager('homework-help');
  const { isFetching } = useStudentConversations({
    studentId: studentId,
    select: (data) => {
      const conversation = data.find((item) => item.id === id);
      if (conversation) {
        if (
          conversation.title !== null &&
          conversation.title !== '' &&
          renameMode.title !== conversation.title
        ) {
          setRenameMode((prev) => ({
            title: conversation.title ?? title ?? 'Chat title',
            enabled: false
          }));
        }
      }
      return conversation;
    }
  });

  const { renameConversation, renaming, deleteConversationById, deleting } =
    useListItem({
      onRenameSuccess: (values: any) => {
        setTitle(values.newTitle);
        setRenameMode(() => ({ title: values.newTitle, enabled: false }));
        toast({
          status: 'success',
          title: 'Conversation renamed successfully'
        });
      },
      onDeletedSuccess: () => {
        navigate('/dashboard/ace-homework');
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

  const handleDelete = (id: string) => {
    deleteConversationById(id);
  };

  const handleRenameOnBlur = () => {
    renameConversation(id, inputRef.current?.value || '');
    setRenameMode((prev) => ({ ...prev, enabled: false }));
  };

  return (
    <div
      className={cn({
        'pointer-events-none': disabled,
        grayscale: disabled,
        'cursor-not-allowed': renaming || deleting || disabled
      })}
    >
      <DropdownMenu>
        {renameMode.enabled ? (
          <input
            ref={inputRef}
            onBlur={handleRenameOnBlur}
            defaultValue={renameMode.title}
            className="px-2 py-1 rounded-md text-black text-sm font-medium focus-visible:ring-0 max-w-[60%] w-[30ch] mt-[2px] mb-[2px] border-none"
          />
        ) : (
          <DropdownMenuTrigger asChild disabled={renaming || deleting}>
            <div
              className={cn('w-full flex justify-center', {
                'opacity-50': renaming || deleting,
                'cursor-not-allowed': renaming && deleting
              })}
            >
              <ConversationTitle title={title ?? renameMode.title} />
            </div>
          </DropdownMenuTrigger>
        )}

        <DropdownMenuContent className="w-[180px] bg-white rounded-md shadow-md">
          <DropdownMenuGroup className="p-2">
            <DropdownMenuItem
              className="
            flex items-center
            text-sm
            text-[#212224]
            rounded-md
            hover:bg-[#F2F4F7]
          "
              onClick={handleRename}
            >
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center
            text-sm
            rounded-md
            hover:bg-[#F2F4F7] text-[#DB0B0B]"
              onClick={() => handleDelete(id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {isFetching && (
        <p className="text-xs text-slate-400 w-full text-center">
          Loading title...
        </p>
      )}
    </div>
  );
}

const ConversationTitle = ({ title }: { title: string }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="p-0 text-black text-sm font-medium focus-visible:ring-0 w-[60%] sm:w-full"
    >
      <p className="truncate text-ellipsis"> {title} </p>
      <ChevronDownIcon className="w-4 h-4 ml-1 text-[#212224]" />
    </Button>
  );
};

export default ChatInfoDropdown;
