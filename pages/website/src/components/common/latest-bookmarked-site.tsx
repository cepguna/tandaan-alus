import { useGetLatestPublicSites } from '@src/hooks/use-services/use-sites';
import type { Doc } from '@extension/backend/convex/_generated/dataModel';
import { BookmarkSiteCard } from './bookmark-site-card';
import { Button, Skeleton } from '@extension/ui';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { URL } from '@src/lib/constants';

export const LatestBookmarkedSite = () => {
  const { data: sites, isPending } = useGetLatestPublicSites(6);
  if (isPending) {
    return (
      <div>
        <div className="flex items-center justify-between gap-2  mb-6">
          <h2 className="text-2xl font-bold">Latest Bookmarked Sites</h2>
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
        <h2 className="text-2xl font-bold">Latest Bookmarked Sites</h2>
        <Link to={`${URL.EXPLORE_ALL}?sortBy=latest`}>
          <Button variant={'outline'} size={'sm'}>
            See More <ChevronRight />
          </Button>
        </Link>
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
