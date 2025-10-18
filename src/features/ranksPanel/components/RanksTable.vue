<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead class="w-[30%]">Название</TableHead>
        <TableHead>Описание</TableHead>
        <TableHead class="w-[120px]">Приоритет</TableHead>
        <TableHead class="w-[100px] text-right">Действия</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <template v-if="ranks.length">
        <TableRow v-for="rank in ranks" :key="rank.id">
          <TableCell class="font-medium">{{ rank.title }}</TableCell>
          <TableCell class="break-words">{{ rank.description || 'Нет описания.' }}</TableCell>
          <TableCell>{{ rank.priority }}</TableCell>
          <TableCell class="text-right">
            <Button variant="ghost" size="sm" @click="$emit('edit', rank)">
              <Pencil class="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      </template>
      <template v-else>
        <TableRow>
          <TableCell :colspan="4" class="h-24 text-center">
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
import { Pencil } from 'lucide-vue-next';

defineProps({
  ranks: {
    type: Array,
    required: true,
  },
});

defineEmits(['edit']);
</script>
