<template>
  <Card class="flex flex-col">
    <CardHeader class="p-0">
      <div class="aspect-square w-full relative">
        <img v-if="storeItem.image_url" :src="storeItem.image_url" :alt="storeItem.name" class="h-full w-full rounded-t-lg object-cover">
        <div v-else class="flex h-full w-full items-center justify-center rounded-t-lg bg-muted">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-12 w-12 text-muted-foreground"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
        </div>
        <Badge v-if="!storeItem.is_active" variant="destructive" class="absolute top-2 right-2">Неактивен</Badge>
      </div>
    </CardHeader>
    <CardContent class="p-4 flex-grow">
      <h3 class="font-semibold text-lg cursor-pointer hover:underline" @click="$emit('view', storeItem)">{{ storeItem.name }}</h3>
      <p class="text-sm text-muted-foreground mt-1 h-10 overflow-hidden">{{ storeItem.description || '-' }}</p>
      <div class="flex justify-between items-center mt-4">
        <div class="font-bold text-lg">{{ storeItem.cost }} pts</div>
        <div class="text-sm text-muted-foreground">
          Кол-во: {{ storeItem.quantity === null ? '∞' : storeItem.quantity }}
        </div>
      </div>
    </CardContent>
    <CardFooter class="p-4 pt-0 flex justify-end gap-2">
      <Button variant="outline" size="sm" @click="$emit('edit', storeItem)">
        Изменить
      </Button>
      <Button variant="destructive" size="sm" @click="$emit('delete', storeItem)">
        Удалить
      </Button>
    </CardFooter>
  </Card>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

defineProps({
  storeItem: {
    type: Object,
    required: true,
  },
});

defineEmits(['edit', 'delete', 'view']);
</script>
