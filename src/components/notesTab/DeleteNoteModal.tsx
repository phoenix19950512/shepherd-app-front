import CustomButton from '../CustomComponents/CustomButton';
import {
  DeleteConfirmationContainer,
  DeleteConfirmationDescription,
  DeleteConfirmationDetails,
  DeleteConfirmationImage,
  ModalFooter
} from './styles';
import React, { useCallback } from 'react';

interface DeleteNoteModalProps {
  title: string;
  setDeleteNoteModal: (state: boolean) => void;
}

const DeleteNoteModal: React.FC<DeleteNoteModalProps> = ({
  title,
  setDeleteNoteModal
}) => {
  const onDeleteNote = useCallback(() => {
    setDeleteNoteModal(false);
  }, [setDeleteNoteModal]);

  return (
    <>
      <DeleteConfirmationContainer>
        <DeleteConfirmationImage
          src="/svgs/text-document.svg"
          alt="delete-file"
        />
      </DeleteConfirmationContainer>
      <DeleteConfirmationDetails>
        <p>{` Delete ${title}?`}</p>
        <DeleteConfirmationDescription>
          <p>
            This will permanently all learning materials associated with this
            note
          </p>
        </DeleteConfirmationDescription>
      </DeleteConfirmationDetails>

      <ModalFooter>
        <CustomButton
          title="Cancel"
          isCancel
          type="submit"
          onClick={onDeleteNote}
        />

        <CustomButton
          title="Delete"
          isDelete
          type="submit"
          onClick={onDeleteNote}
        />
      </ModalFooter>
    </>
  );
};

export default DeleteNoteModal;
