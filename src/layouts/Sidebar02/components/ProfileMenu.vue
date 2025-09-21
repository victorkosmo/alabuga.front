<script setup>
import { ref } from 'vue';
import { useProfileMenu } from '../composables/useProfileMenu';
import { sidebarConfig } from '../sidebarConfig';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-vue-next';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const props = defineProps({
  collapsed: {
    type: Boolean,
    required: true
  },
  isMobile: {
    type: Boolean,
    default: false
  },
  menuActions: {
    type: Object,
    default: () => ({})
  }
});

const open = ref(false);

const {
  userName,
  userEmail,
  userRole,
  userInitials,
  handleMenuAction,
} = useProfileMenu(props);

const handleLogout = () => {
  const logoutItem = sidebarConfig.profileMenu.find(item => item.actionKey === 'logout');
  if (logoutItem) {
    handleMenuAction(logoutItem);
  }
};
</script>

<template>
  <div class="relative" @mouseenter="open = collapsed ? true : false" @mouseleave="open = false">
    <!-- Always-visible part -->
    <div
      class="flex items-center w-full gap-2 items-start"
      :class="[
        collapsed ? 'justify-center' : 'justify-between'
      ]"
    >
      <div class="flex items-top gap-2 min-w-0 pb-2 pt-1">
        <div class="md:pt-1">
          <Avatar class="h-8 w-8 justify-start bg-slate-200">
            <AvatarFallback>{{ userInitials }}</AvatarFallback>
          </Avatar>
        </div>
        <div v-if="!collapsed" class="flex-1 flex flex-col items-start truncate">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-foreground leading-none">{{ userName }}</span>
            <Badge variant="outline">{{ userRole }}</Badge>
          </div>
          <span v-if="userEmail" class="text-xs text-muted-foreground leading-none mt-1 truncate w-full">{{ userEmail }}</span>
        </div>
      </div>

      <Tooltip v-if="!collapsed && !isMobile">
        <TooltipTrigger as-child>
          <Button
            variant="ghost"
            size="icon"
            @click.stop="handleLogout"
            class="h-8 w-8 shrink-0"
          >
            <LogOut class="h-6 w-6" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Выход</p>
        </TooltipContent>
      </Tooltip>
    </div>

    <!-- Flyout for collapsed state -->
    <transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 translate-x-1"
      enter-to-class="opacity-100 translate-x-0"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 translate-x-1"
    >
      <div
        v-if="open && collapsed"
        class="!z-[200] absolute left-full bottom-0 ml-2 p-3 w-[230px] border rounded-md bg-background shadow-lg"
      >
        <div class="flex items-center w-full justify-between gap-2">
          <div class="flex items-top gap-2 min-w-0">
            <Avatar class="h-8 w-8">
              <AvatarFallback>{{ userInitials }}</AvatarFallback>
            </Avatar>
            <div class="flex-1 flex flex-col items-start truncate">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-foreground leading-none">{{ userName }}</span>
                <Badge variant="outline">{{ userRole }}</Badge>
              </div>
              <span v-if="userEmail" class="text-xs text-muted-foreground leading-none mt-1 truncate w-full">{{ userEmail }}</span>
            </div>
          </div>

          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="icon"
                @click="handleLogout"
                class="h-7 w-7 shrink-0"
              >
                <LogOut class="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Выход</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </transition>
  </div>
</template>
