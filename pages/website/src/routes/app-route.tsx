import FallbackError from '@src/components/common/fallback-error';
import { Helmet } from 'react-helmet-async';
import { ErrorBoundary } from 'react-error-boundary';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import type { ILayout } from '@src/types';
import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react';
import { FullPageSpinner } from '@src/components/common/fullpage-spinner';
import { NotAuthorizedPage } from '@src/features/others';
import { useExtensionStorageSync } from '@src/hooks/use-extension-storage-sync';

function FallbackErrorNotif() {
  return <FallbackError redirectBack={{ to: 'HOME' }} />;
}

type Props = {
  isPrivate: boolean;
  children: ReactNode;
} & Omit<ILayout, 'component' | 'layout'>;

const AppRoute = ({ isPrivate, children, title, path }: Props) => {
  useExtensionStorageSync();
  if (isPrivate) {
    return (
      <>
        <Helmet>
          <title>Tandaan Alus | {title}</title>
        </Helmet>
        <Authenticated>
          <ErrorBoundary FallbackComponent={FallbackErrorNotif}>
            <Suspense fallback={<div>loading....</div>} key={path}>
              {children}
            </Suspense>
          </ErrorBoundary>
        </Authenticated>
        <AuthLoading>
          <FullPageSpinner />
        </AuthLoading>
        <Unauthenticated>
          <NotAuthorizedPage />
        </Unauthenticated>
      </>
    );
  }
  return (
    <>
      <Helmet>
        <title>Tandaan Alus | {title}</title>
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
