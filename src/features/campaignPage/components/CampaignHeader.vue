<template>
  <header class="mb-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" @click="goToCampaignsPage" class="h-8 w-8">
          <ArrowLeft class="h-5 w-5" />
        </Button>
        <div class="flex items-center gap-3">
          <h1 class="text-3xl font-bold">{{ campaign.title }}</h1>
          <Badge :variant="statusVariant(campaign.status)">{{ campaign.status }}</Badge>
        </div>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" @click="$emit('edit')">Редактировать</Button>
        <Button variant="destructive" @click="$emit('delete')">Удалить</Button>
      </div>
    </div>
    <div class="flex items-center gap-4 text-sm text-muted-foreground mt-2">
      <span>Даты: {{ formatDateRange(campaign.start_date, campaign.end_date) }}</span>
      <span>•</span>
      <span>Создана: {{ formatDate(campaign.created_at) }}</span>
    </div>
    <p class="text-muted-foreground mt-3">{{ campaign.description }}</p>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ArrowLeft } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const router = useRouter();

const goToCampaignsPage = () => {
  router.push({ name: 'Кампании' });
};

defineProps({
  campaign: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['edit', 'delete']);

const statusVariant = (status) => {
  const variants = {
    DRAFT: 'secondary',
    ACTIVE: 'default',
    PAUSED: 'outline',
    COMPLETED: 'secondary',
    ARCHIVED: 'outline',
  };
  return variants[status] || 'secondary';
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
};

const formatDateRange = (start, end) => {
  if (!start && !end) return 'Не заданы';
  const startDate = start ? new Date(start).toLocaleDateString() : '...';
  const endDate = end ? new Date(end).toLocaleDateString() : '...';
  return `${startDate} - ${endDate}`;
};
</script>
