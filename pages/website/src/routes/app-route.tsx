import FallbackError from '@src/components/common/fallback-error';
import { Helmet } from 'react-helmet-async';
import { ErrorBoundary } from 'react-error-boundary';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import type { ILayout } from '@src/types';

function FallbackErrorNotif() {
  return <FallbackError redirectBack={{ to: 'HOME', title: 'Kembali ke home' }} />;
}

type Props = {
  isPrivate: boolean;
  children: ReactNode;
} & Omit<ILayout, 'component' | 'layout'>;

const AppRoute = ({ isPrivate, children, title, breadcrumbs, path }: Props) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <ErrorBoundary FallbackComponent={FallbackErrorNotif}>
        <Suspense fallback={<div>loading....</div>} key={path}>
          {children}
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default AppRoute;
