import { UserBookmarkSites } from '@src/components/common/user-bookmark-sites';
import { useGetAllMySites } from '@src/hooks/use-services/use-sites';
import { TAGS } from '@src/lib/constants';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

type IFilterPublicSites = {
  search?: string;
  tags?: string[];
  sortBy?: 'most_bookmarked' | 'latest' | 'longest' | 'name_asc' | 'name_desc';
  pageSize?: number;
  cursor?: number;
};

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const DashboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filter, setFilter] = useState<IFilterPublicSites>(() => ({
    search: searchParams.get('search') || '',
    tags:
      searchParams
        .get('tags')
        ?.split(',')
        .filter(tag => TAGS.includes(tag)) || [],
    sortBy: (searchParams.get('sortBy') as IFilterPublicSites['sortBy']) || 'latest',
  }));

  const debouncedFilter = useDebounce(filter, 1000);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedFilter.search) params.set('search', debouncedFilter.search);
    if (debouncedFilter.tags && debouncedFilter.tags.length > 0) params.set('tags', debouncedFilter.tags.join(','));
    if (debouncedFilter.sortBy && debouncedFilter.sortBy !== 'latest') params.set('sortBy', debouncedFilter.sortBy);
    setSearchParams(params, { replace: true });
  }, [debouncedFilter, setSearchParams]);
  const { isPending, data } = useGetAllMySites({ ...debouncedFilter, pageSize: 100 });

  return (
    <div>
      <UserBookmarkSites
        filter={filter}
        setFilter={setFilter}
        isLoading={isPending}
        user={data?.user}
        sites={data?.sites ?? []}
      />
    </div>
  );
};

export default DashboardPage;
