<template>
  <!-- Header -->
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
  </div>

  <!-- User Information -->
  <div class="space-y-4">
    <p class="text-gray-700"><span class="font-semibold">User ID:</span> {{ id }}</p>
    <p class="text-gray-700"><span class="font-semibold">Email:</span> {{ email }}</p>
  </div>

  <!-- Test Toaster -->
  <div class="mt-8">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">Test Toaster</h2>
    <Button @click="testToaster">Test Toaster</Button>
  </div>

  <!-- Test Modal -->
  <div class="mt-8">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">Test Modal</h2>
    <Dialog>
      <DialogTrigger as-child>
        <Button variant="outline">Open Modal</Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Test Modal</DialogTitle>
          <DialogDescription>
            This is a test modal for demonstration purposes.
          </DialogDescription>
        </DialogHeader>
        <div>
          <p>You successfully opened the modal!</p>
        </div>
      </DialogContent>
    </Dialog>
  </div>

  <!-- Content Placeholder -->
  <div class="mt-8">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">Welcome to Your Dashboard</h2>
    <p class="text-gray-600">
      This is a simple dashboard example. You can add more components and features here.
    </p>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useUserStore } from '@/stores/user';
import { progressMessage } from '@/utils/toast';

// Access the user store
const userStore = useUserStore();

// Declare reactive state directly from the store
const id = userStore.id;
const email = userStore.email;

// Define the testToaster method
const testToaster = () => {
  progressMessage('This is a test message!');
};
</script>
