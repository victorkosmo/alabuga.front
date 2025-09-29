import { ref, reactive, onMounted } from 'vue';
import * as storeService from '../services/store.service';

export function useStoreItems() {
  const storeItems = ref([]);
  const pagination = ref(null);
  const isLoading = ref(true);
  const selectedStoreItem = ref(null);
  const isUploadingImage = ref(false);

  const dialogs = reactive({
    createEdit: false,
    delete: false,
    view: false,
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

  const openViewDialog = (item) => {
    selectedStoreItem.value = item;
    dialogs.view = true;
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
        const updatedItem = await storeService.updateStoreItem(selectedStoreItem.value.id, formData);
        const index = storeItems.value.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
          storeItems.value[index] = updatedItem;
        }
        selectedStoreItem.value = updatedItem;
      } else {
        await storeService.createStoreItem(formData);
        await fetchStoreItems(pagination.value?.page || 1);
      }
      dialogs.createEdit = false;
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
      storeItems.value = storeItems.value.filter(item => item.id !== selectedStoreItem.value.id);

      if (storeItems.value.length === 0 && currentPage > 1) {
        await fetchStoreItems(currentPage - 1);
      }

    } catch (error) {
      console.error('Failed to delete store item:', error);
    }
  };

  const handleImageUpload = async (file) => {
    if (!selectedStoreItem.value) return;
    isUploadingImage.value = true;
    try {
      const updatedItem = await storeService.uploadStoreItemImage(selectedStoreItem.value.id, file);
      const index = storeItems.value.findIndex(item => item.id === updatedItem.id);
      if (index !== -1) {
        storeItems.value[index] = updatedItem;
      }
      selectedStoreItem.value = updatedItem;
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      isUploadingImage.value = false;
    }
  };

  onMounted(() => fetchStoreItems());

  return {
    storeItems,
    pagination,
    isLoading,
    selectedStoreItem,
    isUploadingImage,
    dialogs,
    fetchStoreItems,
    openCreateDialog,
    openViewDialog,
    openEditDialog,
    openDeleteDialog,
    handleSaveStoreItem,
    handleDeleteStoreItem,
    handleImageUpload,
  };
}
