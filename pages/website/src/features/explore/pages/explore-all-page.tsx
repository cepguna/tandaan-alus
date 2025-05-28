import type { Doc } from '@extension/backend/convex/_generated/dataModel';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Input,
} from '@extension/ui';
import { BookmarkSiteCard } from '@src/components/common/bookmark-site-card';
import { ReactSelect } from '@src/components/ui/react-select';
import { useGetLatestPublicSites } from '@src/hooks/use-services/use-sites';
import { TAGS } from '@src/lib/constants';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

type IFilterPublicSites = {
  search?: string;
  tags?: string[];
  sortBy?: 'most_bookmarked' | 'latest' | 'longest' | 'name_asc' | 'name_desc';
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

const ExploreAllPage = () => {
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

  const { data: sites, isPending } = useGetLatestPublicSites(99, debouncedFilter);

  return (
    <div>
      <div className="flex items-start justify-between gap-2 mb-6">
        <h2 className="text-2xl font-bold">Explore Sites</h2>
        <div className="flex items-start gap-2">
          <FilterSearch value={filter.search} onChange={value => setFilter(prev => ({ ...prev, search: value }))} />
          <FilterTags value={filter.tags} onChange={value => setFilter(prev => ({ ...prev, tags: value }))} />
          <FilterSortBy value={filter.sortBy} onChange={value => setFilter(prev => ({ ...prev, sortBy: value }))} />
        </div>
      </div>
      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {new Array(8).fill('').map((_, i) => (
            <BookmarkSiteCard isLoading key={i} />
          ))}
        </div>
      ) : sites && sites.length > 0 ? (
        <div className="columns-1 sm:columns-2 gap-4 space-y-4">
          {sites.map(data => (
            <BookmarkSiteCard
              data={data as Doc<'sites'>}
              bookmarkCount={data.bookmarkCount}
              hideAddTags
              key={data._id}
            />
          ))}
        </div>
      ) : (
        <p className="text-4xl text-center font-bold my-32">Empty</p>
      )}
    </div>
  );
};

export default ExploreAllPage;

const SORT_BY = [
  { label: 'Most Bookmarked', value: 'bookmark', filterValue: 'most_bookmarked' },
  { label: 'Latest', value: 'latest', filterValue: 'latest' },
  { label: 'Longest', value: 'longest', filterValue: 'longest' },
  { label: 'Name ASC', value: 'name-asc', filterValue: 'name_asc' },
  { label: 'Name DESC', value: 'name-desc', filterValue: 'name_desc' },
];

function FilterSortBy({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: IFilterPublicSites['sortBy']) => void;
}) {
  return (
    <Select
      value={SORT_BY.find(item => item.filterValue === value)?.value || 'latest'}
      onValueChange={val => {
        const selected = SORT_BY.find(item => item.value === val);
        if (selected) onChange(selected.filterValue as IFilterPublicSites['sortBy']);
      }}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort By</SelectLabel>
          {SORT_BY.map(item => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function FilterSearch({ value, onChange }: { value?: string; onChange: (value: string) => void }) {
  return (
    <Input
      type="text"
      placeholder="Search by name"
      className="w-[180px]"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
    />
  );
}

function FilterTags({ value, onChange }: { value?: string[]; onChange: (value: string[]) => void }) {
  return (
    <ReactSelect
      isMulti
      className="w-[180px]"
      placeholder="Search by tags"
      options={TAGS.map(x => ({ label: x, value: x }))}
      value={value?.map(tag => ({ label: tag, value: tag })) || []}
      onChange={selected => onChange(selected.map(item => item.value))}
    />
  );
}
