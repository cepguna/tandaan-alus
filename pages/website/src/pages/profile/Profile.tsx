import { Separator } from '@extension/ui';
import { Footer } from '@src/components/Footer';
import { Navbar } from '@src/components/Navbar';
import { SidebarNav } from './_components/SidebarNav';
import { Palette, Settings, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { ContentProfile } from './_components/ContentProfile';
import { ContentAccount } from './_components/ContentAccount';
import { ContentAppearance } from './_components/ContentAppearance';

const Profile = () => {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <div style={{ height: 130 }} />
      <div className="custom-container  min-h-screen">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {!location.hash || location.hash === '#profile' ? 'Profile' : null}
            {location.hash === '#account' && 'Account'}
            {location.hash === '#appearance' && 'Appearance'}
          </h1>
          <p className="text-muted-foreground">
            {!location.hash || location.hash === '#profile'
              ? 'Manage your account settings and set e-mail preferences.'
              : null}
            {location.hash === '#account' && 'Update your account settings. Set your preferred language and timezone.'}
            {location.hash === '#appearance' &&
              'Customize the appearance of the app. Automatically switch between day and night themes.'}
          </p>
        </div>
        <Separator className="my-4 lg:my-6" />
        <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12">
          <aside className="top-0 lg:sticky lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex w-full overflow-y-hidden p-1">
            {!location.hash || location.hash === '#profile' ? <ContentProfile /> : null}
            {location.hash === '#account' && <ContentAccount />}
            {location.hash === '#appearance' && <ContentAppearance />}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;

const sidebarNavItems = [
  {
    title: 'Profile',
    icon: <User size={18} />,
    href: '#profile',
  },
  {
    title: 'Account',
    icon: <Settings size={18} />,
    href: '#account',
  },
  {
    title: 'Appearance',
    icon: <Palette size={18} />,
    href: '#appearance',
  },
];
