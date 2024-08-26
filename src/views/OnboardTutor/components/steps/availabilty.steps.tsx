import CustomDropdown from '../../../../components/CustomDropdown';
import CustomSelect from '../../../../components/CustomSelect';
import onboardTutorStore from '../../../../state/onboardTutorStore';
import { Schedule, TimeSchedule } from '../../../../types';
import timezones from './timezones';
import {
  Fade,
  Box,
  Flex,
  Button,
  Text,
  Select,
  FormControl,
  Checkbox,
  FormLabel,
  Stack,
  VStack
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { FaPlus } from 'react-icons/fa';
import TimePicker from '../../../../components/TimePicker';
import { DeleteIcon } from '@chakra-ui/icons';
import moment from 'moment-timezone';
import { convertToNewFormat, convertToPreviousFormat } from '../../../../util';
import Availability from '../../../../components/Availability';

const AvailabilityForm = () => {
  const { schedule, tz: timezone } = onboardTutorStore.useStore();

  const updateSchedule = (val) => {
    onboardTutorStore.set?.schedule(val);
  };
  const updateTimezone = (val) => {
    onboardTutorStore.set?.tz(val);
  };
  return (
    <Box>
      <Availability
        schedule={schedule}
        timezone={timezone}
        handleUpdateSchedule={updateSchedule}
        handleUpdateTimezone={updateTimezone}
        editMode
      />
    </Box>
  );
};

export default AvailabilityForm;
