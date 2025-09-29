<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>{{ isEditing ? 'Редактировать ачивку' : 'Создать ачивку' }}</DialogTitle>
        <DialogDescription>
          {{ isEditing ? 'Обновите детали ачивки.' : 'Заполните детали для новой ачивки.' }}
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
          <Label for="mana_reward" class="text-right">
            Награда Mana
          </Label>
          <Input id="mana_reward" v-model="formData.mana_reward" type="number" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-start gap-4">
          <Label class="text-right pt-2">
            Требуемые миссии
          </Label>
          <div class="col-span-3 space-y-2">
            <div v-for="(missionId, index) in formData.required_mission_ids" :key="index" class="flex items-center gap-2">
              <Select v-model="formData.required_mission_ids[index]">
                <SelectTrigger>
                  <SelectValue placeholder="Выберите миссию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem :value="null">
                    Нет
                  </SelectItem>
                  <SelectItem
                    v-for="mission in missions"
                    :key="mission.id"
                    :value="mission.id"
                    :disabled="isMissionSelectedElsewhere(mission.id, index)"
                  >
                    {{ mission.title }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" @click="removeMission(index)">
                <X class="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" @click="addMission">
              <Plus class="h-4 w-4 mr-2" />
              Добавить миссию
            </Button>
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X } from 'lucide-vue-next';

const props = defineProps({
  open: Boolean,
  achievement: {
    type: Object,
    default: null,
  },
  missions: {
    type: Array,
    default: () => [],
  },
  isUploading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:open', 'save', 'delete', 'upload-image']);

const imageInput = ref(null);
const localImageUrl = ref(null);

const isEditing = computed(() => !!props.achievement);

const defaultFormData = () => ({
  name: '',
  description: '',
  mana_reward: 0,
  required_mission_ids: [],
});

const formData = ref(defaultFormData());

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    if (props.achievement) {
      formData.value = {
        name: props.achievement.name,
        description: props.achievement.description || '',
        mana_reward: props.achievement.mana_reward || 0,
        required_mission_ids: props.achievement.unlock_conditions?.required_missions || [],
      };
      localImageUrl.value = props.achievement.image_url;
    } else {
      formData.value = defaultFormData();
      localImageUrl.value = null;
    }
  }
});

watch(
  () => props.achievement?.image_url,
  (newUrl) => {
    if (props.open && props.achievement) {
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

const handleSave = () => {
  if (!formData.value.name) {
    // Basic validation, can be improved with a toast message
    console.error("Name is required");
    return;
  }
  
  const validMissionIds = formData.value.required_mission_ids.filter(id => id);
  
  const payload = {
    name: formData.value.name,
    description: formData.value.description || null,
    image_url: formData.value.image_url || null, // Keep image_url for initial creation/update if no file is uploaded
    mana_reward: Number(formData.value.mana_reward) || 0,
    unlock_conditions: null,
  };

  if (validMissionIds.length > 0) {
    payload.unlock_conditions = {
      required_missions: validMissionIds,
    };
  }

  emit('save', payload);
};

const handleDelete = () => {
  emit('delete');
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

const addMission = () => {
  formData.value.required_mission_ids.push(null);
};

const removeMission = (index) => {
  formData.value.required_mission_ids.splice(index, 1);
};

const isMissionSelectedElsewhere = (missionId, currentIndex) => {
  if (!missionId) return false; // Don't disable the "Нет" option
  return formData.value.required_mission_ids.some(
    (id, index) => id === missionId && index !== currentIndex
  );
};
</script>
