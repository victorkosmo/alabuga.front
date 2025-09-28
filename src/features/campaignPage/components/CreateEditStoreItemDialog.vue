<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>{{ isEditing ? 'Редактировать товар' : 'Создать товар' }}</DialogTitle>
        <DialogDescription>
          {{ isEditing ? 'Обновите детали товара.' : 'Заполните детали для нового товара.' }}
        </DialogDescription>
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
          <Label for="image_url" class="text-right">URL изображения</Label>
          <Input id="image_url" v-model="formData.image_url" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="cost" class="text-right">Цена</Label>
          <Input id="cost" v-model="formData.cost" type="number" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="quantity" class="text-right">Количество</Label>
          <Input id="quantity" v-model="formData.quantity" type="number" class="col-span-3" placeholder="Бесконечно" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="is_active" class="text-right">Активен</Label>
          <div class="col-span-3 flex items-center">
            <Switch id="is_active" v-model:checked="formData.is_active" />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button v-if="isEditing" variant="destructive" class="mr-auto" @click="handleDelete">Удалить</Button>
        <Button variant="outline" @click="closeDialog">Отмена</Button>
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
  DialogDescription,
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
  item: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['update:open', 'save', 'delete']);

const isEditing = computed(() => !!props.item);

const defaultFormData = () => ({
  name: '',
  description: '',
  image_url: '',
  cost: 0,
  quantity: null,
  is_active: true,
});

const formData = ref(defaultFormData());

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    if (props.item) {
      formData.value = {
        name: props.item.name,
        description: props.item.description || '',
        image_url: props.item.image_url || '',
        cost: props.item.cost || 0,
        quantity: props.item.quantity,
        is_active: props.item.is_active,
      };
    } else {
      formData.value = defaultFormData();
    }
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
    console.error("Name is required");
    return;
  }
  
  const payload = {
    ...formData.value,
    cost: Number(formData.value.cost) || 0,
    quantity: formData.value.quantity === '' || formData.value.quantity === null ? null : Number(formData.value.quantity),
  };

  emit('save', payload);
};

const handleDelete = () => {
  emit('delete');
};
</script>
