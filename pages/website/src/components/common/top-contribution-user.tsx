import { useGetTopUsersByPublicBookmarks } from '@src/hooks/use-services/use-sites';
import { LegendaryUserCard } from './legendary-user-card';

const EMOJI = ['😎', '🤩', '🫣', '🥶', '😱', '🥳', '😜', '🤫'];

const getEmoji = () => {
  const random = Math.round(Math.random() * EMOJI.length);
  return EMOJI[random];
};

export const TopContributionUser = () => {
  const { data: users, isPending } = useGetTopUsersByPublicBookmarks(6);

  if (isPending) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Top 10 Contribution User</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {new Array(8).fill('').map((_, i) => (
            <LegendaryUserCard isLoading key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Top 6 Contribution User {getEmoji()}</h2>
      {users && users.length > 0 ? (
        <div className="columns-1 sm:columns-2 gap-4 space-y-4">
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
