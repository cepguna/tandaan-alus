import { Footer } from '../common/footer';
import { Navbar } from '../common/navbar';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div style={{ height: 130 }} />
      <div className="custom-container px-4">
        <Outlet />
      </div>
      <div style={{ height: 180 }} />
      <Footer />
    </>
  );
};
