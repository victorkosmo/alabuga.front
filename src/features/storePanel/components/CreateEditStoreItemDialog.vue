<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
      </DialogHeader>

      <div v-if="storeItem" class="space-y-2 pt-4">
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
  isUploading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:open', 'save', 'upload-image']);

const imageInput = ref(null);
const localImageUrl = ref(null);

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
        localImageUrl.value = props.storeItem.image_url;
      } else {
        formData.value = getInitialFormData();
        localImageUrl.value = null;
      }
    }
  }
);

watch(
  () => props.storeItem?.image_url,
  (newUrl) => {
    if (props.open && props.storeItem) {
      localImageUrl.value = newUrl;
    }
  }
);

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

const handleOpenChange = (value) => {
  emit('update:open', value);
};

const handleSave = () => {
  const dataToSave = { ...formData.value };
  if (dataToSave.quantity === '' || dataToSave.quantity === null || isNaN(dataToSave.quantity)) {
    dataToSave.quantity = null;
  }
  emit('save', dataToSave);
};
</script>
