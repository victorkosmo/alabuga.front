// src/router/router.js
import { createRouter, createWebHistory } from 'vue-router';
import { mainLayoutRoutes, authRoutes } from './routes';
import MainLayout from '@/layouts/Sidebar02/SidebarProvider.vue';
import TheErrorPage from '@/pages/error_page/TheErrorPage.vue';
import { authenticationGuard } from './navigationGuards';

const routes = [
    ...authRoutes.map(route => ({
        ...route,
        meta: { ...route.meta, layout: 'blank' }
    })),
    {
        path: '/',
        component: MainLayout,
        children: mainLayoutRoutes
    },
    {
        path: '/:pathMatch(.*)*',
        component: TheErrorPage,
        meta: { layout: 'blank' }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});


router.beforeEach(authenticationGuard);

export default router;
