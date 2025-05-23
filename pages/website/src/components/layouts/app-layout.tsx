import { Outlet } from 'react-router-dom';
import { MainLayout } from './main-layout';

export interface PropsAppLayout {
  layout?: 'main' | 'none';
}

const layouts = {
  main: MainLayout,
  none: (
    <>
      <Outlet />
    </>
  ),
};

function AppLayout({ layout }: PropsAppLayout) {
  const Layout = layout ? layouts[layout as keyof typeof layouts] : Outlet;
  return <>{typeof Layout === 'function' ? <Layout /> : Layout}</>;
}

AppLayout.defaultProps = {
  layout: undefined,
};
export default AppLayout;
