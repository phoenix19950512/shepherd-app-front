import { useCustomToast } from '../../../../components/CustomComponents/CustomToast/useCustomToast';
import DragAndDrop from '../../../../components/DragandDrop';
import { storage } from '../../../../firebase';
import onboardTutorStore from '../../../../state/onboardTutorStore';
import { AddIcon } from '@chakra-ui/icons';
import { Box, IconButton, HStack, useToast } from '@chakra-ui/react';
import { ref } from '@firebase/storage';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import React, { useState, useRef, ChangeEvent, useEffect } from 'react';

const ProfilePictureForm: React.FC = () => {
  const toast = useCustomToast();
  const { avatar: storedAvatar } = onboardTutorStore.useStore();

  const [avatar, setAvatar] = useState<string>(
    'https://www.pathwaysvermont.org/wp-content/uploads/2017/03/avatar-placeholder-e1490629554738.png'
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleAddImage = () => {
    // Trigger the file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (storedAvatar) {
      setAvatar(storedAvatar);
    }
  }, [storedAvatar]);

  useEffect(() => {
    if (!imageFile) return;

    onboardTutorStore.set.avatar?.('');

    if (imageFile?.size > 2000000) {
      toast({
        title: 'Please upload a file under 2MB',
        status: 'error',
        position: 'top',
        isClosable: true
      });
      return;
    } else {
      const storageRef = ref(storage, `files/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          // setCvUploadPercent(progress);
        },
        (error) => {
          // setCvUploadPercent(0);
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            onboardTutorStore.set.avatar?.(downloadURL);
          });
        }
      );
    }
  }, [imageFile, toast]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setImageFile(file);
      // Convert the selected image to base64
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setAvatar(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <HStack marginTop="50px" justifyContent={'center'}>
      <Box
        width="120px"
        height="120px"
        borderRadius="full"
        background="#F1F2F3"
        position="relative"
      >
        <img
          src={avatar}
          alt="Avatar"
          style={{ width: '100%', height: '100%', borderRadius: '50%' }}
        />
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
        <IconButton
          icon={<AddIcon />}
          aria-label="Add Image"
          colorScheme="blue"
          borderRadius="full"
          background="#207DF7"
          boxShadow="0px 4px 10px rgba(129, 139, 152, 0.25)"
          position="absolute"
          bottom="2px"
          right="5px"
          onClick={handleAddImage}
        />
      </Box>
    </HStack>
  );
};

export default ProfilePictureForm;
