import { BookmarksPage } from '@src/features/bookmarks';
import { URL } from '@src/lib/constants';
import type { ILayout } from '@src/types';

export const PRIVATE_ROUTES: ILayout[] = [
  {
    title: 'Bookmarks',
    exact: true,
    breadcrumbs: [],
    path: URL.BOOKMARKS,
    component: BookmarksPage,
    layout: 'main',
  },
];
