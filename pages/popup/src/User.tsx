import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@extension/backend/convex/_generated/api';
import { Badge, Button } from '@extension/ui';
import type { Doc } from '@extension/backend/convex/_generated/dataModel';

export const User = () => {
  const user = useQuery(api.user.me);
  const addSite = useMutation(api.sites.addSites);
  const removeSite = useMutation(api.sites.removeSites);
  const checkSiteByLink = useMutation(api.sites.checkSitesByLink);
  const [currentSite, setCurrentSite] = useState<Doc<'sites'> | undefined>(undefined);
  const updateSite = useMutation(api.sites.updateSites);
  const [isBlacklist, setIsBlackList] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSiteChecked, setIsSiteChecked] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Handle bookmark action
  const handleBookmark = async () => {
    setIsLoading(true);
    try {
      const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });
      const dataAdd = {
        link: tab.url ?? '',
        title: tab.title ?? '',
        isPrivate: isPrivate,
      };
      await addSite(dataAdd);
      setIsSiteChecked(true);
    } catch {
      setError('Failed to bookmark site');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!currentSite) return null;
    setIsLoading(true);
    try {
      await updateSite({
        id: currentSite._id,
        tags: currentSite?.tags ?? [],
        description: currentSite.description,
        isPrivate: isPrivate,
      });
    } catch {
      setError('Failed to update status site');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSite = async () => {
    if (!currentSite) return null;
    setIsLoading(true);
    try {
      await removeSite({
        siteId: currentSite._id,
      });
    } catch {
      setError('Failed to update status site');
    } finally {
      setCurrentSite(undefined);
      setIsPrivate(false);
      setIsSiteChecked(false);
      setIsLoading(false);
    }
  };

  // Check if current site is bookmarked
  const checkSite = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });
      if (tab.url?.includes('localhost')) {
        setIsBlackList(true);
      } else {
        setIsBlackList(false);
      }
      if (tab.url) {
        const result = await checkSiteByLink({ link: tab.url });
        if (result) {
          setCurrentSite(result);
          setIsPrivate(result.isPrivate);
        }
        setIsSiteChecked(!!result);
      } else {
        setIsSiteChecked(false);
      }
    } catch {
      setError('Failed to check site');
    } finally {
      setIsLoading(false);
    }
  }, [user, checkSiteByLink]);

  const goToProfile = () => chrome.tabs.create({ url: 'http://localhost:3000/profile' });

  useEffect(() => {
    checkSite();
  }, [checkSite]);

  return (
    <div className="space-y-4">
      <div className="" onClick={goToProfile}>
        <p className="font-bold text-lg">{user?.name ?? 'Anonymous'}</p>
        <p className="opacity-50 text-xs">{user?.username ? `@${user.username}` : 'Username has not been set'}</p>
      </div>
      <div className="">
        {!isBlacklist && (
          <>
            <p className="text-base">{isSiteChecked ? 'Already save this site' : 'Save this site'}</p>
            <p className="text-sm opacity-50 mb-2">Status</p>
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <Badge
                className="cursor-pointer"
                onClick={() => setIsPrivate(false)}
                variant={!isPrivate ? 'default' : 'secondary'}>
                Public
                {!isPrivate && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-check ml-1">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M5 12l5 5l10 -10" />
                  </svg>
                )}
              </Badge>
              <Badge
                className="cursor-pointer"
                onClick={() => setIsPrivate(true)}
                variant={isPrivate ? 'default' : 'secondary'}>
                Private
                {isPrivate && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-check ml-1">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M5 12l5 5l10 -10" />
                  </svg>
                )}
              </Badge>
            </div>
            {isSiteChecked && (
              <Button className="w-full mb-1" onClick={handleUpdateStatus} disabled={isLoading} variant={'secondary'}>
                Update Status
              </Button>
            )}
            <Button
              className="w-full"
              onClick={isSiteChecked ? handleRemoveSite : handleBookmark}
              disabled={isLoading}
              variant={isSiteChecked ? 'default' : 'secondary'}>
              {isSiteChecked ? 'Remove Bookmark' : 'Bookmark'}
            </Button>
          </>
        )}
      </div>
      {error && <div className="text-red-500 text-sm bg-white z-50 relative">{error}</div>}
    </div>
  );
};
