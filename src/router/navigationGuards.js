// src/router/navigationGuards.js
import { getLocalStorageKey } from '@/utils/localStorage';
import { useUserStore } from '@/stores/user';
import { publicRoutes } from './routes';


/**
 * Global navigation guard for authentication and authorization.
 *
 * This guard checks for a JWT in local storage and validates user access
 * based on route metadata.  It handles redirection to login for protected
 * routes and prevents logged-in users from accessing public authentication routes.
 *
 * @param {RouteLocationNormalized} to - The target route being navigated to.
 * @param {RouteLocationNormalized} from - The current route being navigated from.
 * @param {NavigationGuardNext} next - The function to resolve the navigation.
 * @returns {Promise<void>}
 */
export async function authenticationGuard(to, from, next) {
    const jwt = getLocalStorageKey('access');
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

    // Initialize user store
    const userStore = useUserStore();

    // Decode JWT
    if (jwt) {
        try {
            if (!userStore.id) {
                userStore.setUserFromToken();
            }
        } catch (error) {
            console.error("JWT decode error:", error);
            localStorage.removeItem('access');
            userStore.clearUser();
            return next('/login');
        }
    }

    // No token and route requires auth
    if (requiresAuth && !jwt) {
        return next('/login');
    }

    // If user is logged in and tries to access login page, redirect to home
    if (jwt && publicRoutes.has(to.path)) {
        return next('/');
    }

    // No token but route doesn't require auth, or token exists and route is not auth
    return next();
}
