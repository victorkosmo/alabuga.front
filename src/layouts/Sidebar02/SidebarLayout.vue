<script setup>
import Sidebar from './components/Sidebar.vue';
import SidebarMobile from './components/SidebarMobile.vue';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ref } from 'vue';
import { sidebarConfig } from './sidebarConfig';

defineProps({
  menuActions: {
    type: Object,
    default: () => ({})
  }
});

const collapsed = ref(true);

const toggleSidebar = () => {
  collapsed.value = !collapsed.value;
};
</script>

<template>
  <TooltipProvider>
    <div class="flex min-h-screen bg-background">
      <!-- Mobile header -->
      <div class="md:hidden h-16 fixed top-0 left-0 right-0 bg-background border-b z-40">
        <SidebarMobile
          :menu-actions="menuActions"
          :routes="sidebarConfig.navigation"
          :icon-map="sidebarConfig.icons"
          :logo-horizontal="sidebarConfig.logos.mobile"
        />
      </div>

      <!-- Desktop Sidebar -->
      <Sidebar
        :collapsed="collapsed"
        class="hidden md:flex"
        :menu-actions="menuActions"
        :routes="sidebarConfig.navigation"
        :icon-map="sidebarConfig.icons"
        :logo-horizontal="sidebarConfig.logos.default"
        :logo-square="sidebarConfig.logos.collapsed"
        @toggle="toggleSidebar"
      />

      <!-- Main Content -->
      <main
        class="flex-1 overflow-auto mt-2 md:mt-4 p-3 md:p-10 transition-margin duration-300 relative z-10"
        :class="[
          collapsed ? 'md:ml-[80px]' : 'md:ml-[250px]',
          'ml-0 md:pt-0 pt-16'
        ]"
      >
        <router-view />
      </main>
    </div>
  </TooltipProvider>
</template>
