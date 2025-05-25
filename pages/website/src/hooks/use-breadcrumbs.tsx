import { URL } from '@src/lib/constants';
import { useLocation, useMatches } from 'react-router-dom';

const removeSlug = (param: string, search: string) => {
  switch (param) {
    case 'idProduct':
      return search.includes('productChannel') ? 'Detail Product Channel' : 'Detail Product';
    case 'expensesId':
      return 'Detail Expenses';
    case 'noteId':
      return 'Detail Note';
    default:
      return param.split('-').join(' ');
  }
};

export const useBreadcrumbs = () => {
  const router = useMatches();
  const location = useLocation();

  const generate = () => {
    const { pathname, params } = router.length > 0 ? router[1] : router[0];
    const entri = Object.entries(params);
    const pathnameArray = pathname.split('/').filter(item => item);
    const path = pathname
      .split('/')
      .filter(x => x !== '')
      .map((item, index) => {
        const findI = entri.find(p => p[1] === item);
        return {
          title: removeSlug(findI ? findI[0] : item, location?.search),
          path: '/' + pathnameArray.slice(0, index + 1).join('/'),
        };
      })
      .filter(x => x.title !== '');

    return pathname === URL.DASHBOARD
      ? [{ title: 'Home', path: URL.DASHBOARD }]
      : [{ title: 'Home', path: URL.DASHBOARD }, ...path];
  };

  return generate();
};
