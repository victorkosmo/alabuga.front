<template>
  <Card class="mt-6">
    <CardHeader>
      <CardTitle>Воронка участников</CardTitle>
    </CardHeader>
    <CardContent>
      <div v-if="campaign.stats" class="flex flex-wrap gap-x-6 gap-y-2">
        <div class="flex items-center text-sm text-muted-foreground">
          <UsersIcon class="h-4 w-4 mr-2" />
          <span>Присоединились</span>
          <div class="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-foreground font-medium text-xs">
            {{ campaign.stats.participants_joined ?? 0 }}
          </div>
        </div>
        <div class="flex items-center text-sm text-muted-foreground">
          <StarIcon class="h-4 w-4 mr-2" />
          <span>Выполнили 1+ миссию</span>
          <div class="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-foreground font-medium text-xs">
            {{ campaign.stats.participants_completed_one_mission ?? 0 }}
          </div>
        </div>
        <div class="flex items-center text-sm text-muted-foreground">
          <CrownIcon class="h-4 w-4 mr-2" />
          <span>Завершили кампанию</span>
          <div class="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-foreground font-medium text-xs">
            {{ campaign.stats.participants_completed_all_missions ?? 0 }}
          </div>
        </div>
      </div>
      <div v-else>
        <p class="text-muted-foreground">Статистика по участникам пока недоступна.</p>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersIcon, StarIcon, CrownIcon } from 'lucide-vue-next';

defineProps({
  campaign: {
    type: Object,
    required: true,
  },
});
</script>
