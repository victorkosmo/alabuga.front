<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>Редактировать кампанию</DialogTitle>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="title" class="text-right">Название</Label>
          <Input id="title" v-model="formData.title" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="description" class="text-right">Описание</Label>
          <Textarea id="description" v-model="formData.description" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="status" class="text-right">Статус</Label>
          <Select v-model="formData.status">
            <SelectTrigger class="col-span-3">
              <SelectValue placeholder="Выберите статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="status in campaignStatuses" :key="status.value" :value="status.value">
                {{ status.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="start_date" class="text-right">Дата начала</Label>
          <Input id="start_date" type="datetime-local" v-model="formData.start_date" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="end_date" class="text-right">Дата окончания</Label>
          <Input id="end_date" type="datetime-local" v-model="formData.end_date" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="max_participants" class="text-right">Макс. участников</Label>
          <Input id="max_participants" v-model="formData.max_participants" type="number" class="col-span-3" placeholder="Неограниченно" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="handleOpenChange(false)">Отмена</Button>
        <Button @click="handleSave" :disabled="!formData.title">Сохранить</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const props = defineProps({
  open: Boolean,
  campaign: {
    type: Object,
    default: () => ({ title: '', description: '', status: '', start_date: null, end_date: null, max_participants: null }),
  },
});

const emit = defineEmits(['update:open', 'save']);

const campaignStatuses = [
  { value: 'DRAFT', label: 'Черновик' },
  { value: 'ACTIVE', label: 'Активна' },
  { value: 'PAUSED', label: 'Приостановлена' },
  { value: 'COMPLETED', label: 'Завершена' },
  { value: 'ARCHIVED', label: 'В архиве' },
];

const formData = ref({ title: '', description: '', status: '', start_date: '', end_date: '', max_participants: null });

const formatForInput = (dateString) => {
  if (!dateString) return '';
  // API returns ISO string like '2024-05-21T10:00:00Z'
  // datetime-local input needs 'YYYY-MM-DDTHH:mm'
  return dateString.slice(0, 16);
};

watch(
  () => props.campaign,
  (newCampaign) => {
    if (newCampaign) {
      formData.value.title = newCampaign.title;
      formData.value.description = newCampaign.description;
      formData.value.status = newCampaign.status;
      formData.value.start_date = formatForInput(newCampaign.start_date);
      formData.value.end_date = formatForInput(newCampaign.end_date);
      formData.value.max_participants = newCampaign.max_participants ?? null;
    }
  },
  { immediate: true }
);

const handleOpenChange = (value) => {
  emit('update:open', value);
};

const handleSave = () => {
  const payload = {
    ...formData.value,
    start_date: formData.value.start_date ? new Date(formData.value.start_date).toISOString() : null,
    end_date: formData.value.end_date ? new Date(formData.value.end_date).toISOString() : null,
    max_participants: (formData.value.max_participants === '' || formData.value.max_participants === null) ? null : Number(formData.value.max_participants),
  };
  emit('save', payload);
};
</script>
