<template>
  <Dialog :open="isOpen" @update:open="handleClose">
    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>{{ isEditing ? 'Редактировать ранг' : 'Создать ранг' }}</DialogTitle>
        <DialogDescription>
          {{ isEditing ? 'Внесите изменения и нажмите "Сохранить".' : 'Заполните информацию о новом ранге.' }}
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="title" class="text-right">Название</Label>
          <Input id="title" v-model="form.title" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="description" class="text-right">Описание</Label>
          <Textarea id="description" v-model="form.description" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="priority" class="text-right">Приоритет</Label>
          <Input id="priority" v-model.number="form.priority" type="number" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-start gap-4">
          <Label class="text-right pt-2">Условия разблокировки</Label>
          <div class="col-span-3">
            <UnlockConditionsBuilder v-model="unlockConditions" />
          </div>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="image" class="text-right">Изображение</Label>
          <div class="col-span-3">
            <Input id="image" type="file" @change="handleFileChange" accept="image/*" />
            <img v-if="imagePreview" :src="imagePreview" alt="Предпросмотр" class="mt-2 max-h-32 rounded" />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="handleClose">Отмена</Button>
        <Button @click="handleSubmit" :disabled="isSaving">
          <Loader2 v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
          Сохранить
        </Button>
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
import { Loader2 } from 'lucide-vue-next';
import UnlockConditionsBuilder from './UnlockConditionsBuilder.vue';

const props = defineProps({
  isOpen: Boolean,
  rank: Object,
  isSaving: Boolean,
});

const emit = defineEmits(['close', 'save']);

const isEditing = computed(() => !!props.rank?.id);

const form = ref({});
const imageFile = ref(null);
const imagePreview = ref(null);
const unlockConditions = ref({});

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    imageFile.value = null;

    if (isEditing.value) {
      form.value = { ...props.rank };
      imagePreview.value = props.rank.image_url || null;
      unlockConditions.value = props.rank.unlock_conditions || {};
    } else {
      form.value = {
        title: '',
        description: '',
        priority: 0,
      };
      imagePreview.value = null;
      unlockConditions.value = {};
    }
  }
});

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleClose = () => {
  emit('close');
};

const handleSubmit = () => {
  const rankData = { ...form.value };

  // Overwrite unlock_conditions with the stringified version from the builder
  rankData.unlock_conditions = JSON.stringify(unlockConditions.value);

  if (imageFile.value) {
    rankData.image = imageFile.value;
  }

  delete rankData.id;
  delete rankData.image_url;
  delete rankData.created_at;
  delete rankData.updated_at;

  emit('save', rankData);
};
</script>
