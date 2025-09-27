<template>
  <div class="mt-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Ачивки</h2>
      <Button @click="$emit('create-achievement')">Создать ачивку</Button>
    </div>
    <div v-if="isLoading" class="flex justify-center items-center h-40">
      <p>Загрузка ачивок...</p>
    </div>
    <div v-else-if="error" class="text-red-500">
      <p>Не удалось загрузить ачивки: {{ error }}</p>
    </div>
    <div v-else-if="achievements && achievements.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card v-for="achievement in achievements" :key="achievement.id" class="h-full hover:border-primary transition-colors cursor-pointer" @click="$emit('edit-achievement', achievement)">
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
    </div>
    <div v-else>
      <p class="text-muted-foreground">Для этой кампании еще не создано ни одной ачивки.</p>
    </div>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
