<template>
  <Card>
    <CardHeader>
      <CardTitle>Обложка миссии</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <div v-if="mission.cover_url" class="relative group">
        <img :src="mission.cover_url" alt="Обложка миссии" class="w-full h-auto object-cover rounded-md max-w-sm" />
      </div>
      <div v-else class="flex items-center justify-center h-32 border-2 border-dashed rounded-md max-w-sm">
        <p class="text-muted-foreground">Нет обложки</p>
      </div>
      <div>
        <Button variant="outline" @click="triggerCoverUpload" :disabled="isUploading">
          <Loader2 v-if="isUploading" class="mr-2 h-4 w-4 animate-spin" />
          {{ mission.cover_url ? 'Заменить обложку' : 'Загрузить обложку' }}
        </Button>
        <input ref="coverInput" type="file" class="hidden" accept="image/*" @change="handleCoverSelected" />
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref } from 'vue';
import { Loader2 } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

defineProps({
  mission: {
    type: Object,
    required: true,
  },
  isUploading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['upload-cover']);

const coverInput = ref(null);

const triggerCoverUpload = () => {
  coverInput.value?.click();
};

const handleCoverSelected = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  emit('upload-cover', file);

  // Reset input to allow re-uploading the same file
  if (event.target) {
    event.target.value = null;
  }
};
</script>
