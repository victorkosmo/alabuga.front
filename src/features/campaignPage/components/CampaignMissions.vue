<template>
  <CampaignSection
    v-if="missions"
    title="Миссии"
    :items="missions"
    empty-text="Для этой кампании еще не создано ни одной миссии."
    @create="$emit('create-mission')"
  >
    <template #item="{ item: mission }">
      <router-link :to="{ name: 'Миссия', params: { campaignId: campaignId, missionId: mission.id }, query: { type: mission.type } }" class="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
        <Card class="h-full hover:border-primary transition-colors overflow-hidden flex flex-col">
          <img v-if="mission.cover_url" :src="mission.cover_url" :alt="mission.title" class="w-full h-32 object-cover" />
          <div v-else class="w-full h-32 bg-muted flex items-center justify-center">
            <Image class="w-10 h-10 text-muted-foreground" />
          </div>
          <CardHeader>
            <CardTitle>{{ mission.title }}</CardTitle>
            <CardDescription>{{ mission.description }}</CardDescription>
          </CardHeader>
          <CardContent class="space-y-2 mt-auto">
            <div class="flex items-center">
              <span class="font-semibold">Тип:</span>
              <Badge v-if="mission.type === 'MANUAL_URL'" class="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100/80">
                <component :is="missionTypeDetails.MANUAL_URL.icon" class="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                {{ missionTypeDetails.MANUAL_URL.label }}
              </Badge>
              <Badge v-else-if="mission.type === 'QR_CODE'" class="ml-2 bg-green-100 text-green-800 hover:bg-green-100/80">
                <component :is="missionTypeDetails.QR_CODE.icon" class="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                {{ missionTypeDetails.QR_CODE.label }}
              </Badge>
              <Badge v-else-if="mission.type === 'QUIZ'" class="ml-2 bg-purple-100 text-purple-800 hover:bg-purple-100/80">
                <component :is="missionTypeDetails.QUIZ.icon" class="h-3.5 w-35 mr-1" aria-hidden="true" />
                {{ missionTypeDetails.QUIZ.label }}
              </Badge>
              <span v-else class="ml-2">{{ mission.type }}</span>
            </div>
            <div v-if="mission.required_achievement_name">
              <span class="font-semibold">Требуется ачивка:</span> {{ mission.required_achievement_name }}
            </div>
            <div v-if="mission.type === 'MANUAL_URL'">
              <router-link
                :to="{ name: 'Проверка заполнений', params: { campaignId: campaignId, missionId: mission.id } }"
                custom
                v-slot="{ navigate }"
                @click.stop
              >
                <Button @click="navigate" class="w-full" variant="outline">
                  Проверить выполнения
                </Button>
              </router-link>
            </div>
          </CardContent>
        </Card>
      </router-link>
    </template>
  </CampaignSection>
</template>

<script setup>
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link, QrCode, FileQuestion, Image } from 'lucide-vue-next';
import CampaignSection from './CampaignSection.vue';

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

const missionTypeDetails = {
  MANUAL_URL: { label: 'Ссылка', icon: Link },
  QR_CODE: { label: 'QR-код', icon: QrCode },
  QUIZ: { label: 'Квиз', icon: FileQuestion },
};
</script>
