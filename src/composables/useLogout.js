import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

export function useLogout() {
  const userStore = useUserStore()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.clear()
    userStore.clearUser()
    router.push('/login')
  }

  return {
    handleLogout
  }
}
