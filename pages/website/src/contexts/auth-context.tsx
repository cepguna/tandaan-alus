import type { Doc } from '@extension/backend/convex/_generated/dataModel';
import { useGetMe } from '@src/hooks/use-services/use-user';
import type React from 'react';
import { createContext, useContext, useMemo } from 'react';

type State = {
  me?: Doc<'users'>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<State | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: dataMe, isPending } = useGetMe();
  const value = useMemo(() => {
    return {
      me: dataMe ?? undefined,
      isAuthenticated: Boolean(dataMe),
    };
  }, [dataMe]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) throw new Error('useAuth must be used within a AuthProvider');

  return context;
};
