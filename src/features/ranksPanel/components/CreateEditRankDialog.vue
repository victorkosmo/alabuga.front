<template>
  <Dialog :open="isOpen" @update:open="handleClose">
    <DialogContent class="sm:max-w-[800px]">
      <DialogHeader>
        <DialogTitle>{{ isEditing ? 'Редактировать ранг' : 'Создать ранг' }}</DialogTitle>
        <DialogDescription>
          {{ isEditing ? 'Внесите изменения и нажмите "Сохранить".' : 'Заполните информацию о новом ранге.' }}
        </DialogDescription>
      </DialogHeader>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
        <!-- Left Column: Rank Details -->
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="title">Название</Label>
            <Input id="title" v-model="form.title" />
          </div>
          <div class="space-y-2">
            <Label for="description">Описание</Label>
            <Textarea id="description" v-model="form.description" />
          </div>
          <div class="space-y-2">
            <Label for="priority">Приоритет</Label>
            <Input id="priority" v-model.number="form.priority" type="number" />
          </div>
          <div class="space-y-2">
            <Label for="image">Изображение</Label>
            <Input id="image" type="file" @change="handleFileChange" accept="image/*" />
            <img v-if="imagePreview" :src="imagePreview" alt="Предпросмотр" class="mt-2 max-h-32 rounded" />
          </div>
        </div>

        <!-- Right Column: Unlock Conditions -->
        <div class="space-y-2">
          <Label>Условия разблокировки</Label>
          <UnlockConditionsBuilder v-model="unlockConditions" />
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
