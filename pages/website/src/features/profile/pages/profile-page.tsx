import { Alert, AlertDescription, AlertTitle, Separator } from '@extension/ui';
import { Info, Palette, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { AccountSection, AppearanceSection, ProfileSection, ProfileSidebar } from '../components';
import { useGetMe } from '@src/hooks/use-services/use-user';

const Profile = () => {
  const { data } = useGetMe();
  const location = useLocation();
  return (
    <div className="custom-container  min-h-screen">
      <div className="flex justify-between gap-2 flex-wrap">
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
        {!data?.username && (
          <Alert className="w-[400px]" variant={'destructive'}>
            <Info className="h-4 w-4" />
            <AlertTitle>Complete Your Profile</AlertTitle>
            <AlertDescription>
              Fill out your profile to choose between a public or private account status
            </AlertDescription>
          </Alert>
        )}
      </div>
      <Separator className="my-4 lg:my-6" />
      <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12">
        <aside className="top-0 lg:sticky lg:w-1/5">
          <ProfileSidebar items={sidebarNavItems} />
        </aside>
        <div className="flex w-full overflow-y-hidden p-1">
          {!location.hash || location.hash === '#profile' ? <ProfileSection /> : null}
          {location.hash === '#account' && <AccountSection />}
          {location.hash === '#appearance' && <AppearanceSection />}
        </div>
      </div>
    </div>
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
    title: 'Appearance',
    icon: <Palette size={18} />,
    href: '#appearance',
  },
];
