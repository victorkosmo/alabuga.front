<template>
  <div
    class="border rounded-lg overflow-hidden bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md cursor-pointer"
    @click="goToCampaign(campaign.id)"
  >
    <div class="flex flex-col md:flex-row">
      <!-- Image Section -->
      <div class="relative order-first md:order-last md:w-1/3 lg:w-1/4 h-48 md:h-auto flex-shrink-0">
        <img
          v-if="campaign.cover_url"
          :src="campaign.cover_url"
          :alt="campaign.title"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <div v-else class="flex h-full w-full items-center justify-center bg-secondary">
          <ImageIcon class="h-16 w-16 text-muted-foreground" />
        </div>
      </div>

      <!-- Content Section -->
      <div class="flex flex-col p-6 flex-grow">
        <!-- Top Content: Title, Badge, Description -->
        <div class="flex-shrink-0">
          <div class="flex justify-between items-start mb-4">
            <div class="flex-grow pr-4">
              <h3 class="text-xl font-bold line-clamp-2">{{ campaign.title }}</h3>
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
          <p v-if="campaign.description" class="text-sm text-muted-foreground mb-4 line-clamp-3">{{ campaign.description }}</p>
        </div>

       <CampaignCardDetails :campaign="campaign" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
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
