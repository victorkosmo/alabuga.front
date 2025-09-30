<template>
  <Card>
    <CardHeader>
      <CardTitle>Присоединение к кампании</CardTitle>
    </CardHeader>
    <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-6">
        <div>
          <h3 class="font-semibold">Код активации</h3>
          <p class="text-2xl font-mono mt-1">{{ campaign.activation_code }}</p>
        </div>

        <div v-if="campaign.joining_link">
          <h3 class="font-semibold">Ссылка для входа</h3>
          <div class="flex items-center gap-2 mt-1">
            <p class="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md flex-grow break-all">{{ campaign.joining_link }}</p>
            <Button variant="outline" size="sm" @click="copyToClipboard(campaign.joining_link)">
              Копировать
            </Button>
          </div>
        </div>
      </div>

      <div v-if="campaign.qr_url">
        <h3 class="font-semibold">QR-код для входа</h3>
        <div class="mt-1">
          <img
            :src="campaign.qr_url"
            alt="QR Code"
            class="w-32 h-32 rounded-md cursor-pointer hover:opacity-80 transition-opacity"
            @click="isQrModalOpen = true"
          >
        </div>
      </div>
    </CardContent>

    <Dialog v-model:open="isQrModalOpen">
      <DialogContent class="max-w-max">
        <DialogHeader>
          <DialogTitle>QR-код для входа</DialogTitle>
        </DialogHeader>
        <img :src="campaign.qr_url" alt="QR Code" class="w-[512px] h-[512px] rounded-lg">
      </DialogContent>
    </Dialog>
  </Card>
</template>

<script setup>
import { ref } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { successMessage } from '@/utils/toast';

defineProps({
  campaign: {
    type: Object,
    required: true,
  },
});

const isQrModalOpen = ref(false);

const copyToClipboard = async (text) => {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    successMessage('Ссылка скопирована в буфер обмена');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};
</script>
