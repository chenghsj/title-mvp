import { IoBriefcaseOutline } from 'react-icons/io5';
import { IconType } from 'react-icons/lib';
import { LuFileText, LuSettings, LuUser } from 'react-icons/lu';

type Submenu = {
  key: string;
  href: string;
  label: string;
  active: boolean;
  description?: string;
};

type Menu = {
  key: string;
  href: string;
  label: string;
  active: boolean;
  icon?: IconType;
  submenus: Submenu[];
};

export type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getNavMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: '',
      menus: [
        {
          key: 'about-us',
          href: '/about-us',
          label: 'About us',
          active: pathname.includes('/about-us'),
          // icon: SquarePen,
          submenus: [],
        },
        {
          key: 'services',
          href: '/services',
          label: 'Services',
          active: pathname.includes('/services'),
          // icon: Bookmark,
          submenus: [],
        },
        {
          key: 'contact',
          href: '/contact',
          label: 'Contact',
          active: pathname.includes('/contact'),
          // icon: Tag,
          submenus: [],
        },
        // {
        //   href: '/docs',
        //   label: 'More',
        //   active: pathname.includes('/docs'),
        //   // icon: Tag,
        //   submenus: [
        //     {
        //       href: '/docs/primitives/alert-dialog',
        //       label: 'Alert Dialog',
        //       active: pathname === '/docs/primitives/alert-dialog',
        //       description:
        //         'A modal dialog that interrupts the user with important content and expects a response.',
        //     },
        //     {
        //       href: '/docs/primitives/hover-card',
        //       label: 'Hover Card',
        //       active: pathname === '/docs/primitives/hover-card',
        //       description:
        //         'For sighted users to preview content available behind a link.',
        //     },
        //     {
        //       href: '/docs/primitives/progress',
        //       label: 'Progress',
        //       active: pathname === '/docs/primitives/progress',
        //       description:
        //         'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
        //     },
        //     {
        //       href: '/docs/primitives/scroll-area',
        //       label: 'Scroll-area',
        //       active: pathname === '/docs/primitives/scroll-area',
        //       description: 'Visually or semantically separates content.',
        //     },
        //   ],
        // },
      ],
    },
  ];
}

export function getCandidateDashboardMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: '',
      menus: [
        {
          key: 'profile',
          href: '/candidate/dashboard/profile',
          label: 'Profile',
          active: pathname.includes('/candidate/dashboard/profile'),
          icon: LuUser,
          submenus: [],
        },
        {
          key: 'resume',
          href: '/candidate/dashboard/resume',
          label: 'Resume',
          active: pathname.includes('/candidate/dashboard/resume'),
          icon: LuFileText,
          submenus: [],
        },
        {
          key: 'settings',
          href: '/candidate/dashboard/settings/account',
          label: 'Settings',
          active: pathname.includes('/candidate/dashboard/settings/account'),
          icon: LuSettings,
          submenus: [
            {
              key: 'account',
              href: '/candidate/dashboard/settings/account',
              label: 'Account',
              active: pathname.includes(
                '/candidate/dashboard/settings/account'
              ),
            },
            // {
            //   href: '/candidate/dashboard/settings/billing',
            //   label: 'Billing',
            //   active: pathname.includes('/candidate/dashboard/settings/billing'),
            // },
            // {
            //   key: 'notifications',
            //   href: '/candidate/dashboard/settings/notifications',
            //   label: 'Notifications',
            //   active: pathname.includes(
            //     '/candidate/dashboard/settings/notifications'
            //   ),
            // },
            // {
            //   key: 'security',
            //   href: '/candidate/dashboard/settings/security',
            //   label: 'Security',
            //   active: pathname.includes(
            //     '/candidate/dashboard/settings/security'
            //   ),
            // },
          ],
        },
      ],
    },
  ];
}

export function getCompanyDashboardMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: '',
      menus: [
        {
          key: 'job-management',
          href: '/company/dashboard/job-management',
          label: 'Profile',
          active: pathname.includes('/company/dashboard/job-management'),
          icon: IoBriefcaseOutline,
          submenus: [],
        },
        {
          key: 'settings',
          href: '/company/dashboard/settings/account',
          label: 'Settings',
          active: pathname.includes('/company/dashboard/settings/account'),
          icon: LuSettings,
          submenus: [
            {
              key: 'account',
              href: '/company/dashboard/settings/account',
              label: 'Account',
              active: pathname.includes('/company/dashboard/settings/account'),
            },
          ],
        },
      ],
    },
  ];
}
