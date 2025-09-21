// src/stores/user.js
import { defineStore } from 'pinia';
import { getLocalStorageKey, setLocalStorageKey } from '@/utils/localStorage';
import { getMe } from '@/api/auth';
import { jwtDecode } from 'jwt-decode';

export const useUserStore = defineStore('user', {
  state: () => ({
    id: null,
    email: null,
    name: null,
    role: null
  }),
  actions: {
    setUserData(data) {
      if (!data) return;
      
      this.id = data.id ?? null;
      this.email = data.email ?? null;
      this.name = data.full_name ?? null;
      this.role = data.role ?? null;

      setLocalStorageKey('user_id', this.id);
      setLocalStorageKey('user_email', this.email);
      setLocalStorageKey('user_name', this.name);
      setLocalStorageKey('user_role', this.role);
    },

    setUserFromToken() {
      const token = getLocalStorageKey('access');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          this.id = decoded.id ?? null;
          this.email = decoded.email ?? null;
          this.role = decoded.role ?? null;
          this.name = getLocalStorageKey('user_name');

          // Save ALL values to localStorage
          setLocalStorageKey('user_id', this.id);
          setLocalStorageKey('user_email', this.email);
          setLocalStorageKey('user_role', this.role);
          setLocalStorageKey('user_name', this.name);
        } catch (error) {
          this.clearUser();
        }
      }
    },

    loadUserFromStorage() {
      const id = getLocalStorageKey('user_id');
      const email = getLocalStorageKey('user_email');

      if (id && email) {
        this.id = id;
        this.email = email;
        this.name = getLocalStorageKey('user_name');
        this.role = getLocalStorageKey('user_role');
        return true;
      }
      return false;
    },

    async fetchAndSetUser() {
      try {
        const response = await getMe();
        if (response.success && response.data) {
          this.setUserData(response.data);
        } else {
          throw new Error('Failed to fetch user data: Invalid response');
        }
      } catch (error) {
        console.error('Failed to fetch and set user:', error);
        throw error;
      }
    },

    clearUser() {
      this.id = null;
      this.email = null;
      this.name = null;
      this.role = null;
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_role');
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
    }
  }
});