<script setup>
import { ChevronLeft } from 'lucide-vue-next';
import { computed } from 'vue';

defineProps({
  collapsed: Boolean,
  isVisible: Boolean
});

const emit = defineEmits(['toggle']);
</script>

<template>
  <button
    @click="emit('toggle')"
    class="z-20 flex h-6 w-6 items-center justify-center rounded-full bg-background border shadow-md transition-all duration-200 hover:bg-primary hover:text-primary-foreground transform -translate-y-1/2"
    :class="[
      'cursor-pointer',
      {'opacity-0 pointer-events-none': !isVisible},
      '-right-3'
    ]"
  >
    <ChevronLeft class="h-4 w-4 transition-transform" :class="{ 'rotate-180': collapsed }" />
    <span class="sr-only">Toggle sidebar</span>
  </button>
</template>
