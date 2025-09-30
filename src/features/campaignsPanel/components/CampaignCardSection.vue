<template>
  <div class="flex-1">
    <p class="text-sm font-semibold text-muted-foreground mb-2">{{ title }}</p>
    <TooltipProvider :delay-duration="200">
      <div v-if="items && items.length > 0" class="flex items-center -space-x-2">
        <Tooltip v-for="item in items.slice(0, 5)" :key="item.title">
          <TooltipTrigger as-child>
            <div class="relative h-10 w-10 border-2 border-card rounded-full">
              <img v-if="item.image_url" :src="item.image_url" :alt="item.title" class="h-full w-full rounded-full object-cover" />
              <div v-else class="flex h-full w-full items-center justify-center rounded-full bg-muted">
                <component :is="placeholderIcon" class="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{{ item.title }}</p>
          </TooltipContent>
        </Tooltip>
        <div v-if="items.length > 5" class="flex items-center justify-center h-10 w-10 rounded-full bg-muted-foreground/20 text-xs font-medium text-muted-foreground border-2 border-card">
          +{{ items.length - 5 }}
        </div>
      </div>
      <div v-else class="flex items-center text-sm text-muted-foreground/70 p-2 rounded-md bg-muted/50 h-10">
        <component :is="placeholderIcon" class="h-5 w-5 mr-2 flex-shrink-0" />
        <span class="truncate">{{ placeholderText }}</span>
      </div>
    </TooltipProvider>
  </div>
</template>

<script setup>
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

defineProps({
  title: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    default: () => [],
  },
  placeholderIcon: {
    type: Object,
    required: true,
  },
  placeholderText: {
    type: String,
    required: true,
  },
});
</script>
