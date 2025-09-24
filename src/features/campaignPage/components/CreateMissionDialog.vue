<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Выберите тип миссии</DialogTitle>
        <DialogDescription>
          Выберите шаблон для создания новой миссии.
        </DialogDescription>
      </DialogHeader>
      <div class="py-4">
        <div v-if="isLoading" class="flex justify-center items-center h-40">
          <p>Загрузка типов...</p>
        </div>
        <div v-else-if="error" class="text-red-500 text-center">
          <p>Не удалось загрузить типы миссий: {{ error }}</p>
        </div>
        <div v-else class="grid gap-4">
          <Card
            v-for="missionType in missionTypes"
            :key="missionType.value"
            class="cursor-pointer hover:border-primary transition-colors"
            @click="handleSelect(missionType.value)"
          >
            <CardHeader>
              <CardTitle>{{ missionType.label }}</CardTitle>
              <CardDescription>{{ missionType.description }}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="$emit('update:open', false)">Отмена</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getMissionTypes } from '@/features/missionPage/services/mission.service';

const props = defineProps({
  open: Boolean,
});

const emit = defineEmits(['update:open', 'select-type']);

const missionTypes = ref([]);
const isLoading = ref(false);
const error = ref(null);

const fetchTypes = async () => {
  if (!props.open) return;
  isLoading.value = true;
  error.value = null;
  try {
    missionTypes.value = await getMissionTypes();
  } catch (e) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
};

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    fetchTypes();
  }
});

const handleSelect = (typeValue) => {
  emit('select-type', typeValue);
  emit('update:open', false);
};
</script>
