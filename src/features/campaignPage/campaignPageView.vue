<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div v-if="isLoading" class="space-y-4">
      <Skeleton class="h-10 w-1/2" />
      <Skeleton class="h-8 w-1/4" />
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Skeleton class="h-32 w-full" />
        <Skeleton class="h-32 w-full" />
        <Skeleton class="h-32 w-full" />
      </div>
    </div>

    <div v-else-if="error">
      <div class="text-center py-12">
        <h2 class="text-xl font-semibold">Не удалось загрузить кампанию</h2>
        <p class="text-muted-foreground">{{ error }}</p>
        <Button @click="fetchCampaign" class="mt-4">Попробовать снова</Button>
      </div>
    </div>

    <div v-else-if="campaign">
      <header class="mb-6">
        <h1 class="text-3xl font-bold">{{ campaign.title }}</h1>
        <p class="text-muted-foreground mt-1">{{ campaign.description }}</p>
      </header>

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
            <p class="text-lg">{{ formatParticipants(campaign.max_participants) }}</p>
          </CardContent>
        </Card>
      </div>
      
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
    </div>
  </div>
</template>

<script setup>
import { useCampaign } from './composables/useCampaign';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const { campaign, isLoading, error, fetchCampaign } = useCampaign();

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
  return new Date(dateString).toLocaleString();
};

const formatDateRange = (start, end) => {
  if (!start && !end) return 'Не заданы';
  const startDate = start ? new Date(start).toLocaleDateString() : '...';
  const endDate = end ? new Date(end).toLocaleDateString() : '...';
  return `${startDate} - ${endDate}`;
};

const formatParticipants = (max) => {
  return max === null ? 'Неограниченно' : `до ${max}`;
};
</script>
