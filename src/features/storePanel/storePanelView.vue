<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <header class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Магазин (глобальные товары)</h1>
      <Button @click="openCreateDialog">Добавить товар</Button>
    </header>

    <div v-if="isLoading" class="space-y-4">
      <Skeleton class="h-12 w-full" />
      <Skeleton class="h-12 w-full" />
      <Skeleton class="h-12 w-full" />
    </div>

    <div v-else>
      <StoreItemsTable
        :store-items="storeItems"
        @edit="openEditDialog"
        @delete="openDeleteDialog"
      />

      <div v-if="pagination && pagination.pages > 1" class="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.page <= 1"
          @click="fetchStoreItems(pagination.page - 1)"
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
          @click="fetchStoreItems(pagination.page + 1)"
        >
          Вперед
        </Button>
      </div>
    </div>

    <CreateEditStoreItemDialog
      v-model:open="dialogs.createEdit"
      :store-item="selectedStoreItem"
      @save="handleSaveStoreItem"
    />

    <DeleteStoreItemDialog
      v-if="selectedStoreItem"
      v-model:open="dialogs.delete"
      :store-item="selectedStoreItem"
      @confirm="handleDeleteStoreItem"
    />
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import StoreItemsTable from './components/StoreItemsTable.vue';
import CreateEditStoreItemDialog from './components/CreateEditStoreItemDialog.vue';
import DeleteStoreItemDialog from './components/DeleteStoreItemDialog.vue';
import { useStoreItems } from './composables/useStoreItems';

const {
  storeItems,
  pagination,
  isLoading,
  selectedStoreItem,
  dialogs,
  fetchStoreItems,
  openCreateDialog,
  openEditDialog,
  openDeleteDialog,
  handleSaveStoreItem,
  handleDeleteStoreItem,
} = useStoreItems();
</script>
