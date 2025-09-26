<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Создать ачивку</DialogTitle>
        <DialogDescription>
          Заполните детали для новой ачивки.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">
            Название
          </Label>
          <Input id="name" v-model="formData.name" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="description" class="text-right">
            Описание
          </Label>
          <Textarea id="description" v-model="formData.description" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="image_url" class="text-right">
            URL изображения
          </Label>
          <Input id="image_url" v-model="formData.image_url" class="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="closeDialog">Отмена</Button>
        <Button @click="handleSave">Сохранить</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const props = defineProps({
  open: Boolean,
});

const emit = defineEmits(['update:open', 'save']);

const defaultFormData = () => ({
  name: '',
  description: '',
  image_url: '',
});

const formData = ref(defaultFormData());

watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    formData.value = defaultFormData();
  }
});

const closeDialog = () => {
  emit('update:open', false);
};

const handleOpenChange = (isOpen) => {
  emit('update:open', isOpen);
};

const handleSave = () => {
  if (!formData.value.name) {
    // Basic validation, can be improved with a toast message
    console.error("Name is required");
    return;
  }
  emit('save', { ...formData.value });
};
</script>
