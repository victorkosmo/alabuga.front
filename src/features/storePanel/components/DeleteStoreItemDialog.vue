<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Удалить товар</DialogTitle>
        <DialogDescription>
          Вы уверены, что хотите удалить товар "{{ storeItem.name }}"? Это действие нельзя будет отменить.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" @click="handleOpenChange(false)">Отмена</Button>
        <Button variant="destructive" @click="handleConfirm">Удалить</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

defineProps({
  open: Boolean,
  storeItem: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:open', 'confirm']);

const handleOpenChange = (value) => {
  emit('update:open', value);
};

const handleConfirm = () => {
  emit('confirm');
};
</script>
