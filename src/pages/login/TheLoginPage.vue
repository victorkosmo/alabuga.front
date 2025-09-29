<template>
  <div class="flex justify-center items-center min-h-screen bg-background">
    <div class="w-full max-w-4xl overflow-hidden rounded-lg border bg-card text-card-foreground shadow-md">
      <div class="grid md:grid-cols-2 p-0">
        <form class="p-6 md:p-8" @submit.prevent="submitForm">
          <div class="flex flex-col gap-6 h-full justify-center">
            <div class="flex flex-col items-center text-center lg:pt-8">
              <img src="/logos/alabuga-wide.svg" alt="Logo" class="h-20 mb-2" />
              <p class="text-balance text-muted-foreground">
                Введите ваши данные для входа.
              </p>
            </div>
            
            <div class="grid gap-2">
              <Label for="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required v-model="login" />
            </div>
            
            <div class="grid gap-2">
              <Label for="password">Пароль</Label>
              <div class="relative">
                <Input 
                  :id="password" 
                  :type="showPassword ? 'text' : 'password'" 
                  placeholder="Enter your password" 
                  required 
                  v-model="password" 
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  @click="showPassword = !showPassword"
                >
                  <EyeIcon v-if="showPassword" class="h-4 w-4" />
                  <EyeOffIcon v-else class="h-4 w-4" />
                  <span class="sr-only">Нажмите для смены видимости</span>
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              class="w-full flex items-center justify-center gap-2 lg:mb-4" 
              :disabled="loading"
            >
              <Loader2 v-if="loading" class="h-5 w-5 animate-spin" />
              <span v-if="!loading">Вход</span>
              <span v-else>Вход...</span>
            </Button>
          </div>
        </form>
        <div 
          class="hidden md:block bg-cover bg-center dark:brightness-[0.2] dark:grayscale"
          :style="{ backgroundImage: 'url(/placholder_img.png)' }"
        >
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login as loginApi } from '@/api/auth'
import { setLocalStorageKey } from '@/utils/localStorage'
import { useRouter } from 'vue-router'
import { Loader2, EyeIcon, EyeOffIcon } from 'lucide-vue-next'
import { errorMessage } from '@/utils/toast'
import { useUserStore } from '@/stores/user'

// Reactive state variables
const login = ref('')
const password = ref('')
const loading = ref(false)
const showPassword = ref(false)

// Router instance
const router = useRouter()

// submitForm function
const submitForm = async () => {
  if (loading.value) return
  loading.value = true

  try {
    const response = await loginApi({
      email: login.value,
      password: password.value,
    })

    // Set response data to local storage
    if (response && response.data) {
      setLocalStorageKey('access', response.data.access);
      setLocalStorageKey('refresh', response.data.refresh);
      
      // This line is being SKIPPED
      const userStore = useUserStore();
      await userStore.fetchAndSetUser();
      
    } else {
      errorMessage('Login failed: Invalid response structure.');
      console.error('Invalid login response structure:', response);
      loading.value = false;
      return;
    }

    router.push('/campaigns')
  } catch (error) {
    errorMessage('Login failed. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>
