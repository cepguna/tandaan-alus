import { useAuthActions } from '@convex-dev/auth/react';
import { useState, useEffect, useCallback } from 'react';
import { Authenticated, Unauthenticated, AuthLoading, useQuery, useMutation } from 'convex/react';
import { api } from '@extension/backend/convex/_generated/api';

interface LoginFormData {
  email: string;
  password: string;
  flow: 'signIn' | 'signUp';
}

export const Login = () => {
  const { signIn, signOut } = useAuthActions();
  const user = useQuery(api.user.me);
  const addSite = useMutation(api.sites.addSites);
  const checkSiteByLink = useMutation(api.sites.checkSitesByLink);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    flow: 'signIn',
  });
  const [isSiteChecked, setIsSiteChecked] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if current site is bookmarked
  const checkSite = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });
      if (tab.url) {
        const result = await checkSiteByLink({ link: tab.url });
        setIsSiteChecked(!!result);
      } else {
        setIsSiteChecked(false);
      }
    } catch (err) {
      setError('Failed to check site');
    } finally {
      setIsLoading(false);
    }
  }, [user, checkSiteByLink]);

  // Handle bookmark action
  const handleBookmark = useCallback(async () => {
    setIsLoading(true);
    try {
      const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });
      await addSite({
        link: tab.url ?? '',
        title: tab.title ?? '',
        isPrivate: false,
      });
      setIsSiteChecked(true);
    } catch (err) {
      setError('Failed to bookmark site');
    } finally {
      setIsLoading(false);
    }
  }, [addSite]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await signIn('password', formData);
    } catch (err) {
      setError(`Failed to ${formData.flow === 'signIn' ? 'sign in' : 'sign up'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Toggle sign in/up
  const toggleFlow = () => {
    setFormData(prev => ({ ...prev, flow: prev.flow === 'sign  signIn' ? 'signUp' : 'signIn' }));
  };

  // Check site when user changes
  useEffect(() => {
    checkSite();
  }, [checkSite]);

  return (
    <div className="min-w-[300px] p-4">
      <AuthLoading>
        <div className="text-center text-gray-500">Loading...</div>
      </AuthLoading>

      <Unauthenticated>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              disabled={isLoading}
              required
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              disabled={isLoading}
              required
            />
          </div>
          <input name="flow" type="hidden" value={formData.flow} />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
              disabled={isLoading}>
              {formData.flow === 'signIn' ? 'Sign In' : 'Sign Up'}
            </button>
            <button
              type="button"
              onClick={toggleFlow}
              className="flex-1 bg-gray-200 p-2 rounded hover:bg-gray-300"
              disabled={isLoading}>
              {formData.flow === 'signIn' ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </form>
      </Unauthenticated>

      <Authenticated>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-gray-700">{user?.email ?? 'No email'}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => signOut()}
              className="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-600"
              disabled={isLoading}>
              Sign Out
            </button>
            <button
              onClick={handleBookmark}
              className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-green-300"
              disabled={isLoading}>
              {isSiteChecked ? 'Bookmarked' : 'Bookmark'}
            </button>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>
      </Authenticated>
    </div>
  );
};
