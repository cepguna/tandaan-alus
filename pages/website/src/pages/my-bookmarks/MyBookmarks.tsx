import { Footer } from '@src/components/Footer';
import { Navbar } from '@src/components/Navbar';
import { UserBookmarkSites } from '@src/components/elements';
import { useGetAllMySites } from '@src/hooks/useServices/useSites';

const MyBookmarks = () => {
  const { isPending, data: sites } = useGetAllMySites();
  return (
    <>
      <Navbar />
      <div style={{ height: 130 }} />
      <div className="custom-container space-y-16">
        <UserBookmarkSites isLoading={isPending} sites={sites ?? []} />
      </div>
      <div style={{ height: 150 }} />
      <Footer />
    </>
  );
};

export default MyBookmarks;
