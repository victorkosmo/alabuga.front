import { computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { errorMessage } from '@/utils/toast';

export function useProfileMenu(props) {
  const userStore = useUserStore();

  // User data is now reactive from the store
  const userEmail = computed(() => userStore.email);
  const userName = computed(() => userStore.name);
  const userRole = computed(() => userStore.role);

  const userInitials = computed(() => {
    if (userName.value) {
      return userName.value
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    }
    if (userEmail.value) {
      return userEmail.value.substring(0, 2).toUpperCase();
    }
    return '';
  });

  const handleMenuAction = (item) => {
    if (item.actionKey && props.menuActions?.[item.actionKey]) {
      props.menuActions[item.actionKey]();
    } else if (item.action) {
      item.action();
    } else {
      errorMessage(`No action for: ${item.label}`);
    }
  };

  return {
    userEmail,
    userName,
    userRole,
    userInitials,
    handleMenuAction
  };
}
