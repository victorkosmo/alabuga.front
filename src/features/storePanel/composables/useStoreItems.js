import { ref, reactive, onMounted } from 'vue';
import * as storeService from '../services/store.service';

export function useStoreItems() {
  const storeItems = ref([]);
  const pagination = ref(null);
  const isLoading = ref(true);
  const selectedStoreItem = ref(null);

  const dialogs = reactive({
    createEdit: false,
    delete: false,
  });

  const fetchStoreItems = async (page = 1) => {
    isLoading.value = true;
    try {
      const response = await storeService.getStoreItems({ page, limit: 10 });
      if (response.success) {
        storeItems.value = response.data;
        pagination.value = response.meta.pagination;
      } else {
        storeItems.value = [];
        pagination.value = null;
      }
    } catch (error) {
      console.error('Failed to fetch store items:', error);
      storeItems.value = [];
      pagination.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  const openCreateDialog = () => {
    selectedStoreItem.value = null;
    dialogs.createEdit = true;
  };

  const openEditDialog = (item) => {
    selectedStoreItem.value = item;
    dialogs.createEdit = true;
  };

  const openDeleteDialog = (item) => {
    selectedStoreItem.value = item;
    dialogs.delete = true;
  };

  const handleSaveStoreItem = async (formData) => {
    try {
      if (selectedStoreItem.value) {
        await storeService.updateStoreItem(selectedStoreItem.value.id, formData);
      } else {
        await storeService.createStoreItem(formData);
      }
      dialogs.createEdit = false;
      await fetchStoreItems(pagination.value?.page || 1);
    } catch (error) {
      console.error('Failed to save store item:', error);
    }
  };

  const handleDeleteStoreItem = async () => {
    if (!selectedStoreItem.value) return;
    try {
      await storeService.deleteStoreItem(selectedStoreItem.value.id);
      dialogs.delete = false;
      
      const currentPage = pagination.value?.page || 1;
      const isLastItemOnPage = storeItems.value.length === 1 && currentPage > 1;
      await fetchStoreItems(isLastItemOnPage ? currentPage - 1 : currentPage);

    } catch (error) {
      console.error('Failed to delete store item:', error);
    }
  };

  onMounted(() => fetchStoreItems());

  return {
    storeItems,
    pagination,
    isLoading,
    selectedStoreItem,
    dialogs,
    fetchStoreItems,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    handleSaveStoreItem,
    handleDeleteStoreItem,
  };
}
