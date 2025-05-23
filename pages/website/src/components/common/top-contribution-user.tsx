import { useGetTopUsersByPublicBookmarks } from '@src/hooks/use-services/use-sites';
import { LegendaryUserCard } from './legendary-user-card';

export const TopContributionUser = () => {
  const { data: users, isPending } = useGetTopUsersByPublicBookmarks(6);

  if (isPending) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Most Bookmarked Sites</h2>
        <div className="grid grid-cols-3 gap-4">
          {new Array(9).fill('').map((_, i) => (
            <LegendaryUserCard isLoading key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Top Contribution User</h2>
      {users && users.length > 0 ? (
        <div className="columns-1 sm:columns-2 xl:columns-2 gap-4 space-y-4">
          {users.map(data => (
            <LegendaryUserCard data={data} key={data.userId} />
          ))}
        </div>
      ) : (
        <p className="text-4xl text-center font-bold my-32">Empty</p>
      )}
    </div>
  );
};
