import { DashboardPage } from '@src/features/dashboard';
import { ProfilePage } from '@src/features/profile';
import { URL } from '@src/lib/constants';
import type { ILayout } from '@src/types';

export const PRIVATE_ROUTES: ILayout[] = [
  {
    title: 'Dashboard',
    exact: true,
    path: URL.DASHBOARD,
    component: DashboardPage,
    layout: 'main',
  },
  {
    title: 'Profile',
    exact: true,
    path: URL.PROFILE,
    component: ProfilePage,
    layout: 'main',
  },
];
