import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { getDashboardMenuList, getNavMenuList } from '@/config/menu-list';
import { useDashboardMenu, useNavMenu } from './store';
import { MenuProps, MenuType } from './types';

export const useMenu = (type: MenuProps['type']) => {
  const { isOpen, setIsOpen } = useNavMenu();
  const { isOpen: isDashboardOpen, setIsOpen: setIsDashboardOpen } =
    useDashboardMenu();

  return {
    isOpen: type === 'nav' ? isOpen : isDashboardOpen,
    setIsOpen: type === 'nav' ? setIsOpen : setIsDashboardOpen,
  };
};

export const useLocalMenuListByType = (type: MenuType) => {
  const tNavbarMenuList = useTranslations(
    type === 'nav' ? 'navbar.navMenuList' : 'navbar.dashboardMenuList'
  );
  const pathname = usePathname();
  const menuList =
    type === 'nav' ? getNavMenuList(pathname) : getDashboardMenuList(pathname);

  const returnedMenuList = menuList.map((item) => ({
    ...item,
    menus: item.menus.map((menu) => ({
      ...menu,
      label: tNavbarMenuList(
        menu.submenus.length > 0 ? `${menu.key}.title` : (menu.key as any)
      ),
      submenus: menu.submenus.map((submenu) => ({
        ...submenu,
        label: tNavbarMenuList(`${menu.key}.submenus.${submenu.key}` as any),
      })),
    })),
  }));

  return returnedMenuList;
};
