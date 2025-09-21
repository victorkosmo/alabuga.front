<script setup>
import { ref } from 'vue';
import { useElementHover } from '@vueuse/core';
import SidebarItem from './SidebarItem.vue';
import SidebarLogo from './SidebarLogo.vue';
import ProfileMenu from './ProfileMenu.vue';

const props = defineProps({
  collapsed: Boolean,
  logoHorizontal: String,
  logoSquare: String,
  routes: Array,
  iconMap: Object,
  menuActions: Object,
});

const emit = defineEmits(['toggle']);
const sidebarRef = ref(null);
const isHoveringEdge = useElementHover(sidebarRef);
</script>

<template>
  <div ref="sidebarRef"
       class="fixed top-0 left-0 bottom-0 z-[49] flex flex-col border-r bg-background transition-all duration-300"
       :class="[collapsed ? 'w-[80px]' : 'w-[250px]']">
       
    <div
      class="absolute top-0 right-0 bottom-0 w-2 z-10"
      :style="{
        cursor: collapsed ? 'e-resize' : 'w-resize',
        pointerEvents: 'auto',
      }"
      @click="emit('toggle')"
    ></div>

    <SidebarLogo
      :collapsed="collapsed"
      :logo-horizontal="logoHorizontal"
      :logo-square="logoSquare"
      :is-hovering-edge="isHoveringEdge"
      @toggle="emit('toggle')"
    />

    <div class="flex-1 overflow-visible">
      <nav class="flex flex-col py-1 overflow-visible">
        <SidebarItem
          v-for="route in routes"
          :key="route.path"
          :route="route"
          :collapsed="collapsed"
          :icon="iconMap[route.name] || iconMap._default"
        />
      </nav>
    </div>

    <div class="border-t p-2">
      <ProfileMenu
        :collapsed="collapsed"
        :menu-actions="menuActions"
      />
    </div>
  </div>
</template>
