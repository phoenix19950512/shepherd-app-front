import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '../../../../../../../../../../../components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../../../../../../../../components/ui/select';
import { FindTutorSchemaType } from '../../../validation';
import useResourceStore from '../../../../../../../../../../../state/resourceStore';

function Level({
  form,
  isLoading
}: {
  form: UseFormReturn<FindTutorSchemaType>;
  isLoading: boolean;
}) {
  const { levels } = useResourceStore();
  return (
    <FormField
      control={form.control}
      name="levelId"
      render={({ field }) => (
        <FormItem>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                {isLoading ? (
                  <div className="w-full h-4 bg-gray-200 animate-pulse"></div>
                ) : (
                  <SelectValue placeholder="Level" />
                )}
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white">
              {levels?.map((item) => (
                <SelectItem value={item._id}>{item.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default Level;
