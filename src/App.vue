<template>
  <div>
    <router-view />
    <Toaster richColors />
  </div>
</template>

<script setup>
import { Toaster } from '@/components/ui/sonner/index.js'
</script>
