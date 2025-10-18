<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between">
      <CardTitle>{{ rank.title }}</CardTitle>
      <Button variant="ghost" size="icon" @click="$emit('edit', rank)">
        <Pencil class="h-4 w-4" />
      </Button>
    </CardHeader>
    <CardContent class="grid gap-4">
      <div v-if="rank.image_url" class="flex justify-center">
        <img :src="rank.image_url" :alt="rank.title" class="rounded-md max-h-48 object-contain" />
      </div>
      <p class="text-sm text-muted-foreground break-words">
        {{ rank.description || 'Нет описания.' }}
      </p>
      <div>
        <span class="font-semibold">Приоритет:</span> {{ rank.priority }}
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-vue-next';

defineProps({
  rank: {
    type: Object,
    required: true,
  },
});

defineEmits(['edit']);
</script>
