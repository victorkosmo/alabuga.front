<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <header class="mb-6">
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" @click="goToMissionPage" class="h-8 w-8">
          <ArrowLeft class="h-5 w-5" />
        </Button>
        <h1 class="text-3xl font-bold">Редактировать миссию</h1>
      </div>
    </header>

    <div v-if="isLoading" class="text-center">
      <Loader2 class="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
      <p class="mt-2 text-muted-foreground">Загрузка данных миссии...</p>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <h2 class="text-xl font-semibold">Не удалось загрузить данные для редактирования</h2>
      <p class="text-muted-foreground">{{ error }}</p>
      <Button @click="fetchMissionData" class="mt-4">Попробовать снова</Button>
    </div>

    <Card v-else-if="missionType === 'MANUAL_URL'">
      <CardHeader>
        <CardTitle>Редактирование миссии</CardTitle>
        <CardDescription>Измените детали миссии и сохраните.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
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
      </CardContent>
      <CardFooter>
        <Button :disabled="isSubmitting" @click="handleSubmit">
          <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
          Сохранить изменения
        </Button>
      </CardFooter>
    </Card>
    <Card v-else-if="missionType === 'QR_CODE'">
      <CardHeader>
        <CardTitle>Редактирование QR миссии</CardTitle>
        <CardDescription>Измените детали миссии и сохраните.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
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
      </CardContent>
      <CardFooter>
        <Button :disabled="isSubmitting" @click="handleSubmit">
          <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
          Сохранить изменения
        </Button>
      </CardFooter>
    </Card>
    <Card v-else-if="missionType === 'QUIZ'">
      <CardHeader>
        <CardTitle>Редактирование Квиз миссии</CardTitle>
        <CardDescription>Измените детали миссии и сохраните.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
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

        <div class="border-t pt-6">
          <h3 class="text-lg font-medium">Вопросы для квиза</h3>
          <div v-for="(question, qIndex) in formData.questions" :key="qIndex" class="mt-4 space-y-4 rounded-md border p-4">
            <div class="flex items-center justify-between">
              <Label :for="`question-text-${qIndex}`" class="text-base">Вопрос {{ qIndex + 1 }}</Label>
              <Button variant="ghost" size="sm" @click="removeQuestion(qIndex)" :disabled="formData.questions.length <= 1">
                <Trash2 class="h-4 w-4" />
              </Button>
            </div>
            <Textarea :id="`question-text-${qIndex}`" v-model="question.text" placeholder="Текст вопроса" required />

            <div class="space-y-2">
              <Label class="text-base">Ответы</Label>
              <div v-for="(answer, aIndex) in question.answers" :key="aIndex" class="flex items-center gap-2">
                <input type="radio" :name="`correct-answer-${qIndex}`" :checked="answer.is_correct" @change="setCorrectAnswer(qIndex, aIndex)" class="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                <Input v-model="answer.text" placeholder="Текст ответа" required class="flex-grow" />
                <Button variant="ghost" size="icon" @click="removeAnswer(qIndex, aIndex)" :disabled="question.answers.length <= 2">
                  <X class="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" @click="addAnswer(qIndex)">Добавить ответ</Button>
            </div>
          </div>
          <Button class="mt-4" @click="addQuestion">Добавить вопрос</Button>
        </div>

        <div class="border-t pt-6">
          <h3 class="text-lg font-medium">Настройки квиза</h3>
          <div>
            <Label for="pass_threshold">Порог прохождения (0.0 - 1.0)</Label>
            <Input id="pass_threshold" v-model.number="formData.pass_threshold" type="number" step="0.1" min="0" max="1" />
            <p class="text-sm text-muted-foreground">Доля правильных ответов, необходимая для прохождения. 1.0 = 100%.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-3 border-t pt-6">
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
      </CardContent>
      <CardFooter>
        <Button :disabled="isSubmitting" @click="handleSubmit">
          <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
          Сохранить изменения
        </Button>
      </CardFooter>
    </Card>
    <p v-else class="text-muted-foreground">Форма редактирования для типа миссии '{{ missionType }}' не реализована.</p>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, Loader2, Trash2, X } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import * as missionService from '@/features/missionPage/services/mission.service';
