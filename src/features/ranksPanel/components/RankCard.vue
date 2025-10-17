<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ rank.title }}</CardTitle>
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

defineProps({
  rank: {
    type: Object,
    required: true,
  },
});
</script>
