<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div v-if="isLoading" class="space-y-4">
      <div class="flex items-center gap-4">
        <Skeleton class="h-8 w-8" />
        <Skeleton class="h-10 w-1/2" />
      </div>
      <Skeleton class="h-8 w-3/4" />
      <div class="mt-6 grid gap-6">
        <Skeleton class="h-48 w-full" />
        <Skeleton class="h-32 w-full" />
      </div>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <h2 class="text-xl font-semibold">Не удалось загрузить миссию</h2>
      <p class="text-muted-foreground">{{ error }}</p>
      <Button @click="fetchMission" class="mt-4">Попробовать снова</Button>
    </div>

    <div v-else-if="mission">
      <header class="mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <Button variant="ghost" size="icon" @click="router.back()" class="h-8 w-8">
              <ArrowLeft class="h-5 w-5" />
            </Button>
            <h1 class="text-3xl font-bold">{{ mission.title }}</h1>
          </div>
        </div>
        <p class="text-muted-foreground mt-1 ml-12">{{ mission.description }}</p>
      </header>

      <div class="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Задание</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground mb-4">{{ mission.details.submission_prompt }}</p>
            <Label for="submission-url">Ссылка для проверки</Label>
            <Input id="submission-url" type="url" :placeholder="mission.details.placeholder_text" />
          </CardContent>
          <CardFooter>
            <Button>Отправить на проверку</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Награды</CardTitle>
          </CardHeader>
          <CardContent class="space-y-2">
            <div>
              <span class="font-semibold">Опыт:</span> {{ mission.experience_reward }} EXP
            </div>
            <div v-if="mission.mana_reward > 0">
              <span class="font-semibold">Мана:</span> {{ mission.mana_reward }}
            </div>
            <!-- Competency rewards can be added here later -->
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useMission } from './composables/useMission';
import { ArrowLeft } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Skeleton from '@/components/ui/skeleton/Skeleton.vue';

const router = useRouter();
const { mission, isLoading, error, fetchMission } = useMission();
</script>
