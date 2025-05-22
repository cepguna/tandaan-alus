import {
  Button,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@extension/ui';
import { ThemeSwitcher } from './elements/ThemeSwitcher';
import { ModalAuthentication } from './modals';
import useModal from '@src/hooks/useModal';
import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';
import { LoaderIcon, Menu } from 'lucide-react';
import { useAuthActions } from '@convex-dev/auth/react';
import { useModalAlert } from '@src/contexts/ModalAlertContext';
import { Link } from 'react-router-dom';
import { Logo } from './base';

export const Navbar = () => {
  const { signOut } = useAuthActions();
  const { openModalAlert, closeModalAlert } = useModalAlert();
  const { isOpen, onOpen, onClose } = useModal();
  const handleLogout = () => {
    openModalAlert({
      title: 'Logout',
      desc: 'Are you sure want to logout?',
      labelYes: 'Logout',
      labelClose: 'Cancel',
      onSubmit: async () => {
        await signOut();
        closeModalAlert();
      },
    });
  };
  return (
    <>
      <nav className="fixed top-6 z-50 inset-x-4 h-16 bg-background border dark:border-slate-700/70 max-w-screen-xl mx-auto rounded-full">
        <div className="h-full flex items-center justify-between mx-auto px-4">
          <Link to={'/'}>
            <Logo />
          </Link>

          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />

          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <Unauthenticated>
              <Button onClick={onOpen} variant="outline" className="hidden sm:inline-flex rounded-full">
                Sign In
              </Button>
              <Button onClick={onOpen} className="rounded-full">
                Sign Up
              </Button>
            </Unauthenticated>
            <Authenticated>
              <Link to={'/profile'}>
                <Button className="rounded-full">Profile</Button>
              </Link>
              <Button onClick={handleLogout} className="rounded-full" variant={'destructive'}>
                Sign Out
              </Button>
            </Authenticated>
            <AuthLoading>
              <LoaderIcon className="animate-spin" />
            </AuthLoading>
          </div>
          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </nav>
      <ModalAuthentication isOpen={isOpen} onClose={onClose} />
    </>
  );
};

const NavMenu = (props: any) => (
  <NavigationMenu {...props}>
    <NavigationMenuList className="gap-6 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link to="/">Home</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link to="/explore">Explore</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <Authenticated>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/my-bookmarks">My Bookmarks</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </Authenticated>
    </NavigationMenuList>
  </NavigationMenu>
);

export const NavigationSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <Link to={'/'}>
          <Logo />
        </Link>
        <NavMenu orientation="vertical" className="mt-12" />
      </SheetContent>
    </Sheet>
  );
};
