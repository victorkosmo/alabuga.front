<template>
  <Card>
    <CardHeader>
      <CardTitle>Присоединение к кампании</CardTitle>
      <CardDescription>Способы, которыми участники могут присоединиться к вашей кампании.</CardDescription>
    </CardHeader>
    <CardContent class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="border rounded-lg p-4 flex flex-col">
        <h3 class="font-semibold">Код активации</h3>
        <p class="text-sm text-muted-foreground mt-1">Участники могут ввести этот код в приложении, чтобы присоединиться.</p>
        <p class="text-2xl font-mono mt-auto pt-2">{{ campaign.activation_code }}</p>
      </div>

      <div v-if="campaign.joining_link" class="border rounded-lg p-4 flex flex-col">
        <h3 class="font-semibold">Ссылка для входа</h3>
        <p class="text-sm text-muted-foreground mt-1">Поделитесь этой ссылкой для прямого доступа.</p>
        <div class="mt-auto pt-2 space-y-2">
          <p class="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md break-all">{{ campaign.joining_link }}</p>
          <Button variant="outline" @click="copyToClipboard(campaign.joining_link)" class="w-full">
            Копировать ссылку
          </Button>
        </div>
      </div>

      <div v-if="campaign.qr_url" class="border rounded-lg p-4 flex flex-col">
        <h3 class="font-semibold">QR-код для входа</h3>
        <p class="text-sm text-muted-foreground mt-1">Участники могут отсканировать этот QR-код для быстрого присоединения.</p>
        <div class="mt-auto pt-2">
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
