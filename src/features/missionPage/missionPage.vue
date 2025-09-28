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
          <div class="flex items-center gap-2">
            <router-link
              :to="{
                name: 'Редактировать миссию',
                params: { id: route.params.campaignId },
                query: { missionId: mission.id, type: mission.type }
              }"
            >
              <Button variant="outline">
                <Pencil class="mr-2 h-4 w-4" />
                Редактировать
              </Button>
            </router-link>
            <router-link
              v-if="mission.type === 'MANUAL_URL'"
              :to="{
                name: 'Проверка заполнений',
                params: { campaignId: route.params.campaignId, missionId: mission.id }
              }"
            >
              <Button>Проверки</Button>
            </router-link>
          </div>
        </div>
        <p class="text-muted-foreground mt-1 ml-12">{{ mission.description }}</p>
      </header>

      <div class="grid gap-6">
        <Card v-if="mission.type === 'MANUAL_URL'">
          <CardHeader>
            <CardTitle>Задание</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground mb-4">{{ mission.details?.submission_prompt }}</p>
            <Label for="submission-url">Ссылка для проверки</Label>
            <Input id="submission-url" type="url" :placeholder="mission.details?.placeholder_text" />
          </CardContent>
          <CardFooter>
            <Button>Отправить на проверку</Button>
          </CardFooter>
        </Card>

        <Card v-if="mission.type === 'QR_CODE'">
          <CardHeader>
            <CardTitle>QR-код для сканирования</CardTitle>
            <CardDescription>
              Пользователи должны отсканировать этот QR-код и ввести секретный код для выполнения миссии.
            </CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col items-center gap-4">
            <img
              v-if="mission.qr_url"
              :src="mission.qr_url"
              alt="QR Code"
              class="w-48 h-48 rounded-lg border"
            />
            <div class="bg-muted p-4 rounded-lg inline-block text-center">
              <p class="text-sm text-muted-foreground">Секретный код:</p>
              <p class="text-2xl font-mono font-bold tracking-widest">
                {{ mission.completion_code }}
              </p>
            </div>
            <p class="text-xs text-muted-foreground">
              Распечатайте этот QR-код или покажите его участникам.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Обязательная ачивка</CardTitle>
            <CardDescription>
              Выберите ачивку, которую пользователь должен получить перед выполнением этой миссии.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              :model-value="mission.required_achievement_id"
              @update:model-value="updateRequiredAchievement"
              :disabled="isUpdatingAchievement"
            >
              <SelectTrigger>
                <SelectValue placeholder="Ачивка не требуется" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="null">Ачивка не требуется</SelectItem>
                <SelectItem
                  v-for="achievement in achievements"
                  :key="achievement.id"
                  :value="achievement.id"
                >
                  {{ achievement.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
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
import { useRouter, useRoute } from 'vue-router';
import { useMission } from './composables/useMission';
import { ArrowLeft, Pencil } from 'lucide-vue-next';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Skeleton from '@/components/ui/skeleton/Skeleton.vue';

const router = useRouter();
const route = useRoute();
const {
  mission,
  isLoading,
  error,
  fetchMission,
  achievements,
  isUpdatingAchievement,
  updateRequiredAchievement
} = useMission();
</script>
