<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">Название</Label>
          <Input id="name" v-model="formData.name" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="description" class="text-right">Описание</Label>
          <Textarea id="description" v-model="formData.description" class="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="handleOpenChange(false)">Отмена</Button>
        <Button @click="handleSave">Сохранить</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const props = defineProps({
  open: Boolean,
  competency: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['update:open', 'save']);

const formData = ref({
  name: '',
  description: '',
});

const title = computed(() => (props.competency ? 'Изменить компетенцию' : 'Создать компетенцию'));

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      if (props.competency) {
        formData.value = { ...props.competency };
      } else {
        formData.value = { name: '', description: '' };
      }
    }
  }
);

const handleOpenChange = (value) => {
  emit('update:open', value);
};

const handleSave = () => {
  emit('save', { ...formData.value });
};
</script>
