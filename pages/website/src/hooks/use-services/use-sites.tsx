import { convexQuery, useConvexMutation } from '@convex-dev/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@extension/backend/convex/_generated/api';
import type { Id } from '@extension/backend/convex/_generated/dataModel';

type IFilterPublicSites = {
  search?: string;
  tags?: string[];
  sortBy?: 'most_bookmarked' | 'latest' | 'longest' | 'name_asc' | 'name_desc';
  pageSize?: number;
  cursor?: number;
};

export const useGetAllMySites = (filter?: IFilterPublicSites) => {
  const result = useQuery(convexQuery(api.sites.getAllMySites, { ...filter }));
  return result;
};

export const useGetMostBookmarkedSites = (limit: number) => {
  const result = useQuery(convexQuery(api.sites.getMostBookmarkedPublicSites, { limit }));
  return result;
};

export const useGetLatestPublicSites = (limit: number, filter?: IFilterPublicSites) => {
  const result = useQuery(convexQuery(api.sites.getLatestPublicSites, { limit, ...filter }));
  return result;
};

export const useGetTopUsersByPublicBookmarks = (limit: number) => {
  const result = useQuery(convexQuery(api.sites.getTopUsersByPublicBookmarks, { limit }));
  return result;
};

export const useGetPublicSitesByUserId = (userId: Id<'users'>) => {
  const result = useQuery(convexQuery(api.sites.getPublicSitesByUserId, { userId }));
  return result;
};

export const useGetPublicSitesByUsername = (username: string, filter?: IFilterPublicSites) => {
  const result = useQuery(convexQuery(api.sites.getPublicSitesByUsername, { username, ...filter }));
  return result;
};

export const useGetSitesByLink = (link: string) => {
  const result = useQuery(
    convexQuery(api.sites.getSitesByLink, {
      link: link ?? '',
    }),
  );
  return result;
};

export const useGetSitesById = (id: Id<'sites'>) => {
  const result = useQuery(
    convexQuery(api.sites.getSitesById, {
      id: id ?? '',
    }),
  );
  return result;
};

export const useAddSites = () => {
  const result = useMutation({
    mutationFn: useConvexMutation(api.sites.addSites),
  });
  return result;
};

export const useUpdateSites = () => {
  const result = useMutation({
    mutationFn: useConvexMutation(api.sites.updateSites),
  });
  return result;
};

export const useDeleteSites = () => {
  const result = useMutation({
    mutationFn: useConvexMutation(api.sites.deleteSites),
  });
  return result;
};
