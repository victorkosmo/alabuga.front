<template>
  <Card class="mt-6">
    <CardHeader>
      <CardTitle>Участники</CardTitle>
    </CardHeader>
    <CardContent>
      <p class="text-lg">{{ formatParticipants(campaign.current_participants, campaign.max_participants) }}</p>
    </CardContent>
  </Card>
</template>

<script setup>
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

defineProps({
  campaign: {
    type: Object,
    required: true,
  },
});

const formatParticipants = (current, max) => {
  const maxDisplay = max === null ? 'Неограниченно' : max;
  return `${current} / ${maxDisplay}`;
};
</script>
