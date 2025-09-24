// src/router/routes.js

/**
 * @typedef {object} RouteConfig
 * @property {string} path - The path of the route.
 * @property {string} name - The name of the route (for display in navigation).
 * @property {() => Promise<any>} component - A function importing the component. Use dynamic imports (`() => import(...)`).
 * @property {object} meta - Route metadata.
 * @property {boolean} meta.requiresAuth - Whether the route requires authentication.
 * @property {boolean} [meta.useInNav] - (Optional) If true, the route WILL appear in the main navigation. Defaults to `false`.
 *
 * @example
 * // A route that WILL appear in the main navigation:
 * {
 *   path: '/',
 *   name: 'Dashboard',
 *   component: () => import('@/pages/TheDashboardPage.vue'), // Placeholder component
 *   meta: { requiresAuth: true, useInNav: true }
 * }
 *
 * @example
 * // A route that will NOT appear in the main navigation
 * {
 *   path: '/some-hidden-route',
 *   name: 'Hidden Route',
 *   component: () => import('@/pages/TheHiddenPage.vue'), // Placeholder component
 *   meta: { requiresAuth: true } // useInNav defaults to false
 * }
 */

/**
 * Routes to be used within the MainLayout.
 * @type {RouteConfig[]}
 */
export const mainLayoutRoutes = [
    {
        path: '/',
        name: 'Dashboard',
        component: () => import('@/pages/index/TheIndexPage.vue'),
        meta: { requiresAuth: true, useInNav: true }
    },
    {
        path: '/campaigns',
        name: 'Кампании',
        component: () => import('@/features/campaignsPanel/campaignsPanelView.vue'),
        meta: { requiresAuth: true, useInNav: true }
    },
    {
        path: '/campaigns/:id',
        name: 'Кампания',
        component: () => import('@/features/campaignPage/campaignPageView.vue'),
        meta: { requiresAuth: true, useInNav: false }
    },
    {
        path: '/campaigns/:id/missions/:id',
        name: 'Миссия',
        component: () => import('@/features/missionPage/missionPage.vue'),
        meta: { requiresAuth: true, useInNav: false }
    },
    {
        path: '/competencies',
        name: 'Компетенции',
        component: () => import('@/features/competenciesPanel/competenciesPanelView.vue'),
        meta: { requiresAuth: true, useInNav: true }
    }
];

/**
 * Routes related to authentication (usually placed in a separate layout).
 * @type {RouteConfig[]}
 */
export const authRoutes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/pages/login/TheLoginPage.vue'),
        meta: { requiresAuth: false }
    }
];

/**
 * A set of public route paths that do not require authentication.
 * @type {Set<string>}
 */
export const publicRoutes = new Set(['/login']);
