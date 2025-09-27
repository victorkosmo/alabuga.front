<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>{{ isEditing ? 'Редактировать ачивку' : 'Создать ачивку' }}</DialogTitle>
        <DialogDescription>
          {{ isEditing ? 'Обновите детали ачивки.' : 'Заполните детали для новой ачивки.' }}
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
                  <SelectItem v-for="mission in missions" :key="mission.id" :value="mission.id">
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
});

const emit = defineEmits(['update:open', 'save', 'delete']);

const isEditing = computed(() => !!props.achievement);

const defaultFormData = () => ({
  name: '',
  description: '',
  image_url: '',
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
        image_url: props.achievement.image_url || '',
        mana_reward: props.achievement.mana_reward || 0,
        required_mission_ids: props.achievement.unlock_conditions?.required_missions || [],
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
    // Basic validation, can be improved with a toast message
    console.error("Name is required");
    return;
  }
  
  const validMissionIds = formData.value.required_mission_ids.filter(id => id);
  
  const payload = {
    name: formData.value.name,
    description: formData.value.description || null,
    image_url: formData.value.image_url || null,
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

const addMission = () => {
  formData.value.required_mission_ids.push(null);
};

const removeMission = (index) => {
  formData.value.required_mission_ids.splice(index, 1);
};
</script>
