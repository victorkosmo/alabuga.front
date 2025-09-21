<script setup>
import { ref } from 'vue';

const open = ref(false);
defineProps({
  collapsed: {
    type: Boolean,
    required: true
  },
  contentClass: {
    type: String,
    default: "!z-[200] absolute left-full ml-2 px-2 py-1.5 text-[11px] text-white rounded-sm bg-gray-900/90 top-1/2 -translate-y-1/2 shadow-lg after:content-[''] after:absolute after:-left-1 after:top-1/2 after:-translate-y-1/2 after:border-4 after:border-transparent after:border-r-gray-900/90 after:z-[201]"
  }
});
</script>

<template>
  <div 
    class="relative h-full w-full"
    @mouseenter="open = collapsed ? true : false"
    @mouseleave="open = false"
  >
    <slot name="trigger" />
    
    <transition
      enter-active-class="transition-all duration-200 ease-out delay-500"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 translate-x-1"
      enter-to-class="opacity-90 translate-x-0"
      leave-from-class="opacity-90 translate-x-0"
      leave-to-class="opacity-0 translate-x-1"
    >
      <div
        v-if="open && collapsed"
        :class="contentClass"
      >
        <slot name="content" />
      </div>
    </transition>
  </div>
</template>
