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
          <div class="col-span-3 space-y-4">
            <div class="flex items-center space-x-2">
              <Checkbox id="campaignJoined" v-model:checked="isCampaignJoinedRequired" />
              <label for="campaignJoined" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Требуется участие в кампании
              </label>
            </div>

            <div>
              <Label>Требуемые ачивки</Label>
              <div class="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                <div v-for="ach in availableAchievements" :key="ach.id" class="flex items-center space-x-2">
                  <Checkbox :id="`ach-${ach.id}`" :checked="selectedAchievementIds.includes(ach.id)" @update:checked="checked => toggleAchievement(ach.id, checked)" />
                  <label :for="`ach-${ach.id}`" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {{ ach.title }}
                  </label>
                </div>
                <p v-if="!availableAchievements.length" class="text-sm text-muted-foreground text-center">Нет доступных ачивок.</p>
              </div>
            </div>
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
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-vue-next';
import { errorMessage } from '@/utils/toast';

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

const isCampaignJoinedRequired = ref(false);
const selectedAchievementIds = ref([]);
// Mocked data for achievement selection. This will be replaced with real data later.
const availableAchievements = ref([
  { id: 'ach_uuid_1', title: 'Первооткрыватель' },
  { id: 'ach_uuid_2', title: 'Мастер квестов' },
  { id: 'ach_uuid_3', title: 'Социальный гуру' },
]);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    // Reset state
    isCampaignJoinedRequired.value = false;
    selectedAchievementIds.value = [];
    imageFile.value = null;

    if (isEditing.value) {
      form.value = { ...props.rank };
      imagePreview.value = props.rank.image_url || null;
      
      // Parse existing conditions
      const conditions = props.rank.unlock_conditions || {};
      isCampaignJoinedRequired.value = !!conditions.campaign_joined;
      selectedAchievementIds.value = conditions.required_achievements?.ids || [];
    } else {
      form.value = {
        title: '',
        description: '',
        priority: 0,
      };
      imagePreview.value = null;
    }
  }
});

const toggleAchievement = (achievementId, isChecked) => {
  const index = selectedAchievementIds.value.indexOf(achievementId);
  if (isChecked && index === -1) {
    selectedAchievementIds.value.push(achievementId);
  } else if (!isChecked && index !== -1) {
    selectedAchievementIds.value.splice(index, 1);
  }
};

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

  // Build unlock_conditions from UI state
  const conditions = {};
  if (isCampaignJoinedRequired.value) {
    conditions.campaign_joined = true;
  }
  if (selectedAchievementIds.value.length > 0) {
    conditions.required_achievements = {
      operator: 'AND',
      ids: selectedAchievementIds.value,
    };
  }
  rankData.unlock_conditions = JSON.stringify(Object.keys(conditions).length > 0 ? conditions : {});

  if (imageFile.value) {
    rankData.image = imageFile.value;
  }

  delete rankData.id;
  delete rankData.image_url;
  delete rankData.created_at;
  delete rankData.updated_at;
  // The unlock_conditions from the original rank object should not be sent
  if (rankData.unlock_conditions && form.value.unlock_conditions) {
    delete form.value.unlock_conditions;
  }

  emit('save', rankData);
};
</script>
