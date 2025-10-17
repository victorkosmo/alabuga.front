<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <header class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Ранги</h1>
    </header>

    <div v-if="isLoading" class="space-y-4">
      <Skeleton class="h-12 w-full" />
      <Skeleton class="h-12 w-full" />
      <Skeleton class="h-12 w-full" />
    </div>

    <div v-else class="space-y-4">
      <RanksTable v-if="ranks.length" :ranks="ranks" />
      <div v-else class="text-center text-muted-foreground py-12 border border-dashed rounded-lg">
        <p>Нет данных.</p>
      </div>

      <div v-if="pagination && pagination.pages > 1" class="flex items-center justify-end space-x-2 py-4">
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
import RanksTable from './components/RanksTable.vue';
import { useRanks } from './composables/useRanks';

const {
  ranks,
  pagination,
  isLoading,
  fetchRanks,
} = useRanks();
</script>
