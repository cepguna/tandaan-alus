import { UserBookmarkSites } from '@src/components/common/user-bookmark-sites';
import { useGetAllMySites } from '@src/hooks/use-services/use-sites';

const BookmarksPage = () => {
  const { isPending, data: sites } = useGetAllMySites();
  return (
    <div>
      <UserBookmarkSites isLoading={isPending} sites={sites ?? []} />
    </div>
  );
};

export default BookmarksPage;
