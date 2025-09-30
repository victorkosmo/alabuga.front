<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div v-if="isLoading" class="space-y-4">
      <Skeleton class="h-10 w-1/2" />
      <Skeleton class="h-8 w-1/4" />
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Skeleton class="h-32 w-full" />
        <Skeleton class="h-32 w-full" />
        <Skeleton class="h-32 w-full" />
      </div>
      <Skeleton class="h-48 w-full mt-6" />
      <div class="mt-6 space-y-4">
        <Skeleton class="h-8 w-1/3" />
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton class="h-40 w-full" />
          <Skeleton class="h-40 w-full" />
          <Skeleton class="h-40 w-full" />
        </div>
      </div>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <h2 class="text-xl font-semibold">Не удалось загрузить кампанию</h2>
      <p class="text-muted-foreground">{{ error }}</p>
      <Button @click="fetchCampaign" class="mt-4">Попробовать снова</Button>
    </div>

    <div v-else-if="campaign">
      <CampaignHeader
        :campaign="campaign"
        @edit="openEditDialog"
        @delete="openDeleteDialog"
      />
      <div class="mt-6 flex items-start gap-6">
        <div class="w-1/2">
          <CampaignJoiningInfo :campaign="campaign" />
        </div>
        <div class="w-1/4">
          <CampaignStats :campaign="campaign" />
        </div>
        <div class="w-1/4">
          <CampaignCover
            :campaign="campaign"
            :is-uploading-cover="isUploadingCover"
            @upload-cover="handleUploadCover"
          />
        </div>
      </div>
      <CampaignSection
        v-if="campaign.missions"
        title="Миссии"
        :items="campaign.missions"
        empty-text="Для этой кампании еще не создано ни одной миссии."
        @create="openCreateMissionDialog"
      >
        <template #item="{ item: mission }">
          <router-link :to="{ name: 'Миссия', params: { campaignId: campaignId, missionId: mission.id }, query: { type: mission.type } }" class="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
            <Card class="h-full hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle>{{ mission.title }}</CardTitle>
                <CardDescription>{{ mission.description }}</CardDescription>
              </CardHeader>
              <CardContent class="space-y-2">
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
                    <component :is="missionTypeDetails.QUIZ.icon" class="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                    {{ missionTypeDetails.QUIZ.label }}
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
        </template>
      </CampaignSection>

      <CampaignSection
        title="Ачивки"
        :items="achievements"
        :is-loading="isAchievementsLoading"
        loading-text="Загрузка ачивок..."
        :error="achievementsError ? `Не удалось загрузить ачивки: ${achievementsError}` : null"
        empty-text="Для этой кампании еще не создано ни одной ачивки."
        @create="openCreateAchievementDialog"
      >
        <template #item="{ item: achievement }">
          <Card class="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] h-full hover:border-primary transition-colors cursor-pointer" @click="openEditAchievementDialog(achievement)">
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

      <CampaignSection
        title="Товары магазина"
        :items="storeItems"
        :is-loading="isStoreItemsLoading"
        loading-text="Загрузка товаров..."
        :error="storeItemsError ? `Не удалось загрузить товары: ${storeItemsError}` : null"
        empty-text="Для этой кампании еще не создано ни одного товара."
        @create="openCreateStoreItemDialog"
      >
        <template #item="{ item }">
          <Card class="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] h-full hover:border-primary transition-colors cursor-pointer" @click="openEditStoreItemDialog(item)">
            <CardHeader>
              <CardTitle>{{ item.name }}</CardTitle>
              <CardDescription>{{ item.description }}</CardDescription>
            </CardHeader>
            <CardContent class="space-y-2">
              <img v-if="item.image_url" :src="item.image_url" :alt="item.name" class="w-40 h-40 object-cover rounded-md">
              <div>
                <span class="font-semibold">Цена:</span> {{ item.cost }}
              </div>
              <div>
                <span class="font-semibold">Количество:</span> {{ item.quantity === null ? 'Бесконечно' : item.quantity }}
              </div>
              <div>
                <span class="font-semibold">Статус:</span> {{ item.is_active ? 'Активен' : 'Неактивен' }}
              </div>
            </CardContent>
          </Card>
        </template>
      </CampaignSection>

      <EditCampaignDialog
        v-model:open="dialogs.edit"
        :campaign="campaign"
        @save="handleUpdateCampaign"
      />
      <DeleteCampaignDialog
        v-model:open="dialogs.delete"
        @confirm="handleDeleteCampaign"
      />

      <CreateMissionDialog
        v-model:open="dialogs.createMission"
        @select-type="handleSelectMissionType"
      />
      <CreateEditAchievementDialog
        v-model:open="dialogs.createEditAchievement"
        :achievement="selectedAchievement"
        :missions="missionsForSelector"
        :is-uploading="isUploadingAchievementImage"
        @save="handleSaveAchievement"
        @delete="openDeleteAchievementDialog"
        @upload-image="handleUploadAchievementImage"
      />
      <DeleteAchievementDialog
        v-model:open="dialogs.deleteAchievement"
        @confirm="handleDeleteAchievement"
      />

      <CreateEditStoreItemDialog
        v-model:open="dialogs.createEditStoreItem"
        :item="selectedStoreItem"
        :is-uploading="isUploadingStoreItemImage"
        @save="handleSaveStoreItem"
        @delete="openDeleteStoreItemDialog"
        @upload-image="handleUploadStoreItemImage"
      />
      <DeleteStoreItemDialog
        v-model:open="dialogs.deleteStoreItem"
        @confirm="handleDeleteStoreItem"
      />
    </div>
  </div>
