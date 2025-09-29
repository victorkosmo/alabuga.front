import { mainLayoutRoutes } from '@/router/routes';
import { Home, BriefcaseBusiness, Settings, LogOut, Circle, FileBox, Star, Store } from 'lucide-vue-next';

/**
 * @typedef {Object} SidebarConfig
 * @property {Object} logos - Configuration for sidebar logos
 * @property {string} [logos.default] - Default horizontal logo path
 * @property {string} [logos.mobile] - Mobile logo path
 * @property {string} [logos.collapsed] - Collapsed/square logo path
 * @property {Object[]} navigation - Sidebar navigation items configuration
 * @property {Object} icons - Icon mappings for navigation items
 * @property {Object[]} profileMenu - Profile dropdown menu items configuration
 */

/**
 * Main sidebar configuration
 * @type {SidebarConfig}
 */
export const sidebarConfig = {
  logos: {
    default: '/logos/alabuga-wide.svg',
    collapsed: '/logos/alabuga-square.svg',
    mobile: '/logos/alabuga-wide.svg'
  },
  
  // Navigation items are filtered from routes with useInNav flag
  navigation: mainLayoutRoutes.filter(route => route.meta?.useInNav),
  
  // Icon mapping for navigation items
  icons: {
    'Навыки': FileBox,
    'Настройки': Settings,
    'Кампании': BriefcaseBusiness,
    'Магазин': Store,
    _default: Circle // Fallback icon
  },
  
  // Profile menu items
  profileMenu: [
    {
      label: 'Выход',
      icon: LogOut,
      actionKey: 'logout',
      divider: false
    }
  ]
};

/**
 * Get icon component for route name
 * @param {string} routeName - Name of the route
 * @returns {Component} Icon component
 */
export const getRouteIcon = (routeName) => {
  return sidebarConfig.icons[routeName] || sidebarConfig.icons._default;
};
