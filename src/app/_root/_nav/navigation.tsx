'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { getNavMenuList } from '@/config/menu-list';

type Props = {};

export function Navigation({}: Props) {
  const pathname = usePathname();
  const menuList = getNavMenuList(pathname);
  return (
    <NavigationMenu className='hidden font-roboto md:flex'>
      <NavigationMenuList>
        {menuList.map(({ menus }, index) => (
          <React.Fragment key={index}>
            {menus.map((menu, index) =>
              menu.submenus.length > 0 ? (
                <NavigationMenuItem key={index}>
                  <Button variant={menu.active ? 'secondary' : 'ghost'} asChild>
                    <NavigationMenuTrigger>More</NavigationMenuTrigger>
                  </Button>
                  <NavigationMenuContent>
                    <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2'>
                      {menu.submenus.map((submenu, index) => (
                        <ListItem
                          key={index}
                          title={submenu.label}
                          href={submenu.href}
                          active={submenu.active}
                        >
                          {submenu.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={index}>
                  <Button asChild variant={menu.active ? 'secondary' : 'ghost'}>
                    <Link href={menu.href}>{menu.label}</Link>
                  </Button>
                </NavigationMenuItem>
              )
            )}
          </React.Fragment>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { active?: boolean }
>(({ className, title, children, active, href, ...props }, ref) => {
  return (
    <li>
      <Button
        asChild
        variant={active ? 'secondary' : 'ghost'}
        className='grid h-fit grid-flow-row gap-1 whitespace-pre-wrap p-3'
      >
        <Link ref={ref} href={href as string} {...props}>
          <div className='text-sm font-medium leading-none'>{title}</div>
          <p className='line-clamp-2 text-sm font-normal leading-snug text-muted-foreground'>
            {children}
          </p>
        </Link>
      </Button>
    </li>
  );
});
ListItem.displayName = 'ListItem';
