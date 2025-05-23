import type { Doc } from '@extension/backend/convex/_generated/dataModel';
import { CardBookmarkSite } from './cards';

type Props = {
  sites: Doc<'sites'>[];
  isMine?: boolean;
  isLoading?: boolean;
};

export const UserBookmarkSites = ({ sites, isLoading }: Props) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Bookmarked Sites</h2>
      {sites.length > 0 ? (
        <div className="columns-1 sm:columns-2 xl:columns-2 gap-4 space-y-4">
          {sites.map(data => (
            <CardBookmarkSite isLoading={isLoading} data={data} key={data._id} />
          ))}
        </div>
      ) : (
        <p className="text-4xl text-center font-bold my-32">Empty</p>
      )}
    </div>
  );
};
