<template>
  <div>
    <Label for="pass_threshold_select">Порог прохождения</Label>
    <Select v-if="questionCount > 0" :model-value="String(selectedCorrectAnswers)" @update:model-value="updateThreshold">
      <SelectTrigger id="pass_threshold_select">
        <SelectValue placeholder="Выберите порог" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem v-for="n in questionCount" :key="n" :value="String(n)">
          {{ n }} из {{ questionCount }}
        </SelectItem>
      </SelectContent>
    </Select>
    <p v-if="questionCount > 0" class="text-sm text-muted-foreground">
      Нужно ответить правильно на {{ selectedCorrectAnswers }} из {{ questionCount }} вопросов ({{ percentage }}%).
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const props = defineProps({
  modelValue: { // The threshold (0.0 to 1.0)
    type: Number,
    required: true,
  },
  questionCount: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const selectedCorrectAnswers = computed(() => {
  if (props.questionCount <= 0) return 0;
  const required = Math.ceil(props.modelValue * props.questionCount);
  // Minimum 1 correct answer, max is total questions
  return Math.max(1, Math.min(props.questionCount, required));
});

const percentage = computed(() => {
  if (props.questionCount <= 0) return 0;
  const actualThreshold = selectedCorrectAnswers.value / props.questionCount;
  return Math.round(actualThreshold * 100);
});

const updateThreshold = (newSelectedCorrectAnswersStr) => {
  const numCorrect = Number(newSelectedCorrectAnswersStr);
  if (props.questionCount > 0 && !isNaN(numCorrect)) {
    const newThreshold = numCorrect / props.questionCount;
    emit('update:modelValue', newThreshold);
  }
};
</script>
