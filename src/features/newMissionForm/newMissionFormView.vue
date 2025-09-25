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
        <div v-if="missionType === 'MANUAL_URL'" class="space-y-4">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label for="title">Название миссии</Label>
              <Input id="title" v-model="formData.title" required />
            </div>
            <div>
              <Label for="category">Категория</Label>
              <Input id="category" v-model="formData.category" required />
            </div>
          </div>

          <div>
            <Label for="description">Описание</Label>
            <Textarea id="description" v-model="formData.description" />
          </div>

          <div>
            <Label for="submission_prompt">Задание для исполнителя</Label>
            <Textarea id="submission_prompt" v-model="formData.submission_prompt" required />
          </div>

          <div>
            <Label for="placeholder_text">Пример (placeholder)</Label>
            <Input id="placeholder_text" v-model="formData.placeholder_text" />
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label for="experience_reward">Награда (опыт)</Label>
              <Input id="experience_reward" v-model.number="formData.experience_reward" type="number" />
            </div>
            <div>
              <Label for="mana_reward">Награда (мана)</Label>
              <Input id="mana_reward" v-model.number="formData.mana_reward" type="number" />
            </div>
            <div>
              <Label for="required_rank_id">Требуемый ранг</Label>
              <Select v-model="formData.required_rank_id">
                <SelectTrigger id="required_rank_id">
                  <SelectValue placeholder="Выберите ранг" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem v-for="rank in ranks" :key="rank.id" :value="rank.id">
                      {{ rank.title }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <p v-else class="text-muted-foreground">Форма для типа миссии '{{ missionType }}' не реализована.</p>
      </CardContent>
      <CardFooter>
        <Button :disabled="isSubmitting || missionType !== 'MANUAL_URL'" @click="handleSubmit">
          <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
          Создать миссию
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, Loader2 } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createUrlMission } from '@/features/missionPage/services/mission.service';
import { getMinimalRanks } from './services/ranks.service';

const route = useRoute();
const router = useRouter();

const missionType = computed(() => route.query.type);
const campaignId = route.params.id;

const isSubmitting = ref(false);
const ranks = ref([]);
const formData = reactive({
  title: '',
  description: '',
  category: '',
  required_rank_id: null,
  experience_reward: 0,
  mana_reward: 0,
  submission_prompt: '',
  placeholder_text: '',
});

onMounted(async () => {
  try {
    ranks.value = await getMinimalRanks();
  } catch (error) {
    console.error('Failed to fetch ranks:', error);
    // Error toast is handled by the fetch interceptor
  }
});

const handleSubmit = async () => {
  if (missionType.value !== 'MANUAL_URL') return;

  isSubmitting.value = true;
  try {
    await createUrlMission({
      ...formData,
      campaign_id: campaignId,
    });
    router.push({ name: 'Кампания', params: { id: campaignId } });
  } catch (error) {
    console.error('Failed to create mission:', error);
    // Error toast is handled by the fetch interceptor
  } finally {
    isSubmitting.value = false;
  }
};
</script>
