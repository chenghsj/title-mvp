import { IconType } from 'react-icons/lib';
import { LuFileText, LuSettings, LuUser } from 'react-icons/lu';

type Submenu = {
  href: string;
  label: string;
  active: boolean;
  description?: string;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon?: IconType;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getNavMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: '/about-us',
          label: 'About us',
          active: pathname.includes('/about-us'),
          // icon: SquarePen,
          submenus: [],
        },
        {
          href: '/services',
          label: 'Services',
          active: pathname.includes('/services'),
          // icon: Bookmark,
          submenus: [],
        },
        {
          href: '/contact',
          label: 'Contact',
          active: pathname.includes('/contact'),
          // icon: Tag,
          submenus: [],
        },
        {
          href: '/docs',
          label: 'More',
          active: pathname.includes('/docs'),
          // icon: Tag,
          submenus: [
            {
              href: '/docs/primitives/alert-dialog',
              label: 'Alert Dialog',
              active: pathname === '/docs/primitives/alert-dialog',
              description:
                'A modal dialog that interrupts the user with important content and expects a response.',
            },
            {
              href: '/docs/primitives/hover-card',
              label: 'Hover Card',
              active: pathname === '/docs/primitives/hover-card',
              description:
                'For sighted users to preview content available behind a link.',
            },
            {
              href: '/docs/primitives/progress',
              label: 'Progress',
              active: pathname === '/docs/primitives/progress',
              description:
                'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
            },
            {
              href: '/docs/primitives/scroll-area',
              label: 'Scroll-area',
              active: pathname === '/docs/primitives/scroll-area',
              description: 'Visually or semantically separates content.',
            },
          ],
        },
      ],
    },
  ];
}

export function getDashboardMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: '/dashboard/profile',
          label: 'Profile',
          active: pathname.includes('/dashboard/profile'),
          icon: LuUser,
          submenus: [],
        },
        {
          href: '/dashboard/resume',
          label: 'Resume',
          active: pathname.includes('/dashboard/resume'),
          icon: LuFileText,
          submenus: [],
        },
        {
          href: '/dashboard/settings/account',
          label: 'Settings',
          active: pathname.includes('/dashboard/settings/account'),
          icon: LuSettings,
          submenus: [
            {
              href: '/dashboard/settings/account',
              label: 'Account',
              active: pathname.includes('/dashboard/settings/account'),
            },
            // {
            //   href: '/dashboard/settings/billing',
            //   label: 'Billing',
            //   active: pathname.includes('/dashboard/settings/billing'),
            // },
            {
              href: '/dashboard/settings/notifications',
              label: 'Notifications',
              active: pathname.includes('/dashboard/settings/notifications'),
            },
            {
              href: '/dashboard/settings/security',
              label: 'Security',
              active: pathname.includes('/dashboard/settings/security'),
            },
          ],
        },
      ],
    },
  ];
}
