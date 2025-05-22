import { Footer } from '@src/components/Footer';
import { Navbar } from '@src/components/Navbar';
import { MostBookmarkedSite, TopContributionUser } from '@src/components/elements';

const Explore = () => {
  return (
    <>
      <Navbar />
      <div style={{ height: 130 }} />
      <div className="custom-container space-y-16">
        <MostBookmarkedSite />
        <TopContributionUser />
      </div>
      <div style={{ height: 150 }} />
      <Footer />
    </>
  );
};

export default Explore;
