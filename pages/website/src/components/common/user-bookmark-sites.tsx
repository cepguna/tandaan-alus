import type { Doc } from '@extension/backend/convex/_generated/dataModel';
import { BookmarkSiteCard } from './bookmark-site-card';

type Props = {
  sites: Doc<'sites'>[];
  user?: Doc<'users'>;
  isMine?: boolean;
  isLoading?: boolean;
  hideAddTags?: boolean;
};

export const UserBookmarkSites = ({ sites, hideAddTags, isLoading, user }: Props) => {
  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Loading...</h2>
        <div className="columns-1 sm:columns-2 xl:columns-2 gap-4 space-y-4">
          {new Array(10).fill('').map((_, i) => (
            <BookmarkSiteCard hideAddTags={hideAddTags} isLoading={isLoading} data={undefined} key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{user ? user?.name : 'My'} Bookmarked Sites</h2>
      {sites.length > 0 ? (
        <div className="columns-1 sm:columns-2 xl:columns-2 gap-4 space-y-4">
          {sites.map(data => (
            <BookmarkSiteCard hideAddTags={hideAddTags} isLoading={isLoading} data={data} key={data._id} />
          ))}
        </div>
      ) : (
        <p className="text-4xl text-center font-bold my-32">Empty</p>
      )}
    </div>
  );
};
