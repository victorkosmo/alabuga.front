<template>
  <header class="mb-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold">{{ campaign.title }}</h1>
      <div class="flex gap-2">
        <Button variant="outline" @click="$emit('edit')">Редактировать</Button>
        <Button variant="destructive" @click="$emit('delete')">Удалить</Button>
      </div>
    </div>
    <p class="text-muted-foreground mt-1">{{ campaign.description }}</p>
  </header>
</template>

<script setup>
import { Button } from '@/components/ui/button';

defineProps({
  campaign: {
    type: Object,
    required: true,
  },
});

defineEmits(['edit', 'delete']);
</script>
