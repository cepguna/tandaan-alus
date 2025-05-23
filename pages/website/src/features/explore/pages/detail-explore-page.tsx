import type { Id } from '@extension/backend/convex/_generated/dataModel';
import { UserBookmarkSites } from '@src/components/common/user-bookmark-sites';
import { useGetPublicSitesByUserId } from '@src/hooks/use-services/use-sites';
import { useParams } from 'react-router-dom';

const DetailExplorePage = () => {
  const { userId } = useParams();
  const { isPending, data } = useGetPublicSitesByUserId(userId as Id<'users'>);
  return (
    <div>
      <UserBookmarkSites hideAddTags isLoading={isPending} user={data?.user} sites={data?.sites ?? []} />
    </div>
  );
};

export default DetailExplorePage;
