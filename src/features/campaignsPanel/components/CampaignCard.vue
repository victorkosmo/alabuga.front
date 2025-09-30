<template>
  <Card class="overflow-hidden cursor-pointer transition-all hover:shadow-md" @click="goToCampaign(campaign.id)">
    <div class="flex flex-col md:flex-row">
      <div class="flex flex-grow flex-col p-6">
        <div class="flex justify-between items-start mb-4">
          <div class="flex-grow pr-4">
            <h3 class="text-xl font-bold">{{ campaign.title }}</h3>
            <p class="text-sm text-muted-foreground mt-1">{{ formatDateRange(campaign.start_date, campaign.end_date) }}</p>
          </div>
          <div class="flex-shrink-0 text-right">
            <Badge :variant="statusVariant(campaign.status)">{{ campaign.status }}</Badge>
            <div class="mt-1">
              <p class="text-xs text-muted-foreground">Код активации</p>
              <p class="font-mono text-sm">{{ campaign.activation_code || 'N/A' }}</p>
            </div>
          </div>
        </div>
        <p v-if="campaign.description" class="text-sm text-muted-foreground mb-4 line-clamp-2">{{ campaign.description }}</p>

        <CampaignCardDetails :campaign="campaign" />
      </div>
      <div class="relative h-48 md:w-1/4 flex-shrink-0 bg-secondary order-first md:order-last">
        <img
          v-if="campaign.cover_url"
          :src="campaign.cover_url"
          :alt="campaign.title"
          class="absolute inset-0 h-full w-full object-cover"
        />
        <div v-else class="flex h-full w-full items-center justify-center">
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
import CampaignCardDetails from './CampaignCardDetails.vue';

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
</script>
