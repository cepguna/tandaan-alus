import {
  Button,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  Sheet,
  SheetContent,
  SheetTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Card,
} from '@extension/ui';
import { ThemeSwitcher } from '../ui/theme-switcher';
import useModal from '@src/hooks/use-modal';
import { Authenticated, Unauthenticated } from 'convex/react';
import { LogOut, Menu, Palette, User } from 'lucide-react';
import { useAuthActions } from '@convex-dev/auth/react';
import { useModalAlert } from '@src/contexts/modal-alert-context';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from './logo';
import { ModalAuthentication } from '@src/features/auth/components';
import { URL } from '@src/lib/constants';
import { get2DigitName } from '@src/lib/utils/transform-text';
import { useGetMe } from '@src/hooks/use-services/use-user';

export const Navbar = () => {
  const { isOpen, onOpen, onClose } = useModal();
  return (
    <>
      <nav className="fixed top-6 z-50 inset-x-4 h-16 bg-background border dark:border-slate-700/70 max-w-screen-xl mx-auto rounded-full">
        <div className="h-full flex items-center justify-between mx-auto px-4">
          <Authenticated>
            <Link to={URL.DASHBOARD}>
              <Logo />
            </Link>
          </Authenticated>
          <Unauthenticated>
            <Link to={URL.HOME}>
              <Logo />
            </Link>
          </Unauthenticated>

          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />

          <div className="items-center gap-3 hidden md:flex">
            <ThemeSwitcher />
            <Unauthenticated>
              <Button onClick={onOpen} className="rounded-full">
                Log In
              </Button>
            </Unauthenticated>
            <Authenticated>
              <UserMenu />
            </Authenticated>
          </div>
          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeSwitcher />
            <Authenticated>
              <UserMenu />
            </Authenticated>
            <NavigationSheet />
          </div>
        </div>
      </nav>
      <ModalAuthentication isOpen={isOpen} onClose={onClose} />
    </>
  );
};

const UserMenu = () => {
  const navigate = useNavigate();
  const { data } = useGetMe();
  const { signOut } = useAuthActions();
  const { openModalAlert, closeModalAlert } = useModalAlert();

  const handleLogout = () => {
    openModalAlert({
      title: 'Logout',
      desc: 'Are you sure want to logout?',
      labelYes: 'Logout',
      labelClose: 'Cancel',
      onSubmit: async () => {
        await signOut();
        navigate(URL.HOME);
        closeModalAlert();
      },
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Card className="rounded-full flex items-center gap-2 px-4 py-2 shadow-none cursor-pointer" role="button">
          <span className="text-xs font-bold">{data?.name ?? 'Anonymous'}</span>
          <Avatar className="w-6 h-6">
            <AvatarImage src={data?.image} alt={data?.name} />
            <AvatarFallback>{get2DigitName(data?.name)}</AvatarFallback>
          </Avatar>
        </Card>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to={'/profile'}>
            <DropdownMenuItem>
              <User />
              <span>Profile</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link to={'/profile#appearance'}>
            <DropdownMenuItem>
              <Palette />
              <span>Appearance</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const NavMenu = (props: any) => (
  <NavigationMenu {...props}>
    <NavigationMenuList className="gap-6 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
      <Authenticated>
        <NavigationMenuItem className={location.pathname.includes('dashboard') ? 'font-semibold' : ''}>
          <NavigationMenuLink asChild>
            <Link to={URL.DASHBOARD}>Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </Authenticated>
      <Unauthenticated>
        <NavigationMenuItem className={location.pathname === '/' ? 'font-semibold' : ''}>
          <NavigationMenuLink asChild>
            <Link to={URL.HOME}>Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </Unauthenticated>
      <NavigationMenuItem className={location.pathname.includes('explore') ? 'font-semibold' : ''}>
        <NavigationMenuLink asChild>
          <Link to={URL.EXPLORE}>Explore</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <Authenticated>
        <NavigationMenuItem
          className={location.pathname.includes(URL.PROFILE.replaceAll('/', '')) ? 'font-semibold' : ''}>
          <NavigationMenuLink asChild>
            <Link to={URL.PROFILE}>Profile</Link>
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
