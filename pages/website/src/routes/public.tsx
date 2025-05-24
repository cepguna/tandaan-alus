import { DetailExplorePage, ExplorePage } from '@src/features/explore';
import { LandingPage } from '@src/features/landing';
import { ProfilePage } from '@src/features/profile';
import { URL } from '@src/lib/constants';
import type { ILayout } from '@src/types';

export const PUBLIC_ROUTES: ILayout[] = [
  {
    title: 'Landing Page',
    exact: true,
    breadcrumbs: [],
    path: URL.HOME,
    component: LandingPage,
    layout: 'none',
  },
  {
    title: 'Explore',
    exact: true,
    breadcrumbs: [],
    path: URL.EXPLORE,
    component: ExplorePage,
    layout: 'main',
  },
  {
    title: 'Detail Explore',
    exact: true,
    breadcrumbs: [],
    path: URL.DETAIL_EXPLORE,
    component: DetailExplorePage,
    layout: 'main',
  },
  {
    title: 'Profile',
    exact: true,
    breadcrumbs: [],
    path: URL.PROFILE,
    component: ProfilePage,
    layout: 'main',
  },
];
