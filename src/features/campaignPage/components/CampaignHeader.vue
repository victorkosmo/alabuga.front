<template>
  <header class="mb-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" @click="goToCampaignsPage" class="h-8 w-8">
          <ArrowLeft class="h-5 w-5" />
        </Button>
        <h1 class="text-3xl font-bold">{{ campaign.title }}</h1>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" @click="triggerCoverUpload" :disabled="isUploadingCover">
          <Loader2 v-if="isUploadingCover" class="mr-2 h-4 w-4 animate-spin" />
          Загрузить обложку
        </Button>
        <Button variant="outline" @click="$emit('edit')">Редактировать</Button>
        <Button variant="destructive" @click="$emit('delete')">Удалить</Button>
        <input
          ref="coverInput"
          type="file"
          class="hidden"
          accept="image/*"
          @change="handleCoverSelected"
        />
      </div>
    </div>
    <p class="text-muted-foreground mt-1">{{ campaign.description }}</p>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, Loader2 } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

const router = useRouter();
const coverInput = ref(null);

const goToCampaignsPage = () => {
  router.push({ name: 'Кампании' });
};

defineProps({
  campaign: {
    type: Object,
    required: true,
  },
  isUploadingCover: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['edit', 'delete', 'upload-cover']);

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
