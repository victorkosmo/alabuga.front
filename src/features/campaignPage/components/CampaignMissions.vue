<template>
  <div class="mt-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Миссии</h2>
      <Button @click="$emit('create-mission')">Создать миссию</Button>
    </div>
    <div v-if="missions && missions.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link v-for="mission in missions" :key="mission.id" :to="{ name: 'Миссия', params: { id: campaignId, missionId: mission.id }, query: { type: mission.type } }">
        <Card class="h-full hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle>{{ mission.title }}</CardTitle>
            <CardDescription>{{ mission.description }}</CardDescription>
          </CardHeader>
          <CardContent class="space-y-2">
            <div>
              <span class="font-semibold">Тип:</span> {{ mission.type }}
            </div>
            <div>
              <span class="font-semibold">Награда EXP:</span> {{ mission.experience_reward }}
            </div>
            <div v-if="mission.mana_reward > 0">
              <span class="font-semibold">Награда Mana:</span> {{ mission.mana_reward }}
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
