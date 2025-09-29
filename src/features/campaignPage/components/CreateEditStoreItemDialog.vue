<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>{{ isEditing ? 'Редактировать товар' : 'Создать товар' }}</DialogTitle>
        <DialogDescription>
          {{ isEditing ? 'Обновите детали товара.' : 'Заполните детали для нового товара.' }}
        </DialogDescription>
      </DialogHeader>
      <div v-if="isEditing" class="space-y-2 pt-4">
        <Label>Изображение</Label>
        <div class="flex items-center gap-4">
          <img v-if="localImageUrl" :src="localImageUrl" :alt="formData.name" class="h-20 w-20 rounded-md object-cover">
          <div v-else class="flex h-20 w-20 items-center justify-center rounded-md bg-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8 text-muted-foreground"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
          </div>
          <input ref="imageInput" type="file" class="hidden" accept="image/*" @change="onFileSelected">
          <Button variant="outline" @click="triggerImageInput" :disabled="isUploading">
            {{ isUploading ? 'Загрузка...' : 'Выбрать файл' }}
          </Button>
        </div>
      </div>
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
  isUploading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:open', 'save', 'delete', 'upload-image']);

const imageInput = ref(null);
const localImageUrl = ref(null);

const isEditing = computed(() => !!props.item);

const defaultFormData = () => ({
  name: '',
  description: '',
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
        cost: props.item.cost || 0,
        quantity: props.item.quantity,
        is_active: props.item.is_active,
      };
      localImageUrl.value = props.item.image_url;
    } else {
      formData.value = defaultFormData();
      localImageUrl.value = null;
    }
  }
});

watch(
  () => props.item?.image_url,
  (newUrl) => {
    if (props.open && props.item) {
      localImageUrl.value = newUrl;
    }
  }
);

const closeDialog = () => {
  emit('update:open', false);
};

const handleOpenChange = (isOpen) => {
  emit('update:open', isOpen);
};

const triggerImageInput = () => {
  imageInput.value?.click();
};

const onFileSelected = (event) => {
  const file = event.target.files[0];
  if (file) {
    emit('upload-image', file);
    const reader = new FileReader();
    reader.onload = (e) => {
      localImageUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
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
