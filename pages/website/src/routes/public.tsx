import { DetailExplorePage, ExplorePage } from '@src/features/explore';
import { LandingPage } from '@src/features/landing';
import { URL } from '@src/lib/constants';
import type { ILayout } from '@src/types';

export const PUBLIC_ROUTES: ILayout[] = [
  {
    title: 'Discover & Share Great Websites',
    path: URL.HOME,
    component: LandingPage,
    layout: 'none',
  },
  {
    title: 'Explore',
    exact: true,
    path: URL.EXPLORE,
    component: ExplorePage,
    layout: 'main',
  },
  {
    title: 'Detail Explore',
    exact: true,
    path: URL.DETAIL_EXPLORE,
    component: DetailExplorePage,
    layout: 'main',
  },
];
