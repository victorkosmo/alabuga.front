<script setup>
import { useLogout } from '@/composables/useLogout';
import { useRouter } from 'vue-router';
import SidebarLayout from './SidebarLayout.vue';

const router = useRouter();
const { handleLogout } = useLogout();

const menuActions = {
  logout: handleLogout
};
</script>

<template>
  <SidebarLayout :menu-actions="menuActions" />
</template>
