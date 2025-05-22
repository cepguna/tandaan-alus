import { Separator } from '@extension/ui';
import { DribbbleIcon, GithubIcon, TwitchIcon, TwitterIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from './base';

const footeras = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Explore',
    href: '/explore',
  },
  {
    title: 'Help',
    href: '#',
  },
  {
    title: 'Privacy',
    href: '#',
  },
];

export const Footer = () => {
  return (
    <footer>
      <div className="max-w-screen-xl mx-auto">
        <div className="py-12 flex flex-col justify-start items-center">
          {/* Logo */}
          <Logo />

          <ul className="mt-6 flex items-center gap-4 flex-wrap">
            {footeras.map(({ title, href }) => (
              <li key={title}>
                <Link to={href} className="text-muted-foreground hover:text-foreground font-medium">
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Separator />
        <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
          {/* Copyright */}
          <span className="text-muted-foreground">
            &copy; {new Date().getFullYear()}{' '}
            <a href="/" target="_blank">
              TandaanAlus
            </a>
            . All rights reserved.
          </span>

          <div className="flex items-center gap-5 text-muted-foreground">
            <a href="#" target="_blank">
              <TwitterIcon className="h-5 w-5" />
            </a>
            <a href="#" target="_blank">
              <DribbbleIcon className="h-5 w-5" />
            </a>
            <a href="#" target="_blank">
              <TwitchIcon className="h-5 w-5" />
            </a>
            <a href="#" target="_blank">
              <GithubIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
