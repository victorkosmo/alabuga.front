<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ competency.name }}</CardTitle>
    </CardHeader>
    <CardContent>
      <p class="text-sm text-muted-foreground break-words">
        {{ competency.description || 'Нет описания.' }}
      </p>
    </CardContent>
    <CardFooter class="flex justify-end gap-2">
      <Button variant="outline" size="sm" @click="$emit('edit', competency)">
        Изменить
      </Button>
      <Button variant="destructive" size="sm" @click="$emit('delete', competency)">
        Удалить
      </Button>
    </CardFooter>
  </Card>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

defineProps({
  competency: {
    type: Object,
    required: true,
  },
});

defineEmits(['edit', 'delete']);
</script>
