import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import AppLayout from '@src/components/layouts/app-layout';
import { PUBLIC_ROUTES } from './public';
import { PRIVATE_ROUTES } from './private';
import AppRoute from './app-route';
import { NotAuthorizedPage, NotFoundPage } from '@src/features/others';

const PRIVATES = PRIVATE_ROUTES.map(x => ({ ...x, isPrivate: true }));
const PUBLIC = PUBLIC_ROUTES.map(x => ({ ...x, isPrivate: false }));

const RootRouter = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* INFO: pembuatan route bisa perkelompok */}
      {[...PRIVATES, ...PUBLIC].map(item => (
        <Route
          element={<AppLayout layout={item.layout as React.ComponentProps<typeof AppLayout>['layout']} />}
          key={item.path}>
          <Route
            element={
              <AppRoute key={item.path} path={item.path} isPrivate={item.isPrivate} title={item.title}>
                <item.component />
              </AppRoute>
            }
            errorElement={<NotFoundPage />}
            key={item.path}
            path={item.path}
          />
        </Route>
      ))}

      {/* INFO: atau bisa individu langsung (lebih di sarankan di kelompokan biar mudah di baca) */}
      <Route element={<NotFoundPage />} path="*" />
      <Route element={<NotAuthorizedPage />} path="/403" />
    </>,
  ),
);
export default RootRouter;
