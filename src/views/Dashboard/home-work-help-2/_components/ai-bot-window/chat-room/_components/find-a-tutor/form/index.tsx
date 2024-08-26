import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../../../../../../../../../components/ui/form';
import { FindTutorSchema, FindTutorSchemaType } from '../validation';
import { Button } from '../../../../../../../../../components/ui/button';
import SelectSubject from './_components/select-subject';
import Level from './_components/level';
import Topic from './_components/topic';
import Description from './_components/description';
import Price from './_components/price';
import Duration from './_components/duration';
import InstructionMode from './_components/instruction-mode';
import ExpirationDate from './_components/expiration-date';
import { useCustomToast } from '../../../../../../../../../components/CustomComponents/CustomToast/useCustomToast';
import useCreateBounty from '../hook/useCreateBounty';
import { CounterClockwiseClockIcon } from '@radix-ui/react-icons';
import useResourceStore from '../../../../../../../../../state/resourceStore';
import useConversationDetails from '../../../../../hooks/useConversationDetails';
import Skeleton from './_components/skeleton';

function BountyForm({
  handleClose,
  conversationId
}: {
  handleClose: () => void;
  conversationId: string;
}) {
  const toast = useCustomToast();
  const { data, isLoading, description, isDescriptionLoaded } =
    useConversationDetails({ conversationId });
  const { createBounty, isPending } = useCreateBounty();
  const { courses: courseList, levels } = useResourceStore();

  const form = useForm<FindTutorSchemaType>({
    resolver: zodResolver(FindTutorSchema),
    defaultValues: {
      courseId:
        courseList.find((course) => course.label === data?.subject)?._id ?? '',
      topic: data?.topic ?? '',
      levelId: '',
      description: 'Generating summary....'
    }
  });

  async function onSubmit(values: FindTutorSchemaType) {
    // Do something with the form values.
    const newValues = {
      ...values,
      reward: Number(values.reward)
    };

    createBounty(newValues, {
      onSuccess: (data, variables) => {
        toast({
          title: 'Bounty created',
          description: 'Your bounty has been created successfully',
          status: 'success',
          position: 'bottom-right'
        });
        handleClose();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="w-full flex flex-col gap-3 p-5 ">
          <div className="w-full grid grid-cols-2 gap-2">
            <SelectSubject form={form} isLoading={isLoading} />
            <Level form={form} isLoading={isLoading} />
          </div>
          <Topic form={form} isLoading={isLoading} />
          <Description
            form={form}
            description={description}
            isDescriptionLoaded={isDescriptionLoaded}
          />
          <div className="w-full grid grid-cols-2 gap-2 items-center">
            <Price form={form} />
            <Duration form={form} />
          </div>
          <div className="w-full grid grid-cols-2 gap-2">
            <InstructionMode form={form} />
            <div className="w-full bg-white flex items-stretch">
              <ExpirationDate form={form} />
            </div>
          </div>
        </div>

        <footer className="h-[72px] border-t p-5 pt-5 overflow-hidden w-full flex justify-end gap-4 items-center bg-[#F7F7F8]">
          <Button
            size="sm"
            className="shadow-md bg-white text-[#5C5F64] hover:shadow-lg text-sm font-normal"
            type="button"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            type="submit"
            className="shadow-md hover:shadow-lg text-sm font-normal text-white bg-[#207DF7] hover:bg-[#0E6EFA]"
            disabled={isPending}
          >
            {isPending ? (
              <CounterClockwiseClockIcon className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Confirm
          </Button>
        </footer>
      </form>
    </Form>
  );
}

export default BountyForm;
