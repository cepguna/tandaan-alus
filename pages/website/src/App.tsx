import { ConvexReactClient } from 'convex/react';
import { ConvexAuthProvider } from '@convex-dev/auth/react';
import '@src/index.css';
import { CONVEX_URL } from '@extension/env';
import { RouterProvider } from 'react-router-dom';
import { ConvexQueryClient } from '@convex-dev/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/theme-context';
import { AuthProvider } from './contexts/auth-context';
import { ModalAlertProvider } from './contexts/modal-alert-context';
import { Toaster } from './components/ui/sonner';
import RootRouter from './routes/root';
import { HelmetProvider } from 'react-helmet-async';
const convexUrl = import.meta.env.VITE_CONVEX_URL ?? CONVEX_URL;
const convex = new ConvexReactClient(convexUrl as string);

const convexQueryClient = new ConvexQueryClient(convex);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
    },
  },
});
convexQueryClient.connect(queryClient);

export default function App() {
  return (
    <ConvexAuthProvider client={convex}>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <AuthProvider>
              <ModalAlertProvider>
                <RouterProvider router={RootRouter} />
              </ModalAlertProvider>
            </AuthProvider>
            <Toaster duration={6000} />
          </ThemeProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </ConvexAuthProvider>
  );
}
