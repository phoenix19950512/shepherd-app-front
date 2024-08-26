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
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select
} from '../../../../../../../../../../../components/ui/select';

function InstructionMode({
  form
}: {
  form: UseFormReturn<FindTutorSchemaType>;
}) {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Mode of Instruction" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white">
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="chat">Chat</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default InstructionMode;
