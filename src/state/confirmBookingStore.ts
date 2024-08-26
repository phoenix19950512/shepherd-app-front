import { createStore } from '@udecode/zustood';

import { Slot, Tutor } from '../types';

type Store = {
    course: '';
    slots: Slot[];
    tutor: Tutor['_id'] | null;
};

export default createStore('confirmBookingStore')<Store>({
    course: '',
    tutor: null,
    slots: [],
});
