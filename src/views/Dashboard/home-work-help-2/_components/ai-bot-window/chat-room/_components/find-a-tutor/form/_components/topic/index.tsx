import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormMessage
} from '../../../../../../../../../../../components/ui/form';
import { FindTutorSchemaType } from '../../../validation';
import { Input } from '../../../../../../../../../../../components/ui/input';

function Topic({
  form,
  isLoading
}: {
  form: UseFormReturn<FindTutorSchemaType>;
  isLoading: boolean;
}) {
  return (
    <FormField
      control={form.control}
      name="topic"
      render={({ field }) => (
        <FormItem>
          {isLoading ? (
            <div className="w-full h-8 rounded-md bg-gray-200 animate-pulse"></div>
          ) : (
            <Input
              placeholder="Topic"
              {...field}
              className="focus-within:border-[#2080FC] focus-within:ring-[#2080FC]"
            />
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default Topic;
