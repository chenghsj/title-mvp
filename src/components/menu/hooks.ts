import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { camelCase } from 'lodash';
import {
  getCandidateDashboardMenuList,
  getCompanyDashboardMenuList,
  getNavMenuList,
} from '@/config/menu-list';
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

const getTranslationKey = (type: MenuType) => {
  switch (type) {
    case 'nav':
      return 'navbar.navMenuList';
    case 'candidateDashboard':
      return 'navbar.candidateDashboardMenuList';
    case 'companyDashboard':
      return 'navbar.companyDashboardMenuList';
    default:
      throw new Error(`Invalid menu type: ${type}`);
  }
};

const getMenuList = (type: MenuType, pathname: string) => {
  switch (type) {
    case 'nav':
      return getNavMenuList(pathname);
    case 'candidateDashboard':
      return getCandidateDashboardMenuList(pathname);
    case 'companyDashboard':
      return getCompanyDashboardMenuList(pathname);
    default:
      return [];
  }
};

export const useLocalMenuListByType = (type: MenuType) => {
  const tNavbarMenuList = useTranslations(getTranslationKey(type));
  const pathname = usePathname();
  const menuList = getMenuList(type, pathname);

  const returnedMenuList = menuList.map((item) => ({
    ...item,
    menus: item.menus.map((menu) => ({
      ...menu,
      label: tNavbarMenuList(
        menu.submenus.length > 0
          ? `${menu.key}.title`
          : (camelCase(menu.key) as any)
      ),
      submenus: menu.submenus.map((submenu) => ({
        ...submenu,
        label: tNavbarMenuList(`${menu.key}.submenus.${submenu.key}` as any),
      })),
    })),
  }));

  return returnedMenuList;
};
