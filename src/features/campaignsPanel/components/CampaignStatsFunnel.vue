<template>
  <div>
    <p class="text-sm font-semibold text-muted-foreground mb-2">Воронка участников</p>
    <div class="space-y-2">
      <div class="flex items-center justify-between text-sm">
        <div class="flex items-center">
          <UsersIcon class="h-4 w-4 mr-2 text-muted-foreground" />
          <span>Присоединились</span>
        </div>
        <span class="font-medium">{{ stats.participants_joined ?? 0 }}</span>
      </div>
      <div class="flex items-center justify-between text-sm">
        <div class="flex items-center">
          <StarIcon class="h-4 w-4 mr-2 text-muted-foreground" />
          <span>Выполнили 1+ миссию</span>
        </div>
        <span class="font-medium">{{ stats.participants_completed_one_mission ?? 0 }}</span>
      </div>
      <div class="flex items-center justify-between text-sm">
        <div class="flex items-center">
          <CrownIcon class="h-4 w-4 mr-2 text-muted-foreground" />
          <span>Завершили кампанию</span>
        </div>
        <span class="font-medium">{{ stats.participants_completed_all_missions ?? 0 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { UsersIcon, StarIcon, CrownIcon } from 'lucide-vue-next';

defineProps({
  stats: {
    type: Object,
    required: true,
    default: () => ({
      participants_joined: 0,
      participants_completed_one_mission: 0,
      participants_completed_all_missions: 0,
    }),
  },
});
</script>
