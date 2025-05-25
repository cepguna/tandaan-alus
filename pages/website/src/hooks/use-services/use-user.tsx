import { convexQuery, useConvexMutation } from '@convex-dev/react-query';
import { api } from '@extension/backend/convex/_generated/api';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetMe = () => {
  const query = useQuery(convexQuery(api.user.me, {}));

  return query;
};

export const useUpdateUser = () => {
  const result = useMutation({
    mutationFn: useConvexMutation(api.user.updateUser),
  });
  return result;
};