</template>

<script setup>
import { useCampaignData } from './composables/useCampaignData';
import { useCampaignActions } from './composables/useCampaignActions';

import Button from '@/components/ui/button/Button.vue';
import Skeleton from '@/components/ui/skeleton/Skeleton.vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, QrCode, FileQuestion } from 'lucide-vue-next';

import CampaignHeader from './components/CampaignHeader.vue';
import CampaignJoiningInfo from './components/CampaignJoiningInfo.vue';
import CampaignStats from './components/CampaignStats.vue';
import CampaignCover from './components/CampaignCover.vue';
import CampaignSection from './components/CampaignSection.vue';
import EditCampaignDialog from './components/EditCampaignDialog.vue';
import DeleteCampaignDialog from './components/DeleteCampaignDialog.vue';
import CreateMissionDialog from './components/CreateMissionDialog.vue';
import CreateEditAchievementDialog from './components/CreateEditAchievementDialog.vue';
import DeleteAchievementDialog from './components/DeleteAchievementDialog.vue';
import CreateEditStoreItemDialog from './components/CreateEditStoreItemDialog.vue';
import DeleteStoreItemDialog from './components/DeleteStoreItemDialog.vue';

const missionTypeDetails = {
  MANUAL_URL: { label: 'Ссылка', icon: Link },
  QR_CODE: { label: 'QR-код', icon: QrCode },
  QUIZ: { label: 'Квиз', icon: FileQuestion },
};

const {
  campaignId,
  campaign,
  isLoading,
  error,
  fetchCampaign,
  achievements,
  achievementsPagination,
  isAchievementsLoading,
  achievementsError,
  fetchAchievements,
  missionsForSelector,
  storeItems,
  storeItemsPagination,
  isStoreItemsLoading,
  storeItemsError,
  fetchStoreItems,
} = useCampaignData();

const {
  dialogs,
  selectedAchievement,
  isUploadingCover,
  openEditDialog,
  openDeleteDialog,
  openCreateMissionDialog,
  openCreateAchievementDialog,
  openEditAchievementDialog,
  openDeleteAchievementDialog,
  handleUpdateCampaign,
  handleDeleteCampaign,
  handleUploadCover,
  handleSelectMissionType,
  handleSaveAchievement,
  handleDeleteAchievement,
  isUploadingAchievementImage,
  handleUploadAchievementImage,
  selectedStoreItem,
  openCreateStoreItemDialog,
  openEditStoreItemDialog,
  openDeleteStoreItemDialog,
  handleSaveStoreItem,
  handleDeleteStoreItem,
  isUploadingStoreItemImage,
  handleUploadStoreItemImage,
} = useCampaignActions(
  campaignId,
  fetchCampaign,
  fetchAchievements,
  achievements,
  achievementsPagination,
  fetchStoreItems,
  storeItems,
  storeItemsPagination
);

const getMissionName = (missionId) => {
  if (!missionId || !missionsForSelector.value) return 'Неизвестная миссия';
  const mission = missionsForSelector.value.find(m => m.id === missionId);
  return mission ? mission.title : 'Неизвестная миссия';
};
</script>
