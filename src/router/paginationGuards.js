// src/router/paginationGuards.js

/**
 *  Placeholder for Pagination Guards
 * @param {RouteLocationNormalized} to 
 * @param {RouteLocationNormalized} from 
 * @param {NavigationGuardNext} next 
 */
export function cardsPaginationGuard(to, from, next) {
    // Validate page number for Cards route
    if (to.name === 'Cards') {
        const page = parseInt(to.query.page) || 1
        if (page < 1 || isNaN(page)) {
            return next({ ...to, query: { ...to.query, page: 1 } })
        }
    }
    next(); // added for preventing no-unused-vars
}

