import { useAuthActions } from '@convex-dev/auth/react';
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@extension/backend/convex/_generated/api';
import { Badge } from '@extension/ui';

export const User = () => {
  const { signOut } = useAuthActions();
  const user = useQuery(api.user.me);
  const addSite = useMutation(api.sites.addSites);
  const checkSiteByLink = useMutation(api.sites.checkSitesByLink);
  const [isBlacklist, setIsBlackList] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);
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

  const [isSiteChecked, setIsSiteChecked] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    checkSite();
  }, [checkSite]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge
          className="cursor-pointer"
          onClick={() => setIsPrivate(true)}
          variant={isPrivate ? 'default' : 'outline'}>
          Private EEE
        </Badge>
        <Badge
          className="cursor-pointer"
          onClick={() => setIsPrivate(false)}
          variant={!isPrivate ? 'default' : 'outline'}>
          Public
        </Badge>
      </div>
      <div className="text-center">
        <p className="">{user?.email ?? 'No email'}</p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => signOut()}
          className="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-600"
          disabled={isLoading}>
          Sign Out
        </button>
        {!isBlacklist && (
          <button
            onClick={handleBookmark}
            className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-green-300"
            disabled={isLoading}>
            {isSiteChecked ? 'Bookmarked' : 'Bookmark'}
          </button>
        )}
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
};
