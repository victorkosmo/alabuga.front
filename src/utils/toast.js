// src/utils/toast.js
import { toast } from 'vue-sonner'

const DEFAULT_DURATION = 3000 // 3 seconds

export function successMessage(text) {
  toast.success(text, {
    duration: DEFAULT_DURATION
  })
}

export function errorMessage(text) {
  toast.error(text, {
    duration: DEFAULT_DURATION
  })
}

export function progressMessage(text) {
  toast(text, {
    duration: DEFAULT_DURATION
  })
}

// If you need a custom message with different settings
export function toastMessage(text, options = {}) {
  toast(text, {
    duration: DEFAULT_DURATION,
    ...options
  })
}