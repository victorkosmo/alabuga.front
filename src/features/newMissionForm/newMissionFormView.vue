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
          <div>
            <Label for="title">Название миссии</Label>
            <Input id="title" v-model="formData.title" required />
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
        </div>
        <div v-else-if="missionType === 'QR_CODE'" class="space-y-4">
          <div>
            <Label for="title">Название миссии</Label>
            <Input id="title" v-model="formData.title" required />
          </div>

          <div>
            <Label for="description">Описание</Label>
            <Textarea id="description" v-model="formData.description" />
          </div>
        </div>
        <div v-else-if="missionType === 'QUIZ'" class="space-y-6">
          <div>
            <Label for="title">Название миссии</Label>
            <Input id="title" v-model="formData.title" required />
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
        </div>
        <p v-else class="text-muted-foreground">Форма для типа миссии '{{ missionType }}' не реализована.</p>
      </CardContent>
      <CardFooter>
        <Button :disabled="isSubmitting || !['MANUAL_URL', 'QR_CODE', 'QUIZ'].includes(missionType)" @click="handleSubmit">
          <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
          Создать миссию
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, Loader2, Trash2, X } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createUrlMission, createQrMission, createQuizMission } from '@/features/missionPage/services/mission.service';

const route = useRoute();
const router = useRouter();

const missionType = computed(() => route.query.type);
const campaignId = route.params.id;

const isSubmitting = ref(false);
const formData = reactive({
  title: '',
  description: '',
  submission_prompt: '',
  placeholder_text: '',
  // QUIZ type
  questions: [{ text: '', answers: [{ text: '', is_correct: true }, { text: '', is_correct: false }] }],
  pass_threshold: 1.0,
});

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
  if (!['MANUAL_URL', 'QR_CODE', 'QUIZ'].includes(missionType.value)) return;

  isSubmitting.value = true;

  const missionData = {
    campaign_id: campaignId,
    title: formData.title,
    description: formData.description,
    category: 'default',
  };

  try {
    if (missionType.value === 'MANUAL_URL') {
      await createUrlMission({
        ...missionData,
        submission_prompt: formData.submission_prompt,
        placeholder_text: formData.placeholder_text,
      });
    } else if (missionType.value === 'QR_CODE') {
      await createQrMission(missionData);
    } else if (missionType.value === 'QUIZ') {
      await createQuizMission({
        ...missionData,
        questions: formData.questions,
        pass_threshold: formData.pass_threshold,
      });
    }
    router.push({ name: 'Кампания', params: { id: campaignId } });
  } catch (error) {
    console.error('Failed to create mission:', error);
    // Error toast is handled by the fetch interceptor
  } finally {
    isSubmitting.value = false;
  }
};
</script>
