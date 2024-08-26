import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteConversationId,
  editConversationId
} from '../../../../../services/AI';
import useUserStore from '../../../../../state/userStore';
import { useNavigate } from 'react-router-dom';

function useListItem({
  onRenameSuccess,
  onDeletedSuccess
}: {
  onRenameSuccess?: (newTitle: any) => void;
  onDeletedSuccess?: (id: string) => void;
}) {
  const user = useUserStore((state) => state.user);
  const studentId = user?._id;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  //   API call to renaming the conversation
  const { mutate: rename, isPending: renaming } = useMutation({
    mutationFn: editConversationId,
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['chatHistory', { studentId }]
      });
    },
    onSuccess(data, variables, context) {
      onRenameSuccess(variables);
    }
  });

  //   API call to delete the conversation
  const { mutate: deleteConversation, isPending: deleting } = useMutation({
    mutationFn: deleteConversationId,
    onSuccess(data, variables, context) {
      onDeletedSuccess(variables.conversationId);
      navigate('/dashboard/ace-homework');
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['chatHistory', { studentId }]
      });
    }
  });

  const renameConversation = (
    id: string,
    newTitle: string,
    callback?: (values: any) => void
  ) => {
    rename(
      {
        editConversation: id,
        newTitle
      },
      {
        onSuccess: (data, variables, context) => {
          callback(variables);
        }
      }
    );
  };

  const deleteConversationById = (id: string) => {
    deleteConversation({
      conversationId: id
    });
  };
  //   editConversationId();
  return { renameConversation, renaming, deleteConversationById, deleting };
}

export default useListItem;
