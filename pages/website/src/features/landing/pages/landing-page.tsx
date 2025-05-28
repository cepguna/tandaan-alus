import { Navbar } from '@src/components/common/navbar';
import { Footer } from '@src/components/common/footer';
import { HeroSection } from '../components';
import { useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';

const Landing = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [location.pathname]);
  return (
    <>
      <Navbar />
      <HeroSection />
      <Footer />
    </>
  );
};

export default Landing;
