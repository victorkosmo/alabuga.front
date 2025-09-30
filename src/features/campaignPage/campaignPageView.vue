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
      <CampaignMissions
        v-if="campaign.missions"
        :missions="campaign.missions"
        :campaign-id="campaignId"
        @create-mission="openCreateMissionDialog"
      />
      <CampaignAchievements
        :achievements="achievements"
        :is-loading="isAchievementsLoading"
        :error="achievementsError"
        :missions="missionsForSelector"
        @create-achievement="openCreateAchievementDialog"
        @edit-achievement="openEditAchievementDialog"
      />
      <CampaignStoreItems
        :items="storeItems"
        :is-loading="isStoreItemsLoading"
        :error="storeItemsError"
        @create-item="openCreateStoreItemDialog"
        @edit-item="openEditStoreItemDialog"
      />

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

import CampaignHeader from './components/CampaignHeader.vue';
import CampaignJoiningInfo from './components/CampaignJoiningInfo.vue';
import CampaignStats from './components/CampaignStats.vue';
import CampaignCover from './components/CampaignCover.vue';
import CampaignMissions from './components/CampaignMissions.vue';
import CampaignAchievements from './components/CampaignAchievements.vue';
import EditCampaignDialog from './components/EditCampaignDialog.vue';
import DeleteCampaignDialog from './components/DeleteCampaignDialog.vue';
import CreateMissionDialog from './components/CreateMissionDialog.vue';
import CreateEditAchievementDialog from './components/CreateEditAchievementDialog.vue';
import DeleteAchievementDialog from './components/DeleteAchievementDialog.vue';
import CampaignStoreItems from './components/CampaignStoreItems.vue';
import CreateEditStoreItemDialog from './components/CreateEditStoreItemDialog.vue';
import DeleteStoreItemDialog from './components/DeleteStoreItemDialog.vue';

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
</script>
