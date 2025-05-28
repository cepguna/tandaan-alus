import { Footer } from '../common/footer';
import { Navbar } from '../common/navbar';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Fragment, useLayoutEffect } from 'react';
import { Slash } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@extension/ui';
import { useBreadcrumbs } from '@src/hooks/use-breadcrumbs';

export const MainLayout = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [location.pathname]);
  return (
    <>
      <Navbar />
      <div style={{ height: 120 }} />
      <div className="custom-container min-h-screen px-4">
        <Breadcrumbs />
        <Outlet />
      </div>
      <div style={{ height: 100 }} />
      <Footer />
    </>
  );
};

export function Breadcrumbs() {
  const items = useBreadcrumbs();
  if (items.length === 0) return null;

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={item.title}>
            {index !== items.length - 1 && (
              <BreadcrumbItem className="">
                <Link to={item.path}>
                  <BreadcrumbLink className="capitalize">{item.title}</BreadcrumbLink>
                </Link>
              </BreadcrumbItem>
            )}
            {index < items.length - 1 && (
              <BreadcrumbSeparator className="">
                <Slash />
              </BreadcrumbSeparator>
            )}
            {index === items.length - 1 && <BreadcrumbPage className="capitalize">{item.title}</BreadcrumbPage>}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
