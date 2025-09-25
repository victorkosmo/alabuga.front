<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Название</TableHead>
        <TableHead>Статус</TableHead>
        <TableHead>Код активации</TableHead>
        <TableHead>Даты проведения</TableHead>
        <TableHead>Участники</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <template v-if="campaigns.length">
        <TableRow
          v-for="campaign in campaigns"
          :key="campaign.id"
          class="cursor-pointer hover:bg-muted/50"
          @click="goToCampaign(campaign.id)"
        >
          <TableCell class="font-medium">
            {{ campaign.title }}
          </TableCell>
          <TableCell>
            <Badge :variant="statusVariant(campaign.status)">{{ campaign.status }}</Badge>
          </TableCell>
          <TableCell>{{ campaign.activation_code }}</TableCell>
          <TableCell>{{ formatDateRange(campaign.start_date, campaign.end_date) }}</TableCell>
          <TableCell>{{ formatParticipants(campaign.current_participants, campaign.max_participants) }}</TableCell>
        </TableRow>
      </template>
      <template v-else>
        <TableRow>
          <TableCell :colspan="5" class="h-24 text-center">
            Нет данных.
          </TableCell>
        </TableRow>
      </template>
    </TableBody>
  </Table>
</template>

<script setup>
import { useRouter } from 'vue-router';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const router = useRouter();

defineProps({
  campaigns: {
    type: Array,
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

const formatParticipants = (current, max) => {
  const maxDisplay = max === null ? 'Неограниченно' : max;
  return `${current} / ${maxDisplay}`;
};
</script>
