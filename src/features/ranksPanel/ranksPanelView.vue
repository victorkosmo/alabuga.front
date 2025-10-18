<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <header class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Ранги</h1>
      <Button @click="openCreateDialog">Создать ранг</Button>
    </header>

    <CreateEditRankDialog
      :is-open="dialogs.createEdit"
      :rank="selectedRank"
      :is-saving="isSaving"
      @close="closeCreateEditDialog"
      @save="saveRank"
    />

    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Skeleton v-for="i in 6" :key="i" class="h-64 w-full" />
    </div>

    <div v-else>
      <div v-if="ranks.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RankCard
          v-for="rank in ranks"
          :key="rank.id"
          :rank="rank"
          @edit="openEditDialog"
        />
      </div>
      <div v-else class="text-center py-12 text-muted-foreground">
        Нет данных.
      </div>

      <div v-if="pagination && pagination.pages > 1" class="flex items-center justify-end space-x-2 py-4 mt-6">
        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.page <= 1"
          @click="fetchRanks(pagination.page - 1)"
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
          @click="fetchRanks(pagination.page + 1)"
        >
          Вперед
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import RankCard from './components/RankCard.vue';
import CreateEditRankDialog from './components/CreateEditRankDialog.vue';
import { useRanks } from './composables/useRanks';

const {
  ranks,
  pagination,
  isLoading,
  fetchRanks,
  dialogs,
  selectedRank,
  isSaving,
  openCreateDialog,
  openEditDialog,
  closeCreateEditDialog,
  saveRank,
} = useRanks();
</script>
