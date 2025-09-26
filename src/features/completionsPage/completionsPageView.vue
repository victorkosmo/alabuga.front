<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <header class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" @click="router.back()" class="h-8 w-8">
          <ArrowLeft class="h-5 w-5" />
        </Button>
        <h1 class="text-3xl font-bold">Проверка заполнений миссии</h1>
      </div>
    </header>

    <div v-if="isLoading" class="space-y-4">
      <Skeleton class="h-12 w-full" />
      <Skeleton class="h-12 w-full" />
      <Skeleton class="h-12 w-full" />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <h2 class="text-xl font-semibold">Не удалось загрузить проверки</h2>
      <p class="text-muted-foreground">{{ error }}</p>
      <Button @click="fetchCompletions(1)" class="mt-4">Попробовать снова</Button>
    </div>

    <div v-else-if="completions.length > 0">
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Пользователь</TableHead>
              <TableHead>Ссылка</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead class="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="completion in completions" :key="completion.id">
              <TableCell>{{ completion.first_name || completion.username }}</TableCell>
              <TableCell>
                <a
                  :href="completion.result_data"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-500 hover:underline"
                >
                  {{ completion.result_data }}
                </a>
              </TableCell>
              <TableCell>
                <Badge :variant="statusVariant(completion.status)">{{
                  statusText(completion.status)
                }}</Badge>
              </TableCell>
              <TableCell>{{ new Date(completion.created_at).toLocaleString() }}</TableCell>
              <TableCell class="text-right">
                <div v-if="completion.status === 'PENDING_REVIEW'" class="flex gap-2 justify-end">
                  <Button size="sm" variant="outline" @click="handleApprove(completion.id)"
                    >Одобрить</Button
                  >
                  <Button size="sm" variant="destructive" @click="openRejectDialog(completion)"
                    >Отклонить</Button
                  >
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
      <!-- TODO: Add pagination controls using the 'pagination' object from useCompletions -->
    </div>

    <div v-else class="text-center py-12">
      <h2 class="text-xl font-semibold">Нет проверок</h2>
      <p class="text-muted-foreground">Пока никто не выполнил эту миссию.</p>
    </div>

    <Dialog v-model:open="isRejectDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Отклонить выполнение</DialogTitle>
          <DialogDescription>
            Укажите причину отклонения. Пользователь увидит этот комментарий.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <Textarea v-model="rejectionComment" placeholder="Причина отклонения..." />
        </div>
        <DialogFooter>
          <Button variant="outline" @click="isRejectDialogOpen = false">Отмена</Button>
          <Button @click="handleReject" :disabled="!rejectionComment.trim()">Отклонить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCompletions } from './composables/useCompletions';
import { ArrowLeft } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Skeleton from '@/components/ui/skeleton/Skeleton.vue';

const router = useRouter();
const { completions, pagination, isLoading, error, fetchCompletions, updateCompletionStatus } =
  useCompletions();

const isRejectDialogOpen = ref(false);
const selectedCompletion = ref(null);
const rejectionComment = ref('');

const statusMap = {
  PENDING_REVIEW: { text: 'На проверке', variant: 'secondary' },
  APPROVED: { text: 'Одобрено', variant: 'default' },
  REJECTED: { text: 'Отклонено', variant: 'destructive' },
};

const statusText = (status) => statusMap[status]?.text || status;
const statusVariant = (status) => statusMap[status]?.variant || 'outline';

const handleApprove = (completionId) => {
  updateCompletionStatus(completionId, 'APPROVED');
};

const openRejectDialog = (completion) => {
  selectedCompletion.value = completion;
  rejectionComment.value = '';
  isRejectDialogOpen.value = true;
};

const handleReject = () => {
  if (!selectedCompletion.value || !rejectionComment.value.trim()) return;
  updateCompletionStatus(selectedCompletion.value.id, 'REJECTED', rejectionComment.value.trim());
  isRejectDialogOpen.value = false;
};
</script>
