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
      <CampaignStats :campaign="campaign" />
      <CampaignDetails :campaign="campaign" />
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
        @create-achievement="openCreateAchievementDialog"
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
      <CreateAchievementDialog
        v-model:open="dialogs.createAchievement"
        @save="handleSaveAchievement"
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
import CampaignStats from './components/CampaignStats.vue';
import CampaignDetails from './components/CampaignDetails.vue';
import CampaignMissions from './components/CampaignMissions.vue';
import CampaignAchievements from './components/CampaignAchievements.vue';
import EditCampaignDialog from './components/EditCampaignDialog.vue';
import DeleteCampaignDialog from './components/DeleteCampaignDialog.vue';
import CreateMissionDialog from './components/CreateMissionDialog.vue';
import CreateAchievementDialog from './components/CreateAchievementDialog.vue';

const {
  campaignId,
  campaign,
  isLoading,
  error,
  fetchCampaign,
  achievements,
  isAchievementsLoading,
  achievementsError,
  fetchAchievements,
} = useCampaignData();

const {
  dialogs,
  openEditDialog,
  openDeleteDialog,
  openCreateMissionDialog,
  openCreateAchievementDialog,
  handleUpdateCampaign,
  handleDeleteCampaign,
  handleSelectMissionType,
  handleSaveAchievement,
} = useCampaignActions(campaignId, fetchCampaign, fetchAchievements);
</script>
