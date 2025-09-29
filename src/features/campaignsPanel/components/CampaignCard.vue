<template>
  <Card class="overflow-hidden cursor-pointer transition-all hover:shadow-md" @click="goToCampaign(campaign.id)">
    <div class="flex flex-col md:flex-row md:h-[300px]">
      <div class="flex flex-grow flex-col p-6">
        <div class="flex items-start justify-between mb-2">
          <h3 class="text-xl font-bold pr-4">{{ campaign.title }}</h3>
          <Badge :variant="statusVariant(campaign.status)" class="flex-shrink-0">{{ campaign.status }}</Badge>
        </div>
        <p v-if="campaign.description" class="text-sm text-muted-foreground mb-4 line-clamp-2">{{ campaign.description }}</p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mt-auto">
          <div>
            <p class="font-semibold text-muted-foreground">Код активации</p>
            <p class="font-mono">{{ campaign.activation_code || 'N/A' }}</p>
          </div>
          <div>
            <p class="font-semibold text-muted-foreground">Даты проведения</p>
            <p>{{ formatDateRange(campaign.start_date, campaign.end_date) }}</p>
          </div>
          <div>
            <p class="font-semibold text-muted-foreground">Участники</p>
            <p>{{ formatParticipants(campaign.current_participants, campaign.max_participants) }}</p>
          </div>
        </div>
      </div>
      <div class="md:w-1/4 flex-shrink-0 bg-secondary order-first md:order-last">
        <img
          v-if="campaign.cover_url"
          :src="campaign.cover_url"
          :alt="campaign.title"
          class="h-48 md:h-full w-full object-cover"
        />
        <div v-else class="h-48 md:h-full w-full flex items-center justify-center">
          <ImageIcon class="h-16 w-16 text-muted-foreground" />
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageIcon } from 'lucide-vue-next';

const router = useRouter();

defineProps({
  campaign: {
    type: Object,
    required: true,
  },
});

const goToCampaign = (id) => {
  router.push(`/campaigns/${id}`);
};

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
  return new Date(dateString).toLocaleDateString();
};

const formatDateRange = (start, end) => {
  if (!start && !end) return 'Не заданы';
  const startDate = start ? formatDate(start) : '...';
  const endDate = end ? formatDate(end) : '...';
  return `${startDate} - ${endDate}`;
};

const formatParticipants = (current, max) => {
  const maxDisplay = max === null ? 'Неограниченно' : max;
  return `${current} / ${maxDisplay}`;
};
</script>
