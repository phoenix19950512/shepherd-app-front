import * as React from 'react';
import { format } from 'date-fns';

import { Popover, PopoverTrigger, PopoverContent } from '../popover';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Button } from '../button';
import { cn } from '../../../library/utils';
import { Calendar } from '../calender';

export function DatePicker({
  onDateChange
}: {
  onDateChange?: (date: Date) => void;
}) {
  const [date, setDate] = React.useState<Date>();

  React.useEffect(() => {
    if (date) {
      onDateChange(date);
    }
  }, [date]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          disabled={(date) => date <= new Date()}
        />
      </PopoverContent>
    </Popover>
  );
}
