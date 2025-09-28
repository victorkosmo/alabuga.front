<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Название</TableHead>
        <TableHead>Описание</TableHead>
        <TableHead>Цена</TableHead>
        <TableHead>Кол-во</TableHead>
        <TableHead>Активен</TableHead>
        <TableHead class="text-right">Действия</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <template v-if="storeItems.length">
        <TableRow v-for="item in storeItems" :key="item.id">
          <TableCell class="font-medium">
            <Button variant="link" class="p-0 h-auto" @click="$emit('view', item)">
              {{ item.name }}
            </Button>
          </TableCell>
          <TableCell>{{ item.description || '-' }}</TableCell>
          <TableCell>{{ item.cost }}</TableCell>
          <TableCell>{{ item.quantity === null ? '∞' : item.quantity }}</TableCell>
          <TableCell>{{ item.is_active ? 'Да' : 'Нет' }}</TableCell>
          <TableCell class="text-right">
            <div class="flex justify-end gap-2">
              <Button variant="outline" size="sm" @click="$emit('edit', item)">
                Изменить
              </Button>
              <Button variant="destructive" size="sm" @click="$emit('delete', item)">
                Удалить
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </template>
      <template v-else>
        <TableRow>
          <TableCell :colspan="6" class="h-24 text-center">
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
  storeItems: {
    type: Array,
    required: true,
  },
});

defineEmits(['edit', 'delete', 'view']);
</script>
