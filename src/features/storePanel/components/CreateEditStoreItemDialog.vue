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
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="cost" class="text-right">Цена</Label>
          <Input id="cost" type="number" v-model.number="formData.cost" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="quantity" class="text-right">Количество</Label>
          <Input id="quantity" type="number" v-model.number="formData.quantity" class="col-span-3" placeholder="Пусто для ∞" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="is_active" class="text-right">Активен</Label>
          <div class="col-span-3 flex items-center">
            <Switch id="is_active" v-model:checked="formData.is_active" />
          </div>
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
import { Switch } from '@/components/ui/switch';

const props = defineProps({
  open: Boolean,
  storeItem: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['update:open', 'save']);

const getInitialFormData = () => ({
  name: '',
  description: '',
  cost: 0,
  quantity: null,
  is_active: true,
});

const formData = ref(getInitialFormData());

const title = computed(() => (props.storeItem ? 'Изменить товар' : 'Создать товар'));

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      if (props.storeItem) {
        formData.value = { ...props.storeItem };
      } else {
        formData.value = getInitialFormData();
      }
    }
  }
);

const handleOpenChange = (value) => {
  emit('update:open', value);
};

const handleSave = () => {
  const dataToSave = { ...formData.value };
  // API expects null for infinite quantity, but empty input results in empty string or 0
  if (dataToSave.quantity === '' || dataToSave.quantity === null || isNaN(dataToSave.quantity)) {
    dataToSave.quantity = null;
  }
  emit('save', dataToSave);
};
</script>
