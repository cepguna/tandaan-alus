import { Routes, Route } from 'react-router-dom';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import Landing from './pages/landing';
import Explore from './pages/explore';
import Profile from './pages/profile';
import MyBookmarks from './pages/my-bookmarks';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/my-bookmarks" element={<MyBookmarks />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default withErrorBoundary(withSuspense(App, <div> Loading ... </div>), <div> Error Occur </div>);
