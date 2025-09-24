<template>
  <header class="mb-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" @click="router.back()" class="h-8 w-8">
          <ArrowLeft class="h-5 w-5" />
        </Button>
        <h1 class="text-3xl font-bold">{{ campaign.title }}</h1>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" @click="$emit('edit')">Редактировать</Button>
        <Button variant="destructive" @click="$emit('delete')">Удалить</Button>
      </div>
    </div>
    <p class="text-muted-foreground mt-1">{{ campaign.description }}</p>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ArrowLeft } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

const router = useRouter();

defineProps({
  campaign: {
    type: Object,
    required: true,
  },
});

defineEmits(['edit', 'delete']);
</script>
