import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormMessage
} from '../../../../../../../../../../../components/ui/form';
import { FindTutorSchemaType } from '../../../validation';
import { Textarea } from '../../../../../../../../../../../components/ui/text-area';
import { useEffect } from 'react';

function Description({
  form,
  isDescriptionLoaded,
  description
}: {
  form: UseFormReturn<FindTutorSchemaType>;
  isDescriptionLoaded: boolean;
  description: string;
}) {
  useEffect(() => {
    if (isDescriptionLoaded) {
      form.setValue('description', description);
    }
  }, [isDescriptionLoaded]);

  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <Textarea
            disabled={!isDescriptionLoaded}
            className="h-48 max-h-48"
            placeholder="Description"
            {...field}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default Description;
