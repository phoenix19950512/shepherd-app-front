import AddSubjectLevel from '../../../../components/AddSubjectLevel';
import CustomSelect from '../../../../components/CustomSelect';
import onboardTutorStore from '../../../../state/onboardTutorStore';
import resourceStore from '../../../../state/resourceStore';
import { Course, LevelType } from '../../../../types';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import React, { useState, useCallback } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';

interface SubjectLevel {
  subject: string;
  level: string;
}

const SubjectLevelForm: React.FC = () => {
  const { coursesAndLevels: subjectLevels } = onboardTutorStore.useStore();

  type SubjectLevel = typeof subjectLevels;

  const setSubjectLevels = (f: (d: typeof subjectLevels) => SubjectLevel) => {
    onboardTutorStore.set.coursesAndLevels(f(subjectLevels));
  };

  useEffect(() => {
    if (!subjectLevels.length) {
      addSubject();
    }
    /* eslint-disable */
  }, [subjectLevels.length]);

  const [loadingCourses, setLoadingCourses] = useState(false);

  const handleSubjectChange = (index: number, value: string) => {
    setSubjectLevels((prevSubjectLevels) => {
      const updatedSubjectLevels = [...prevSubjectLevels];
      updatedSubjectLevels[index].course.label = value;
      return updatedSubjectLevels;
    });
  };

  const handleLevelChange = (index: number, value: string) => {
    setSubjectLevels((prevSubjectLevels) => {
      const updatedSubjectLevels = [...prevSubjectLevels];
      updatedSubjectLevels[index].level.label = value;
      return updatedSubjectLevels;
    });
  };

  const addSubject = () => {
    setSubjectLevels((prevSubjectLevels) => [
      ...prevSubjectLevels,
      { course: {} as Course, level: {} as LevelType }
    ]);
  };

  const removeSubject = (index: number) => {
    setSubjectLevels((prevSubjectLevels) => {
      const updatedSubjectLevels = [...prevSubjectLevels];
      updatedSubjectLevels.splice(index, 1);
      return updatedSubjectLevels;
    });
  };

  return (
    <>
      <AddSubjectLevel
        subjectLevels={subjectLevels}
        addSubject={addSubject}
        removeSubject={removeSubject}
        handleLevelChange={handleLevelChange}
        handleSubjectChange={handleSubjectChange}
      />
    </>
  );
};

export default SubjectLevelForm;
