import '@src/Popup.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { useQuery } from 'convex/react';
import { api } from '@extension/backend/convex/_generated/api';
import { Login } from './Login';
import { Button } from '@extension/ui';

const Popup = () => {
  const notes = useQuery(api.sites.getAllSites);

  return (
    <div className={''}>
      <Button>ShadCn Button</Button>
      {JSON.stringify(notes)}
      <Login />
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
