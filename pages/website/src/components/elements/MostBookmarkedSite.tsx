import { CardBookmarkSite } from './cards';

export const MostBookmarkedSite = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Most Bookmarked Sites</h2>
      <div className="grid grid-cols-3 gap-4">
        {new Array(9).fill('').map((_, i) => (
          <CardBookmarkSite isLoading key={i} />
        ))}
      </div>
    </div>
  );
};
