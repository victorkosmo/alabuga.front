# Sidebar02 Integration Guide

## Installation
```bash
npm install @vueuse/core lucide-vue
```

## Integration Steps

1. **Router Configuration** - Update router routes:
```javascript
// src/router/routes.js
export const mainLayoutRoutes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/pages/DashboardPage.vue'),
    meta: { requiresAuth: true, useInNav: true }
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/pages/TestPage.vue'),
    meta: { requiresAuth: true, useInNav: true }
  }
];
```

2. **Main App Integration** - Replace App.vue content:
```vue
<!-- src/App.vue -->
<script setup>
import SidebarProvider from '@/features/Sidebar02/SidebarProvider.vue';
</script>

<template>
  <SidebarProvider />
</template>
```

3. **Configuration** - Update sidebar config:
```javascript
// src/features/Sidebar02/sidebarConfig.js
export const sidebarConfig = {
  logos: {
    default: '/logos/your-wide-logo.svg',  // Update these paths
    collapsed: '/logos/your-square-logo.svg',
    mobile: '/logos/your-mobile-logo.svg'
  },
  // ... rest of config
};
```

## Important Notes

⚠️ The sidebar uses `src/composables/useLogout.js` which needs customization:
```javascript
// Update these in your useLogout implementation:
// - Authentication API calls
// - Storage handling (localStorage by default)
// - Post-logout redirect logic
// - User store integration
```

## Required Dependencies
- VueUse (@vueuse/core)
- Lucide Vue (lucide-vue)
- Vue Router
