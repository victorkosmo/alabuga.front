// src/features/ranksPanel/components/RanksTable.vue
<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead class="w-[30%]">Название</TableHead>
        <TableHead>Описание</TableHead>
        <TableHead class="w-[120px]">Приоритет</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <template v-if="ranks.length">
        <TableRow v-for="rank in ranks" :key="rank.id">
          <TableCell class="font-medium">{{ rank.name }}</TableCell>
          <TableCell class="break-words">{{ rank.description || 'Нет описания.' }}</TableCell>
          <TableCell>{{ rank.priority }}</TableCell>
        </TableRow>
      </template>
      <template v-else>
        <TableRow>
          <TableCell :colspan="3" class="h-24 text-center">
            Нет данных.
          </TableCell>
        </TableRow>
      </template>
    </TableBody>
  </Table>
</template>

<script setup>
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

defineProps({
  ranks: {
    type: Array,
    required: true,
  },
});
</script>
