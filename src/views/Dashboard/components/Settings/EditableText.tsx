import { Input, Button, Box } from '@chakra-ui/react';
import React, { useState } from 'react';

const EditableText = ({ text }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState(text);

  const handleEditButtonClick = () => {
    setIsEditing(true);
  };

  const handleSaveButtonClick = () => {
    setIsEditing(false);
    // You can perform any save operation here, e.g., update the text in the database, etc.
  };

  const handleChange = (event) => {
    setEditableText(event.target.value);
  };

  return (
    <Box>
      {isEditing ? (
        <Input
          value={editableText}
          onChange={handleChange}
          autoFocus
          onBlur={handleSaveButtonClick}
        />
      ) : (
        <Box onClick={handleEditButtonClick} cursor="pointer">
          {text}
        </Box>
      )}
      {isEditing && (
        <Button mt={2} size="sm" onClick={handleSaveButtonClick}>
          Save
        </Button>
      )}
    </Box>
  );
};

export default EditableText;
