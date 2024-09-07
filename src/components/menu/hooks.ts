import { useDashboardMenu, useNavMenu } from './store';
import { MenuProps } from './types';

export const useMenu = (type: MenuProps['type']) => {
  const { isOpen, setIsOpen } = useNavMenu();
  const { isOpen: isDashboardOpen, setIsOpen: setIsDashboardOpen } =
    useDashboardMenu();

  return {
    isOpen: type === 'nav' ? isOpen : isDashboardOpen,
    setIsOpen: type === 'nav' ? setIsOpen : setIsDashboardOpen,
  };
};
