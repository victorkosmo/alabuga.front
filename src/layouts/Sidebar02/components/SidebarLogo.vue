<script setup>
import SidebarToggle from './SidebarToggle.vue';

defineProps({
  collapsed: Boolean,
  logoHorizontal: String,
  logoSquare: String,
  isHoveringEdge: Boolean
});

const emit = defineEmits(['toggle']);
</script>

<template>
  <div class="relative flex items-center justify-center h-16 shrink-0 mt-2"
       :class="collapsed ? 'w-[80px]' : 'w-[250px]'">
    <template v-if="!collapsed">
      <img v-if="logoHorizontal" 
           :src="logoHorizontal" 
           alt="Logo"
           class="h-14 max-w-[220px] object-contain">
    </template>
    <template v-else>
      <img v-if="logoSquare" 
           :src="logoSquare" 
           alt="Logo"
           class="h-9 w-9 object-contain">
    </template>
    
    <SidebarToggle
      :collapsed="collapsed"
      :is-visible="collapsed || isHoveringEdge"
      class="absolute -right-3 top-1/2"
      @toggle="emit('toggle')"
    />
  </div>
</template>
