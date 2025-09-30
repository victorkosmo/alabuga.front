<template>
  <div class="space-y-4">
    <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
      <CampaignCardSection
        title="Ачивки"
        :items="campaign.achievements"
        :placeholder-icon="TrophyIcon"
        placeholder-text="Ачивки не добавлены"
      />
      <CampaignCardSection
        title="Товары в магазине"
        :items="campaign.store_items"
        :placeholder-icon="ShoppingBagIcon"
        placeholder-text="Товары не добавлены"
      />
    </div>
    <CampaignStatsFunnel v-if="campaign.stats" :stats="campaign.stats" />
  </div>
</template>

<script setup>
import { TrophyIcon, ShoppingBagIcon } from 'lucide-vue-next';
import CampaignCardSection from './CampaignCardSection.vue';
import CampaignStatsFunnel from './CampaignStatsFunnel.vue';

defineProps({
  campaign: {
    type: Object,
    required: true,
  },
});
</script>
