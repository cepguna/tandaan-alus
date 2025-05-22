import { api } from '@extension/backend/convex/_generated/api';
import { Footer } from '@src/components/Footer';
import { Navbar } from '@src/components/Navbar';
import { UserBookmarkSites } from '@src/components/elements';
import { useQuery } from 'convex/react';

const MyBookmarks = () => {
  const sites = useQuery(api.sites.getAllMySites);
  return (
    <>
      <Navbar />
      <div style={{ height: 130 }} />
      <div className="custom-container space-y-16">
        <UserBookmarkSites sites={sites ?? []} />
      </div>
      <div style={{ height: 150 }} />
      <Footer />
    </>
  );
};

export default MyBookmarks;
