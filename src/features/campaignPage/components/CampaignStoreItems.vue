<template>
  <CampaignSection
    title="Товары магазина"
    :items="items"
    :is-loading="isLoading"
    loading-text="Загрузка товаров..."
    :error="error ? `Не удалось загрузить товары: ${error}` : null"
    empty-text="Для этой кампании еще не создано ни одного товара."
    @create="$emit('create-item')"
  >
    <template #item="{ item }">
      <Card class="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] h-full hover:border-primary transition-colors cursor-pointer" @click="$emit('edit-item', item)">
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
    </template>
  </CampaignSection>
</template>

<script setup>
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CampaignSection from './CampaignSection.vue';

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
