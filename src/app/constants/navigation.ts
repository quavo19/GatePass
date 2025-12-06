import { UserRole, NavigationItem } from '../interfaces/api.interface';
import { IconName } from './icons';

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: 'Check-In',
    route: '/check-in',
    roles: ['User', 'Admin'],
    icon: IconName.CheckIn,
  },
  {
    label: 'Check-Out',
    route: '/check-out',
    roles: ['User', 'Admin'],
    icon: IconName.CheckOut,
  },
  {
    label: 'Dashboard',
    route: '/dashboard',
    roles: ['Admin'],
    icon: IconName.Dashboard,
  },
  {
    label: 'Visitors List',
    route: '/visitors',
    roles: ['Admin'],
    icon: IconName.Users,
  },
];
