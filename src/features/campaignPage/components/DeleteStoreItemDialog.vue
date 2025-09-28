<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Удалить товар?</DialogTitle>
        <DialogDescription>
          Это действие нельзя отменить. Вы уверены, что хотите удалить этот товар?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" @click="$emit('update:open', false)">Отмена</Button>
        <Button variant="destructive" @click="$emit('confirm')">Удалить</Button>
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
});

defineEmits(['update:open', 'confirm']);
</script>
