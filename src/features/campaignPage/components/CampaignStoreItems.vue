<template>
  <div class="mt-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Товары магазина</h2>
      <Button @click="$emit('create-item')">Создать товар</Button>
    </div>
    <div v-if="isLoading" class="flex justify-center items-center h-40">
      <p>Загрузка товаров...</p>
    </div>
    <div v-else-if="error" class="text-red-500">
      <p>Не удалось загрузить товары: {{ error }}</p>
    </div>
    <div v-else-if="items && items.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card v-for="item in items" :key="item.id" class="h-full hover:border-primary transition-colors cursor-pointer" @click="$emit('edit-item', item)">
        <CardHeader>
          <CardTitle>{{ item.name }}</CardTitle>
          <CardDescription>{{ item.description }}</CardDescription>
        </CardHeader>
        <CardContent class="space-y-2">
          <img v-if="item.image_url" :src="item.image_url" :alt="item.name" class="w-40 h-40 object-cover rounded-md">
          <div>
            <span class="font-semibold">Цена:</span> {{ item.cost }}
          </div>
          <div>
            <span class="font-semibold">Количество:</span> {{ item.quantity === null ? 'Бесконечно' : item.quantity }}
          </div>
          <div>
            <span class="font-semibold">Статус:</span> {{ item.is_active ? 'Активен' : 'Неактивен' }}
          </div>
        </CardContent>
      </Card>
    </div>
    <div v-else>
      <p class="text-muted-foreground">Для этой кампании еще не создано ни одного товара.</p>
    </div>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

defineProps({
  items: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
});

defineEmits(['create-item', 'edit-item']);
</script>
