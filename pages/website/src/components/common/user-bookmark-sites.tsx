import type { Doc } from '@extension/backend/convex/_generated/dataModel';
import { BookmarkSiteCard } from './bookmark-site-card';
import { SOCIAL_MEDIA } from '@src/lib/constants/social-media';
import type { Dispatch, SetStateAction } from 'react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ReactSelect } from '@src/components/ui/react-select';

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
import { TAGS } from '@src/lib/constants';

type IFilterPublicSites = {
  search?: string;
  tags?: string[];
  sortBy?: 'most_bookmarked' | 'latest' | 'longest' | 'name_asc' | 'name_desc';
};

type Props = {
  sites: Doc<'sites'>[];
  user?: Doc<'users'>;
  isMine?: boolean;
  isLoading?: boolean;
  hideAddTags?: boolean;
  setFilter: Dispatch<SetStateAction<IFilterPublicSites>>;
  filter: IFilterPublicSites;
};

export const UserBookmarkSites = ({ sites, hideAddTags, isLoading, user, setFilter, filter }: Props) => {
  const socialMedia = useMemo(() => {
    if (user?.urls) {
      return user.urls.map(url => {
        return {
          link: url.link,
          ...SOCIAL_MEDIA.find(x => x.value === url.type),
        };
      });
    }
    return [];
  }, [user?.urls]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div>
          <h2 className="text-2xl font-bold ">{user ? user?.name : 'My'} Bookmarked Sites</h2>
          {socialMedia.length > 0 && (
            <div className="flex items-center gap-4 mt-2">
              {socialMedia.map(sosmed => (
                <Link target="_blank" key={sosmed.link} to={`${sosmed.baseUrl}${sosmed.link}`}>
                  {sosmed.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-start flex-wrap gap-2">
          <FilterSearch value={filter.search} onChange={value => setFilter(prev => ({ ...prev, search: value }))} />
          <FilterTags value={filter.tags} onChange={value => setFilter(prev => ({ ...prev, tags: value }))} />
          <FilterSortBy value={filter.sortBy} onChange={value => setFilter(prev => ({ ...prev, sortBy: value }))} />
        </div>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {new Array(8).fill('').map((_, i) => (
            <BookmarkSiteCard hideAddTags={hideAddTags} isLoading data={undefined} key={i} />
          ))}
        </div>
      ) : sites.length > 0 ? (
        <div className="columns-1 sm:columns-2 gap-4 space-y-4">
          {sites.map(data => (
            <BookmarkSiteCard hideAddTags={hideAddTags} isLoading={isLoading} data={data} key={data._id} />
          ))}
        </div>
      ) : (
        <p className="text-4xl text-center font-bold my-32">Empty</p>
      )}
    </div>
  );
};

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
    <ReactSelect
      isClearable
      className="w-[180px]"
      placeholder="Filter by"
      options={SORT_BY}
      value={SORT_BY.find(item => item.filterValue === value) || null}
      onChange={val => {
        const selected = SORT_BY.find(item => item.value === val?.value);
        if (selected) onChange(selected.filterValue as IFilterPublicSites['sortBy']);
      }}
    />
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
      isClearable
      className="w-[180px]"
      placeholder="Search by tags"
      options={TAGS.map(x => ({ label: x, value: x }))}
      value={value?.map(tag => ({ label: tag, value: tag })) || []}
      onChange={selected => onChange(selected.map(item => item.value))}
    />
  );
}
