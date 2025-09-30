<template>
  <Card class="overflow-hidden cursor-pointer transition-all hover:shadow-md" @click="goToCampaign(campaign.id)">
    <div class="flex flex-col md:flex-row md:h-[300px]">
      <div class="flex flex-grow flex-col p-6">
        <div class="flex items-start justify-between mb-2">
          <h3 class="text-xl font-bold pr-4">{{ campaign.title }}</h3>
          <Badge :variant="statusVariant(campaign.status)" class="flex-shrink-0">{{ campaign.status }}</Badge>
        </div>
        <p v-if="campaign.description" class="text-sm text-muted-foreground mb-4 line-clamp-2">{{ campaign.description }}</p>

        <div class="mb-4 space-y-4">
          <div v-if="campaign.achievements?.length">
            <p class="text-sm font-semibold text-muted-foreground mb-2">Ачивки</p>
            <div class="flex items-center -space-x-2">
              <div v-for="achievement in campaign.achievements.slice(0, 5)" :key="achievement.title" class="relative h-10 w-10 border-2 border-card rounded-full" :title="achievement.title">
                <img v-if="achievement.image_url" :src="achievement.image_url" :alt="achievement.title" class="h-full w-full rounded-full object-cover" />
                <div v-else class="flex h-full w-full items-center justify-center rounded-full bg-muted">
                  <TrophyIcon class="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div v-if="campaign.achievements.length > 5" class="flex items-center justify-center h-10 w-10 rounded-full bg-muted-foreground/20 text-xs font-medium text-muted-foreground border-2 border-card">
                +{{ campaign.achievements.length - 5 }}
              </div>
            </div>
          </div>
          <div v-if="campaign.store_items?.length">
            <p class="text-sm font-semibold text-muted-foreground mb-2">Товары в магазине</p>
            <div class="flex items-center -space-x-2">
              <div v-for="item in campaign.store_items.slice(0, 5)" :key="item.title" class="relative h-10 w-10 border-2 border-card rounded-full" :title="item.title">
                <img v-if="item.image_url" :src="item.image_url" :alt="item.title" class="h-full w-full rounded-full object-cover" />
                <div v-else class="flex h-full w-full items-center justify-center rounded-full bg-muted">
                  <ShoppingBagIcon class="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div v-if="campaign.store_items.length > 5" class="flex items-center justify-center h-10 w-10 rounded-full bg-muted-foreground/20 text-xs font-medium text-muted-foreground border-2 border-card">
                +{{ campaign.store_items.length - 5 }}
              </div>
            </div>
          </div>
          <CampaignStatsFunnel v-if="campaign.stats" :stats="campaign.stats" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-auto">
          <div>
            <p class="font-semibold text-muted-foreground">Код активации</p>
            <p class="font-mono">{{ campaign.activation_code || 'N/A' }}</p>
          </div>
          <div>
            <p class="font-semibold text-muted-foreground">Даты проведения</p>
            <p>{{ formatDateRange(campaign.start_date, campaign.end_date) }}</p>
          </div>
        </div>
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
import { ImageIcon, ShoppingBagIcon, TrophyIcon } from 'lucide-vue-next';
import CampaignStatsFunnel from './CampaignStatsFunnel.vue';

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
