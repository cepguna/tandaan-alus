import type { Doc } from '@extension/backend/convex/_generated/dataModel';
import { BookmarkSiteCard } from './bookmark-site-card';
import { SOCIAL_MEDIA } from '@src/lib/constants/social-media';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  sites: Doc<'sites'>[];
  user?: Doc<'users'>;
  isMine?: boolean;
  isLoading?: boolean;
  hideAddTags?: boolean;
};

export const UserBookmarkSites = ({ sites, hideAddTags, isLoading, user }: Props) => {
  const socialMedia = useMemo(() => {
    if (user?.urls) {
      return user.urls.map(url => {
        return {
          link: url.link,
          ...SOCIAL_MEDIA.find(x => x.value === url.type),
        };
      });
    }
    return [];
  }, [user?.urls]);

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Loading...</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {new Array(8).fill('').map((_, i) => (
            <BookmarkSiteCard hideAddTags={hideAddTags} isLoading data={undefined} key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div>
          <h2 className="text-2xl font-bold ">{user ? user?.name : 'My'} Bookmarked Sites</h2>
          {socialMedia.length > 0 && (
            <div className="flex items-center gap-4 mt-2">
              {socialMedia.map(sosmed => (
                <Link target="_blank" key={sosmed.link} to={`${sosmed.baseUrl}${sosmed.link}`}>
                  {sosmed.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      {sites.length > 0 ? (
        <div className="columns-1 sm:columns-2 gap-4 space-y-4">
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
