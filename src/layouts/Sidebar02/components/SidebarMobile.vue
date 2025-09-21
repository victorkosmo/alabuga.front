<script setup>
import { Menu } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import SidebarItem from './SidebarItem.vue';
import SidebarLogo from './SidebarLogo.vue';
import ProfileMenu from './ProfileMenu.vue';

defineProps({
  routes: Array,
  iconMap: Object,
  logoHorizontal: String,
  menuActions: Object,
});
</script>

<template>
  <div class="md:hidden w-full h-full px-4 flex items-center justify-between gap-4">
    <ProfileMenu
      :collapsed="false"
      :is-mobile="true"
      :menu-actions="menuActions"
    />
    
    <Sheet>
      <SheetTrigger as-child>
        <Button variant="outline" size="icon" class="p-4">
          <Menu class="h-5 w-5" />
          <span class="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" class="z-100 flex flex-col">
        <SidebarLogo
          :collapsed="false"
          :logo-horizontal="logoHorizontal"
        />
        
        <nav class="flex flex-col space-y-2 py-2">
          <SidebarItem
            v-for="route in routes"
            :key="route.path"
            :route="route"
            :collapsed="false"
            :icon="iconMap[route.name] || iconMap._default"
          />
        </nav>
      </SheetContent>
    </Sheet>
  </div>
</template>
