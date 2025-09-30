<template>
  <Card>
    <CardHeader>
      <CardTitle>Обложка</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <div v-if="campaign.cover_url" class="relative group">
        <img
          :src="campaign.cover_url"
          alt="Обложка кампании"
          class="w-full h-auto object-cover rounded-md"
        >
      </div>
      <div v-else class="flex items-center justify-center h-32 border-2 border-dashed rounded-md">
        <p class="text-muted-foreground">Нет обложки</p>
      </div>
      <div>
        <Button variant="outline" @click="triggerCoverUpload" :disabled="isUploadingCover" class="w-full">
          <Loader2 v-if="isUploadingCover" class="mr-2 h-4 w-4 animate-spin" />
          {{ campaign.cover_url ? 'Заменить обложку' : 'Загрузить обложку' }}
        </Button>
        <input
          ref="coverInput"
          type="file"
          class="hidden"
          accept="image/*"
          @change="handleCoverSelected"
        />
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref } from 'vue';
import { Loader2 } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const props = defineProps({
  campaign: {
    type: Object,
    required: true,
  },
  isUploadingCover: {
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
  if (file) {
    emit('upload-cover', file);
  }
  // Reset input value to allow re-uploading the same file
  event.target.value = null;
};
</script>
