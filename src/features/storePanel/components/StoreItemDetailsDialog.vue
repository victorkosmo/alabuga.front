<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Детали товара</DialogTitle>
      </DialogHeader>
      <div v-if="storeItem" class="grid gap-4 py-4 text-sm">
        <div v-if="storeItem.image_url" class="flex justify-center">
          <img :src="storeItem.image_url" :alt="storeItem.name" class="h-48 w-48 rounded-md object-cover">
        </div>
        <div class="grid grid-cols-3 items-center gap-4">
          <Label class="text-right text-muted-foreground">Название</Label>
          <span class="col-span-2 font-medium">{{ storeItem.name }}</span>
        </div>
        <div class="grid grid-cols-3 items-start gap-4">
          <Label class="text-right text-muted-foreground pt-1">Описание</Label>
          <p class="col-span-2">{{ storeItem.description || '-' }}</p>
        </div>
        <div class="grid grid-cols-3 items-center gap-4">
          <Label class="text-right text-muted-foreground">Цена</Label>
          <span class="col-span-2">{{ storeItem.cost }}</span>
        </div>
        <div class="grid grid-cols-3 items-center gap-4">
          <Label class="text-right text-muted-foreground">Количество</Label>
          <span class="col-span-2">{{ storeItem.quantity === null ? 'Бесконечно' : storeItem.quantity }}</span>
        </div>
        <div class="grid grid-cols-3 items-center gap-4">
          <Label class="text-right text-muted-foreground">Активен</Label>
          <span class="col-span-2">{{ storeItem.is_active ? 'Да' : 'Нет' }}</span>
        </div>
        <div class="grid grid-cols-3 items-center gap-4">
          <Label class="text-right text-muted-foreground">Создан</Label>
          <span class="col-span-2">{{ new Date(storeItem.created_at).toLocaleString() }}</span>
        </div>
        <div class="grid grid-cols-3 items-center gap-4">
          <Label class="text-right text-muted-foreground">Обновлен</Label>
          <span class="col-span-2">{{ new Date(storeItem.updated_at).toLocaleString() }}</span>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="handleOpenChange(false)">Закрыть</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

defineProps({
  open: Boolean,
  storeItem: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['update:open']);

const handleOpenChange = (value) => {
  emit('update:open', value);
};
</script>
