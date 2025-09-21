<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import SidebarTooltip from './SidebarTooltip.vue';

const props = defineProps({
  route: {
    type: Object,
    required: true,
  },
  collapsed: {
    type: Boolean,
    required: true,
  },
  icon: {
    type: [Object, Function],
    required: true,
  },
});

const router = useRouter();
const route = useRoute();

const isActive = computed(() => {
  return route.path === props.route.path || 
         (props.route.path !== '/' && route.path.startsWith(props.route.path));
});

const handleClick = () => {
  router.push(props.route.path);
};
</script>

<template>
  <SidebarTooltip :collapsed="collapsed">
    <template #trigger>
      <button
        @click="handleClick"
        class="flex items-center w-full px-5 py-5 transition-all duration-200 ease-in-out group"
        :class="[
          isActive 
            ? 'bg-primary/5 border-l-5 border-primary text-primary font-bold' 
            : 'text-muted-foreground hover:bg-muted/50',
          collapsed ? 'justify-center' : 'justify-start pl-4',
        ]"
      >
        <component :is="props.icon" class="h-5 w-5" :class="collapsed ? 'mr-0' : 'mr-3'" />
        <span v-if="!collapsed" class="font-medium">{{ props.route.name }}</span>
      </button>
    </template>
    
    <template #content v-if="collapsed">
      {{ props.route.name }}
    </template>
  </SidebarTooltip>
</template>
