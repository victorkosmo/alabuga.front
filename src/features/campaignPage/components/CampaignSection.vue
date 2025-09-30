<template>
  <Card class="mt-6">
    <CardHeader>
      <div class="flex items-center gap-4">
        <CardTitle>{{ title }}</CardTitle>
        <Button variant="outline" size="icon" @click="$emit('create')">
          <Plus class="h-6 w-6" />
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div v-if="isLoading" class="flex justify-center items-center h-40">
        <p>{{ loadingText }}</p>
      </div>
      <div v-else-if="error" class="text-red-500 text-center">
        <p>{{ error }}</p>
      </div>
      <div v-else-if="items && items.length > 0" class="flex flex-wrap gap-6">
        <slot name="item" v-for="item in items" :item="item"></slot>
      </div>
      <div v-else>
        <p class="text-muted-foreground">{{ emptyText }}</p>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-vue-next';

defineProps({
  title: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  loadingText: {
    type: String,
    default: 'Загрузка...',
  },
  error: {
    type: String,
    default: null,
  },
  emptyText: {
    type: String,
    default: 'Нет элементов для отображения.',
  },
});

defineEmits(['create']);
</script>
