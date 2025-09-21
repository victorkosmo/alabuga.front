import { ref, reactive, onMounted } from 'vue';
import * as competenciesService from '../services/competencies.service';

export function useCompetencies() {
  const competencies = ref([]);
  const pagination = ref(null);
  const isLoading = ref(true);
  const selectedCompetency = ref(null);

  const dialogs = reactive({
    createEdit: false,
    delete: false,
  });

  const fetchCompetencies = async (page = 1) => {
    isLoading.value = true;
    try {
      const response = await competenciesService.getCompetencies({ page, limit: 10 });
      if (response.success) {
        competencies.value = response.data;
        pagination.value = response.meta.pagination;
      } else {
        competencies.value = [];
        pagination.value = null;
      }
    } catch (error) {
      console.error('Failed to fetch competencies:', error);
      competencies.value = [];
      pagination.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  const openCreateDialog = () => {
    selectedCompetency.value = null;
    dialogs.createEdit = true;
  };

  const openEditDialog = (competency) => {
    selectedCompetency.value = competency;
    dialogs.createEdit = true;
  };

  const openDeleteDialog = (competency) => {
    selectedCompetency.value = competency;
    dialogs.delete = true;
  };

  const handleSaveCompetency = async (formData) => {
    try {
      if (selectedCompetency.value) {
        await competenciesService.updateCompetency(selectedCompetency.value.id, formData);
      } else {
        await competenciesService.createCompetency(formData);
      }
      dialogs.createEdit = false;
      await fetchCompetencies(pagination.value?.page || 1);
    } catch (error) {
      console.error('Failed to save competency:', error);
    }
  };

  const handleDeleteCompetency = async () => {
    if (!selectedCompetency.value) return;
    try {
      await competenciesService.deleteCompetency(selectedCompetency.value.id);
      dialogs.delete = false;
      
      // After deletion, fetch the same page or the previous one if it becomes empty
      const currentPage = pagination.value?.page || 1;
      const isLastItemOnPage = competencies.value.length === 1 && currentPage > 1;
      await fetchCompetencies(isLastItemOnPage ? currentPage - 1 : currentPage);

    } catch (error) {
      console.error('Failed to delete competency:', error);
    }
  };

  onMounted(() => fetchCompetencies());

  return {
    competencies,
    pagination,
    isLoading,
    selectedCompetency,
    dialogs,
    fetchCompetencies,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    handleSaveCompetency,
    handleDeleteCompetency,
  };
}
