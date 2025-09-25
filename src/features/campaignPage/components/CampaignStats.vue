<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Статус</CardTitle>
      </CardHeader>
      <CardContent>
        <Badge :variant="statusVariant(campaign.status)">{{ campaign.status }}</Badge>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Код активации</CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-2xl font-mono">{{ campaign.activation_code }}</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Участники</CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-lg">{{ formatParticipants(campaign.current_participants, campaign.max_participants) }}</p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

defineProps({
  campaign: {
    type: Object,
    required: true,
  },
});

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

const formatParticipants = (current, max) => {
  const maxDisplay = max === null ? 'Неограниченно' : max;
  return `${current} / ${maxDisplay}`;
};
</script>
