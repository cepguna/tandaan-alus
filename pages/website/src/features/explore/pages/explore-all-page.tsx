import { Skeleton } from '@extension/ui';
import { BookmarkSiteCard } from '@src/components/common/bookmark-site-card';
import { useGetMostBookmarkedSites } from '@src/hooks/use-services/use-sites';

const ExploreAllPage = () => {
  const { data: sites, isPending } = useGetMostBookmarkedSites(6);
  if (isPending) {
    return (
      <div>
        <div className="flex items-center justify-between gap-2  mb-6">
          <h2 className="text-2xl font-bold">Most Bookmarked Sites</h2>
          <Skeleton className="w-24 h-7" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {new Array(8).fill('').map((_, i) => (
            <BookmarkSiteCard isLoading key={i} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between gap-2  mb-6">
        <h2 className="text-2xl font-bold">Most Bookmarked Sites</h2>
        <div className="flex items-center gap-2"></div>
      </div>
      {sites && sites.length > 0 ? (
        <div className="columns-1 sm:columns-2 gap-4 space-y-4">
          {sites.map(data => (
            <BookmarkSiteCard
              data={data as Doc<'sites'>}
              bookmarkCount={data.bookmarkCount}
              hideAddTags
              key={data._id}
            />
          ))}
        </div>
      ) : (
        <p className="text-4xl text-center font-bold my-32">Empty</p>
      )}
    </div>
  );
};

export default ExploreAllPage;
