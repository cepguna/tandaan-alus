import { UserBookmarkSites } from '@src/components/common/user-bookmark-sites';
import { useGetPublicSitesByUsername } from '@src/hooks/use-services/use-sites';
import { useParams } from 'react-router-dom';

const DetailExplorePage = () => {
  const { userId } = useParams();
  const { isPending, data } = useGetPublicSitesByUsername(userId as string);
  return (
    <div>
      <UserBookmarkSites hideAddTags isLoading={isPending} user={data?.user} sites={data?.sites ?? []} />
    </div>
  );
};

export default DetailExplorePage;
