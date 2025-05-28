import { LatestBookmarkedSite } from '@src/components/common/latest-bookmarked-site';
import { MostBookmarkedSite } from '@src/components/common/most-bookmarked-site';
import { TopContributionUser } from '@src/components/common/top-contribution-user';

const ExplorePage = () => {
  return (
    <div>
      <div className="space-y-10">
        <MostBookmarkedSite />
        <LatestBookmarkedSite />
        <TopContributionUser />
      </div>
    </div>
  );
};

export default ExplorePage;
