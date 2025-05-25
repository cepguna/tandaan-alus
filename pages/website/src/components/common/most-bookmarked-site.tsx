import { useGetMostBookmarkedSites } from '@src/hooks/use-services/use-sites';
import type { Doc } from '@extension/backend/convex/_generated/dataModel';
import { BookmarkSiteCard } from './bookmark-site-card';

export const MostBookmarkedSite = () => {
  const { data: sites, isPending } = useGetMostBookmarkedSites(6);
  if (isPending) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Most Bookmarked Sites</h2>
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
      <h2 className="text-2xl font-bold mb-6">Most Bookmarked Sites</h2>
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
