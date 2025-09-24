<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <header class="mb-6">
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" @click="router.back()" class="h-8 w-8">
          <ArrowLeft class="h-5 w-5" />
        </Button>
        <div>
          <h1 class="text-3xl font-bold">Новая миссия</h1>
          <p v-if="missionType" class="text-muted-foreground">Тип: {{ missionType }}</p>
        </div>
      </div>
    </header>

    <Card>
      <CardHeader>
        <CardTitle>Создание миссии</CardTitle>
        <CardDescription>Заполните детали для новой миссии.</CardDescription>
      </CardHeader>
      <CardContent>
        <!-- Form fields will go here in the future -->
        <p class="text-muted-foreground">Форма создания миссии для типа '{{ missionType }}' будет здесь.</p>
      </CardContent>
      <CardFooter>
        <Button disabled>Создать миссию</Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const route = useRoute();
const router = useRouter();

const missionType = computed(() => route.query.type);
</script>
