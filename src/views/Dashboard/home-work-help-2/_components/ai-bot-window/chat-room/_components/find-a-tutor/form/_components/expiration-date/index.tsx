import { CalendarIcon } from '@radix-ui/react-icons';
import {
  FormField,
  FormItem,
  FormMessage,
  FormControl,
  FormLabel
} from '../../../../../../../../../../../components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../../../../../../../../../../components/ui/popover';
import { cn } from '../../../../../../../../../../../library/utils';
import { Calendar } from '../../../../../../../../../../../components/ui/calender';
import { Button } from '../../../../../../../../../../../components/ui/button';
import { format } from 'date-fns';
import { UseFormReturn } from 'react-hook-form';
import { FindTutorSchemaType } from '../../../validation';

function ExpirationDate({
  form
}: {
  form: UseFormReturn<FindTutorSchemaType>;
}) {
  return (
    <FormField
      control={form.control}
      name="expiryDate"
      render={({ field }) => (
        <FormItem className="flex flex-col w-full">
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full pl-3 text-left font-normal',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  {field.value ? (
                    format(field.value, 'PPP')
                  ) : (
                    <span>Expiration date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default ExpirationDate;
