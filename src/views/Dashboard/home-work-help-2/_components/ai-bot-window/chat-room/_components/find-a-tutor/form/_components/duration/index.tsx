import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormMessage,
  FormControl,
  FormLabel
} from '../../../../../../../../../../../components/ui/form';
import {
  RadioGroup,
  RadioGroupItem
} from '../../../../../../../../../../../components/ui/radio-group';
import { FindTutorSchemaType } from '../../../validation';

function Duration({ form }: { form: UseFormReturn<FindTutorSchemaType> }) {
  return (
    <FormField
      control={form.control}
      name="time"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-row gap-3 items-center"
            >
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="30min" />
                </FormControl>
                <FormLabel className="font-normal">Half Hour</FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="60min" />
                </FormControl>
                <FormLabel className="font-normal">Full Hour</FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default Duration;
