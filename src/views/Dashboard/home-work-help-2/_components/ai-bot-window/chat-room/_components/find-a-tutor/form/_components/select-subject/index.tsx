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

function SelectSubject({
  form,
  isLoading
}: {
  form: UseFormReturn<FindTutorSchemaType>;
  isLoading: boolean;
}) {
  const { courses: courseList } = useResourceStore();
  return (
    <FormField
      control={form.control}
      name="courseId"
      disabled={isLoading}
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
                  <SelectValue placeholder="Subject" />
                )}
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white">
              {courseList.map((course) => {
                return (
                  <SelectItem key={course._id} value={course._id}>
                    {course.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default SelectSubject;
