<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <header class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Навыки</h1>
      <Button @click="openCreateDialog">Добавить навык</Button>
    </header>

    <div v-if="isLoading" class="space-y-4">
      <Skeleton class="h-12 w-full" />
      <Skeleton class="h-12 w-full" />
      <Skeleton class="h-12 w-full" />
    </div>

    <div v-else>
      <CompetenciesTable
        :competencies="competencies"
        @edit="openEditDialog"
        @delete="openDeleteDialog"
      />

      <div v-if="pagination && pagination.pages > 1" class="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.page <= 1"
          @click="fetchCompetencies(pagination.page - 1)"
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
          @click="fetchCompetencies(pagination.page + 1)"
        >
          Вперед
        </Button>
      </div>
    </div>

    <CreateEditCompetencyDialog
      v-model:open="dialogs.createEdit"
      :competency="selectedCompetency"
      @save="handleSaveCompetency"
    />

    <DeleteCompetencyDialog
      v-if="selectedCompetency"
      v-model:open="dialogs.delete"
      :competency="selectedCompetency"
      @confirm="handleDeleteCompetency"
    />
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import CompetenciesTable from './components/CompetenciesTable.vue';
import CreateEditCompetencyDialog from './components/CreateEditCompetencyDialog.vue';
import DeleteCompetencyDialog from './components/DeleteCompetencyDialog.vue';
import { useCompetencies } from './composables/useCompetencies';

const {
  competencies,
  pagination,
  isLoading,
  selectedCompetency,
  dialogs,
  fetchCompetencies,
  openCreateDialog,
  openEditDialog,
  openDeleteDialog,
  handleSaveCompetency,
  handleDeleteCompetency,
} = useCompetencies();
</script>
