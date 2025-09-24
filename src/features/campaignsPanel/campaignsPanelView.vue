<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <header class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Кампании</h1>
      <Button @click="openCreateDialog">Создать кампанию</Button>
    </header>

    <div v-if="isLoading" class="space-y-4">
      <Skeleton class="h-12 w-full" />
      <Skeleton class="h-12 w-full" />
      <Skeleton class="h-12 w-full" />
    </div>

    <div v-else>
      <CampaignsTable :campaigns="campaigns" />

      <div v-if="pagination && pagination.pages > 1" class="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.page <= 1"
          @click="fetchCampaigns(pagination.page - 1)"
        >
          Назад
        </Button>
        <span class="text-sm">
          Страница {{ pagination.page }} из {{ pagination.pages }}
        </span>
        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.page >= pagination.pages"
          @click="fetchCampaigns(pagination.page + 1)"
        >
          Вперед
        </Button>
      </div>
    </div>

    <CreateCampaignDialog
      v-model:open="dialogs.create"
      @save="handleSaveCampaign"
    />
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import CampaignsTable from './components/CampaignsTable.vue';
import CreateCampaignDialog from './components/CreateCampaignDialog.vue';
import { useCampaigns } from './composables/useCampaigns';

const {
  campaigns,
  pagination,
  isLoading,
  dialogs,
  fetchCampaigns,
  openCreateDialog,
  handleSaveCampaign,
} = useCampaigns();
</script>
