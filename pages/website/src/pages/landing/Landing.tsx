import { useQuery } from 'convex/react';
import { api } from '@extension/backend/convex/_generated/api';
import { Navbar } from '@src/components/Navbar';
import { Hero } from '@src/components/Hero';
import { Footer } from '@src/components/Footer';

const Landing = () => {
  const notes = useQuery(api.sites.getAllSites);

  return (
    <>
      <Navbar />
      <Hero />
      <Footer />
    </>
  );
};

export default Landing;
