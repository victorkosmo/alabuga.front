<template>
  <div class="relative" @mouseenter="show = true" @mouseleave="show = false">
    <!-- This is the element that triggers the tooltip -->
    <slot></slot>

    <!-- This is the actual tooltip bubble -->
    <div
      v-if="show"
      class="custom-tooltip-body"
    >
      {{ text }}
      <!-- This is the arrow -->
      <div class="custom-tooltip-arrow"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  text: {
    type: String,
    required: true,
  },
});

const show = ref(false);
</script>

<style scoped>
.custom-tooltip-body {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px; /* Space between item and tooltip */
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 50;
}

.custom-tooltip-arrow {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid rgba(0, 0, 0, 0.9); /* This makes the black arrow */
}
</style>
