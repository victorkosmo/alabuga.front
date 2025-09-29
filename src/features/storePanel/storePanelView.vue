<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <header class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Магазин (глобальные товары)</h1>
      <Button @click="openCreateDialog">Добавить товар</Button>
    </header>

    <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <Skeleton class="h-80 w-full" />
      <Skeleton class="h-80 w-full" />
      <Skeleton class="h-80 w-full" />
      <Skeleton class="h-80 w-full" />
    </div>

    <div v-else>
      <div v-if="storeItems.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StoreItemCard
          v-for="item in storeItems"
          :key="item.id"
          :store-item="item"
          @edit="openEditDialog"
          @delete="openDeleteDialog"
          @view="openViewDialog"
        />
      </div>
      <div v-else class="flex items-center justify-center h-48 text-muted-foreground">
        Нет данных.
      </div>

      <div v-if="pagination && pagination.pages > 1" class="flex items-center justify-end space-x-2 py-4 mt-4">
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
      :is-uploading="isUploadingImage"
      @save="handleSaveStoreItem"
      @upload-image="handleImageUpload"
    />

    <StoreItemDetailsDialog
      v-if="selectedStoreItem"
      v-model:open="dialogs.view"
      :store-item="selectedStoreItem"
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
import StoreItemCard from './components/StoreItemCard.vue';
import CreateEditStoreItemDialog from './components/CreateEditStoreItemDialog.vue';
import StoreItemDetailsDialog from './components/StoreItemDetailsDialog.vue';
import DeleteStoreItemDialog from './components/DeleteStoreItemDialog.vue';
import { useStoreItems } from './composables/useStoreItems';

const {
  storeItems,
  pagination,
  isLoading,
  selectedStoreItem,
  isUploadingImage,
  dialogs,
  fetchStoreItems,
  openCreateDialog,
  openViewDialog,
  openEditDialog,
  openDeleteDialog,
  handleSaveStoreItem,
  handleDeleteStoreItem,
  handleImageUpload,
} = useStoreItems();
</script>
