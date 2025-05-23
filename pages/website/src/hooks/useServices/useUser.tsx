import { convexQuery } from '@convex-dev/react-query';
import { api } from '@extension/backend/convex/_generated/api';
import { useQuery } from '@tanstack/react-query';

export const useGetMe = () => {
  const query = useQuery(convexQuery(api.user.me, {}));

  return query;
};

// export const useLogout = () => {
//   const { setMe } = useUserStore();
//   const router = useRouter();
//   const handleLogout = () => {
//     setMe({
//       name: '',
//       email: '',
//       role: 'user',
//       _id: null as any,
//       _creationTime: null as any,
//     });
//     router.replace('/login');
//   };
//   return handleLogout;
// };
