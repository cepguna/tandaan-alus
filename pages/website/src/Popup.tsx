import '@src/Popup.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { useQuery } from 'convex/react';
import { api } from '@extension/backend/convex/_generated/api';
import { Login } from './Login';

const Popup = () => {
  const notes = useQuery(api.sites.getAllSites);

  return (
    <div className={''}>
      {JSON.stringify(notes)}
      <Login />
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
