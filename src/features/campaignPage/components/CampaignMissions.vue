<template>
  <div class="mt-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Миссии</h2>
      <Button @click="$emit('create-mission')">Создать миссию</Button>
    </div>
    <div v-if="missions && missions.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link v-for="mission in missions" :key="mission.id" :to="{ name: 'Миссия', params: { campaignId: campaignId, missionId: mission.id }, query: { type: mission.type } }">
        <Card class="h-full hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle>{{ mission.title }}</CardTitle>
            <CardDescription>{{ mission.description }}</CardDescription>
          </CardHeader>
          <CardContent class="space-y-2">
            <div class="flex items-center">
              <span class="font-semibold">Тип:</span>
              <Badge v-if="mission.type === 'MANUAL_URL'" class="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100/80">
                <component :is="missionTypeConfig.MANUAL_URL.icon" class="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                {{ missionTypeConfig.MANUAL_URL.label }}
              </Badge>
              <Badge v-else-if="mission.type === 'QR_CODE'" class="ml-2 bg-green-100 text-green-800 hover:bg-green-100/80">
                <component :is="missionTypeConfig.QR_CODE.icon" class="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                {{ missionTypeConfig.QR_CODE.label }}
              </Badge>
              <Badge v-else-if="mission.type === 'QUIZ'" class="ml-2 bg-purple-100 text-purple-800 hover:bg-purple-100/80">
                <component :is="missionTypeConfig.QUIZ.icon" class="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                {{ missionTypeConfig.QUIZ.label }}
              </Badge>
              <span v-else class="ml-2">{{ mission.type }}</span>
            </div>
            <div>
              <span class="font-semibold">Награда EXP:</span> {{ mission.experience_reward }}
            </div>
            <div v-if="mission.mana_reward > 0">
              <span class="font-semibold">Награда Mana:</span> {{ mission.mana_reward }}
            </div>
            <div v-if="mission.required_achievement_name">
              <span class="font-semibold">Требуется ачивка:</span> {{ mission.required_achievement_name }}
            </div>
          </CardContent>
        </Card>
      </router-link>
    </div>
    <div v-else>
      <p class="text-muted-foreground">Для этой кампании еще не создано ни одной миссии.</p>
    </div>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { missionTypeConfig } from '@/features/missionPage/missionTypeConfig';

defineProps({
  missions: {
    type: Array,
    required: true,
  },
  campaignId: {
    type: String,
    required: true,
  },
});

defineEmits(['create-mission']);
</script>
