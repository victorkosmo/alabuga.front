<template>
  <div class="space-y-4">
    <div v-if="isLoading" class="space-y-2">
      <Skeleton class="h-8 w-1/3" />
      <Skeleton class="h-24 w-full" />
      <Skeleton class="h-8 w-1/3" />
      <Skeleton class="h-24 w-full" />
    </div>
    <div v-else>
      <!-- Campaigns -->
      <div>
        <Label>Требуемое участие в кампаниях (условие ИЛИ)</Label>
        <div class="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
          <div v-for="campaign in availableCampaigns" :key="campaign.id" class="flex items-center space-x-2">
            <Checkbox :id="`camp-${campaign.id}`" :checked="selectedCampaignIds.includes(campaign.id)" @update:checked="checked => toggleSelection(selectedCampaignIds, campaign.id, checked)" />
            <label :for="`camp-${campaign.id}`" class="text-sm font-medium leading-none">
              {{ campaign.title }}
            </label>
          </div>
          <p v-if="!availableCampaigns.length" class="text-sm text-muted-foreground text-center">Нет доступных кампаний.</p>
        </div>
      </div>

      <!-- Achievements -->
      <div>
        <Label>Требуемые ачивки (условие И)</Label>
        <div class="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
          <div v-for="ach in availableAchievements" :key="ach.id" class="flex items-center space-x-2">
            <Checkbox :id="`ach-${ach.id}`" :checked="selectedAchievementIds.includes(ach.id)" @update:checked="checked => toggleSelection(selectedAchievementIds, ach.id, checked)" />
            <label :for="`ach-${ach.id}`" class="text-sm font-medium leading-none">
              {{ ach.name }} <span class="text-xs text-muted-foreground">({{ ach.campaign_title }})</span>
            </label>
          </div>
          <p v-if="!availableAchievements.length" class="text-sm text-muted-foreground text-center">Нет доступных ачивок.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toRefs, watch } from 'vue';
import { useUnlockConditionsBuilder } from '../composables/useUnlockConditionsBuilder';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';

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

const toggleSelection = (selectionArray, id, isChecked) => {
  const index = selectionArray.value.indexOf(id);
  if (isChecked && index === -1) {
    selectionArray.value.push(id);
  } else if (!isChecked && index !== -1) {
    selectionArray.value.splice(index, 1);
  }
};
</script>
