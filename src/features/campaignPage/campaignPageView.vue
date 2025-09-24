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

      <EditCampaignDialog
        v-model:open="dialogs.edit"
        :campaign="campaign"
        @save="handleUpdateCampaign"
      />
      <DeleteCampaignDialog
        v-model:open="dialogs.delete"
        @confirm="handleDeleteCampaign"
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
import EditCampaignDialog from './components/EditCampaignDialog.vue';
import DeleteCampaignDialog from './components/DeleteCampaignDialog.vue';

const { campaignId, campaign, isLoading, error, fetchCampaign } = useCampaignData();

const {
  dialogs,
  openEditDialog,
  openDeleteDialog,
  handleUpdateCampaign,
  handleDeleteCampaign,
} = useCampaignActions(campaignId, fetchCampaign);
</script>
