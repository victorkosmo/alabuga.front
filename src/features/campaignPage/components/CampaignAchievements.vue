<template>
  <CampaignSection
    title="Ачивки"
    :items="achievements"
    :is-loading="isLoading"
    loading-text="Загрузка ачивок..."
    :error="error ? `Не удалось загрузить ачивки: ${error}` : null"
    empty-text="Для этой кампании еще не создано ни одной ачивки."
    @create="$emit('create-achievement')"
  >
    <template #item="{ item: achievement }">
      <Card class="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] h-full hover:border-primary transition-colors cursor-pointer" @click="$emit('edit-achievement', achievement)">
        <CardHeader>
          <CardTitle>{{ achievement.name }}</CardTitle>
          <CardDescription>{{ achievement.description }}</CardDescription>
        </CardHeader>
        <CardContent class="space-y-2">
          <img v-if="achievement.image_url" :src="achievement.image_url" :alt="achievement.name" class="w-20 h-20 object-cover rounded-md">
          <div v-if="achievement.mana_reward > 0">
            <span class="font-semibold">Награда Mana:</span> {{ achievement.mana_reward }}
          </div>
          <div v-if="achievement.unlock_conditions?.required_missions?.length > 0">
            <span class="font-semibold">Требуемые миссии:</span>
            <ul class="list-disc list-inside text-sm">
              <li v-for="missionId in achievement.unlock_conditions.required_missions" :key="missionId">
                {{ getMissionName(missionId) }}
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </template>
  </CampaignSection>
</template>

<script setup>
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CampaignSection from './CampaignSection.vue';

const props = defineProps({
  achievements: {
    type: Array,
    required: true,
  },
  missions: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
});

defineEmits(['create-achievement', 'edit-achievement']);

const getMissionName = (missionId) => {
  if (!missionId || !props.missions) return 'Неизвестная миссия';
  const mission = props.missions.find(m => m.id === missionId);
  return mission ? mission.title : 'Неизвестная миссия';
};
</script>
