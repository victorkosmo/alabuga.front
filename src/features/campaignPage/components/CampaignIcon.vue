<template>
  <Card>
    <CardHeader>
      <CardTitle>Иконка</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <div v-if="campaign.icon_url" class="relative group">
        <img
          :src="campaign.icon_url"
          alt="Иконка кампании"
          class="w-full h-auto object-cover rounded-md"
        >
      </div>
      <div v-else class="flex items-center justify-center h-32 border-2 border-dashed rounded-md">
        <p class="text-muted-foreground">Нет иконки</p>
      </div>
      <div>
        <Button variant="outline" @click="triggerIconUpload" :disabled="isUploadingIcon" class="w-full">
          <Loader2 v-if="isUploadingIcon" class="mr-2 h-4 w-4 animate-spin" />
          {{ campaign.icon_url ? 'Заменить иконку' : 'Загрузить иконку' }}
        </Button>
        <input
          ref="iconInput"
          type="file"
          class="hidden"
          accept="image/*"
          @change="handleIconSelected"
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

defineProps({
  campaign: {
    type: Object,
    required: true,
  },
  isUploadingIcon: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['upload-icon']);

const iconInput = ref(null);

const triggerIconUpload = () => {
  iconInput.value?.click();
};

const handleIconSelected = (event) => {
  const file = event.target.files[0];
  if (file) {
    emit('upload-icon', file);
  }
  // Reset input value to allow re-uploading the same file
  event.target.value = null;
};
</script>
