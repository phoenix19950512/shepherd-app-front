import { useMutation } from '@tanstack/react-query';
import offerStore from '../../../../../../../../../state/offerStore';

function useCreateBounty() {
  const { createBounty } = offerStore();
  const { mutate: create, isPending } = useMutation({
    mutationFn: createBounty
  });
  return { createBounty: create, isPending };
}

export default useCreateBounty;
