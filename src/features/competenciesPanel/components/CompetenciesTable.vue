<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead class="w-1/3">Название</TableHead>
        <TableHead class="w-2/3">Описание</TableHead>
        <TableHead class="text-right">Действия</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <template v-if="competencies.length">
        <TableRow v-for="competency in competencies" :key="competency.id">
          <TableCell class="font-medium">{{ competency.name }}</TableCell>
          <TableCell>{{ competency.description }}</TableCell>
          <TableCell class="text-right">
            <div class="flex justify-end gap-2">
              <Button variant="outline" size="sm" @click="$emit('edit', competency)">
                Изменить
              </Button>
              <Button variant="destructive" size="sm" @click="$emit('delete', competency)">
                Удалить
              </Button>
            </div>
          </TableCell>
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
import { Button } from '@/components/ui/button';

defineProps({
  competencies: {
    type: Array,
    required: true,
  },
});

defineEmits(['edit', 'delete']);
</script>