import { getMinimalRanks } from '@/features/newMissionForm/services/ranks.service';
import { missionTypeDetails } from '@/features/missionPage/missionTypes';

const route = useRoute();
const router = useRouter();

const campaignId = computed(() => route.params.id);
const missionId = computed(() => route.query.missionId);
const missionType = computed(() => route.query.type);

const isLoading = ref(true);
const isSubmitting = ref(false);
const error = ref(null);
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
  // QUIZ type
  questions: [],
  pass_threshold: 1.0,
});

const fetchMissionData = async () => {
  error.value = null;
  isLoading.value = true;
  try {
    const details = missionTypeDetails[missionType.value];
    const serviceFn = missionService[details.service];
    const missionData = await serviceFn(missionId.value);

    // Common fields
    formData.title = missionData.title;
    formData.description = missionData.description;
    formData.category = missionData.category;
    formData.required_rank_id = missionData.required_rank_id;
    formData.experience_reward = missionData.experience_reward;
    formData.mana_reward = missionData.mana_reward;

    // Type-specific fields
    if (missionType.value === 'MANUAL_URL') {
      formData.submission_prompt = missionData.details.submission_prompt;
      formData.placeholder_text = missionData.details.placeholder_text;
    } else if (missionType.value === 'QUIZ') {
      // Use structuredClone for a deep copy of the nested questions array
      formData.questions = structuredClone(missionData.details.questions || []);
      formData.pass_threshold = missionData.details.pass_threshold ?? 1.0;
    }
    // No specific fields to populate for QR_CODE edit form
  } catch (e) {
    error.value = e.message || 'Failed to load mission data.';
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

const fetchRanks = async () => {
  try {
    ranks.value = await getMinimalRanks();
  } catch (e) {
    console.error('Failed to fetch ranks:', e);
  }
};

onMounted(() => {
  fetchRanks();
  fetchMissionData();
});

const goToMissionPage = () => {
  router.push({
    name: 'Миссия',
    params: { campaignId: campaignId.value, missionId: missionId.value },
    query: { type: missionType.value }
  });
};

const setCorrectAnswer = (questionIndex, answerIndex) => {
  formData.questions[questionIndex].answers.forEach((answer, i) => {
    answer.is_correct = i === answerIndex;
  });
};

const addQuestion = () => {
  formData.questions.push({
    text: '',
    answers: [
      { text: '', is_correct: true },
      { text: '', is_correct: false },
    ],
  });
};

const removeQuestion = (index) => {
  if (formData.questions.length > 1) {
    formData.questions.splice(index, 1);
  }
};

const addAnswer = (questionIndex) => {
  formData.questions[questionIndex].answers.push({ text: '', is_correct: false });
};

const removeAnswer = (questionIndex, answerIndex) => {
  const question = formData.questions[questionIndex];
  if (question.answers.length > 2) {
    const wasCorrect = question.answers[answerIndex].is_correct;
    question.answers.splice(answerIndex, 1);
    if (wasCorrect && question.answers.length > 0) {
      setCorrectAnswer(questionIndex, 0);
    }
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    const details = missionTypeDetails[missionType.value];
    const updateFn = missionService[details.updateService];

    // Prepare base payload
    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      required_rank_id: formData.required_rank_id,
      experience_reward: formData.experience_reward,
      mana_reward: formData.mana_reward
    };

    // Add type-specific fields to payload
    if (missionType.value === 'MANUAL_URL') {
      payload.submission_prompt = formData.submission_prompt;
      payload.placeholder_text = formData.placeholder_text;
    } else if (missionType.value === 'QUIZ') {
      payload.questions = formData.questions;
      payload.pass_threshold = formData.pass_threshold;
    }

    await updateFn(missionId.value, payload);

    router.push({
      name: 'Миссия',
      params: { campaignId: campaignId.value, missionId: missionId.value },
      query: { type: missionType.value }
    });
  } catch (e) {
    console.error('Failed to update mission:', e);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
