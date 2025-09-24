<template>
  <Card class="mt-6">
    <CardHeader>
      <CardTitle>Детали</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <div>
        <h3 class="font-semibold">Даты проведения</h3>
        <p>{{ formatDateRange(campaign.start_date, campaign.end_date) }}</p>
      </div>
      <div>
        <h3 class="font-semibold">Создана</h3>
        <p>{{ formatDate(campaign.created_at) }}</p>
      </div>
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
