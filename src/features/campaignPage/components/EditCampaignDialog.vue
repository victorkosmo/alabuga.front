<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-[425px]">
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
    default: () => ({ title: '', description: '', status: '' }),
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

const formData = ref({ title: '', description: '', status: '' });

watch(
  () => props.campaign,
  (newCampaign) => {
    if (newCampaign) {
      formData.value.title = newCampaign.title;
      formData.value.description = newCampaign.description;
      formData.value.status = newCampaign.status;
    }
  },
  { immediate: true }
);

const handleOpenChange = (value) => {
  emit('update:open', value);
};

const handleSave = () => {
  emit('save', { ...formData.value });
};
</script>
