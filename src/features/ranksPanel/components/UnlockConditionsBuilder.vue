<template>
  <div class="space-y-4">
    <div v-if="isLoading" class="space-y-2">
      <Skeleton class="h-10 w-full" />
      <Skeleton class="h-24 w-full" />
      <Skeleton class="h-10 w-full" />
      <Skeleton class="h-24 w-full" />
    </div>
    <div v-else class="space-y-6">
      <!-- Campaigns -->
      <div class="space-y-2">
        <Label>Требуемое участие в кампаниях (условие ИЛИ)</Label>
        <Select @update:modelValue="addCampaign" :disabled="unselectedCampaigns.length === 0">
          <SelectTrigger>
            <SelectValue placeholder="Добавить кампанию..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="campaign in unselectedCampaigns" :key="campaign.id" :value="campaign.id">
              {{ campaign.title }}
            </SelectItem>
          </SelectContent>
        </Select>
        <div class="mt-2 space-y-1 border rounded-md p-2 min-h-[8rem] max-h-48 overflow-y-auto">
          <div v-for="campaignId in selectedCampaignIds" :key="campaignId" class="flex items-center justify-between text-sm p-1 hover:bg-accent rounded">
            <span>{{ getCampaignTitle(campaignId) }}</span>
            <Button variant="ghost" size="icon" class="h-6 w-6 shrink-0" @click="removeCampaign(campaignId)">
              <X class="h-4 w-4" />
            </Button>
          </div>
          <p v-if="!selectedCampaignIds.length" class="text-xs text-muted-foreground text-center pt-2">Кампании не добавлены.</p>
        </div>
      </div>

      <!-- Achievements -->
      <div class="space-y-2">
        <Label>Требуемые ачивки (условие И)</Label>
        <Select @update:modelValue="addAchievement" :disabled="unselectedAchievements.length === 0">
          <SelectTrigger>
            <SelectValue placeholder="Добавить ачивку..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="ach in unselectedAchievements" :key="ach.id" :value="ach.id">
              {{ ach.name }} ({{ ach.campaign_title }})
            </SelectItem>
          </SelectContent>
        </Select>
        <div class="mt-2 space-y-1 border rounded-md p-2 min-h-[8rem] max-h-48 overflow-y-auto">
          <div v-for="achievementId in selectedAchievementIds" :key="achievementId" class="flex items-center justify-between text-sm p-1 hover:bg-accent rounded">
            <span class="truncate pr-2">{{ getAchievementDetails(achievementId) }}</span>
            <Button variant="ghost" size="icon" class="h-6 w-6 shrink-0" @click="removeAchievement(achievementId)">
              <X class="h-4 w-4" />
            </Button>
          </div>
          <p v-if="!selectedAchievementIds.length" class="text-xs text-muted-foreground text-center pt-2">Ачивки не добавлены.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, toRefs, watch } from 'vue';
import { useUnlockConditionsBuilder } from '../composables/useUnlockConditionsBuilder';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-vue-next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:modelValue']);

const { modelValue } = toRefs(props);

const {
  isLoading,
  availableCampaigns,
  availableAchievements,
  selectedCampaignIds,
  selectedAchievementIds,
  unlockConditions,
} = useUnlockConditionsBuilder(modelValue);

watch(unlockConditions, (newConditions) => {
  emit('update:modelValue', newConditions);
});

const unselectedCampaigns = computed(() => {
  return availableCampaigns.value.filter(c => !selectedCampaignIds.value.includes(c.id));
});

const unselectedAchievements = computed(() => {
  return availableAchievements.value.filter(a => !selectedAchievementIds.value.includes(a.id));
});

const getCampaignTitle = (id) => {
  return availableCampaigns.value.find(c => c.id === id)?.title || 'Неизвестная кампания';
};

const getAchievementDetails = (id) => {
  const ach = availableAchievements.value.find(a => a.id === id);
  return ach ? `${ach.name} (${ach.campaign_title})` : 'Неизвестная ачивка';
};

const addCampaign = (campaignId) => {
  if (campaignId && !selectedCampaignIds.value.includes(campaignId)) {
    selectedCampaignIds.value.push(campaignId);
  }
};

const removeCampaign = (campaignId) => {
  selectedCampaignIds.value = selectedCampaignIds.value.filter(id => id !== campaignId);
};

const addAchievement = (achievementId) => {
  if (achievementId && !selectedAchievementIds.value.includes(achievementId)) {
    selectedAchievementIds.value.push(achievementId);
  }
};

const removeAchievement = (achievementId) => {
  selectedAchievementIds.value = selectedAchievementIds.value.filter(id => id !== achievementId);
};
</script>
