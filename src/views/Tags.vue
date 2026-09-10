<template>
  <div class="animate-fade-in">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-1">
          Tags
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          Organize your transactions with labels
        </p>
      </div>
      <button @click="showAddModal = true" class="btn btn-primary">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Add Tag
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div
        v-for="tag in tagStore.tags"
        :key="tag.id"
        class="card p-4"
        :class="{ 'card-accent': selectedTagId === tag.id }"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: tag.color }"></div>
            <h3 class="font-semibold text-gray-800 dark:text-white">{{ tag.name }}</h3>
          </div>
          <span class="badge badge-neutral">{{ linkedCounts[tag.id] ?? '' }}</span>
        </div>

        <div class="flex gap-2">
          <button @click="viewTransactions(tag.id)" class="btn btn-secondary flex-1 text-sm">
            Transactions
          </button>
          <button @click="openLinkModal(tag.id)" class="btn btn-secondary flex-1 text-sm">
            Link
          </button>
          <button @click="editTag(tag)" class="btn btn-ghost">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a3.5 3.5 0 11-4.95 4.95l-4.95 4.95a3.5 3.5 0 014.95 4.95l5.657 5.657a3.5 3.5 0 01-4.95 4.95l-5.657-5.657a3.5 3.5 0 00-4.95 0"></path>
            </svg>
          </button>
          <button @click="deleteTag(tag.id)" class="btn btn-ghost text-red-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1H6a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="tagStore.tags.length === 0 && !tagStore.loading" class="empty-state">
      <div class="empty-state-icon">
        <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5.586a1 1 0 01.707.293l7.414 7.414a1 1 0 010 1.414l-5.414 5.414a1 1 0 01-1.414 0L5.879 10.12a1 1 0 01-.293-.707V4a1 1 0 011-1z"></path>
        </svg>
      </div>
      <h3 class="empty-state-title">No tags yet</h3>
      <p class="empty-state-description">Create tags to label and group your transactions</p>
      <button @click="showAddModal = true" class="btn btn-primary mt-4">Add Tag</button>
    </div>

    <div v-if="selectedTagId !== null" class="card p-6 mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Linked Transactions</h2>
        <div class="flex gap-2">
          <button
            @click="setLinkType('expense')"
            class="btn text-sm"
            :class="linkType === 'expense' ? 'btn-primary' : 'btn-secondary'"
          >
            Expenses
          </button>
          <button
            @click="setLinkType('income')"
            class="btn text-sm"
            :class="linkType === 'income' ? 'btn-primary' : 'btn-secondary'"
          >
            Income
          </button>
        </div>
      </div>
      <div v-if="linkedTransactions.length === 0" class="text-gray-500 dark:text-gray-400 text-sm">
        No {{ linkType }} transactions linked to this tag yet. Use Link to attach some.
      </div>
      <div v-else class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>{{ linkType === 'expense' ? 'Description' : 'Period' }}</th>
              <th>Amount</th>
              <th>{{ linkType === 'expense' ? 'Category' : 'Type' }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in linkedTransactions" :key="tx.id">
              <td class="font-medium text-gray-800 dark:text-white">
                {{ linkType === 'expense' ? tx.description : `${tx.month || ''} ${tx.year || ''}` }}
              </td>
              <td class="font-bold">{{ formatCurrency(tx.amount) }}</td>
              <td class="text-gray-500 dark:text-gray-400">{{ tx.category || tx.type || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closeModal">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md animate-fade-in">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">{{ editMode ? 'Edit' : 'Add' }} Tag</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="label">Tag Name</label>
            <input v-model="form.name" type="text" class="input" placeholder="Groceries" required />
          </div>

          <div>
            <label class="label">Color</label>
            <div class="flex items-center gap-3">
              <input v-model="form.color" type="color" class="w-12 h-12 rounded-xl cursor-pointer bg-transparent" />
              <input v-model="form.color" type="text" class="input" placeholder="#6366f1" pattern="^#[0-9A-Fa-f]{6}$" />
            </div>
          </div>

          <div class="flex gap-3">
            <button type="button" @click="closeModal" class="btn btn-secondary flex-1">Cancel</button>
            <button type="submit" class="btn btn-primary flex-1">{{ editMode ? 'Update' : 'Create' }}</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showLinkModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="showLinkModal = false">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md animate-fade-in">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">Link Transactions</h3>
          <button @click="showLinkModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="flex gap-2 mb-4">
          <button
            @click="setLinkType('expense')"
            class="btn text-sm"
            :class="linkType === 'expense' ? 'btn-primary' : 'btn-secondary'"
          >
            Expenses
          </button>
          <button
            @click="setLinkType('income')"
            class="btn text-sm"
            :class="linkType === 'income' ? 'btn-primary' : 'btn-secondary'"
          >
            Income
          </button>
        </div>

        <div class="max-h-64 overflow-y-auto space-y-2 mb-4">
          <label
            v-for="tx in linkCandidates"
            :key="tx.id"
            class="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
          >
            <input v-model="selectedTxIds" :value="tx.id" type="checkbox" class="w-4 h-4" />
            <span class="flex-1 text-sm text-gray-800 dark:text-white">
              {{ linkType === 'expense' ? tx.description : `${tx.month || ''} ${tx.year || ''}` }}
            </span>
            <span class="text-sm font-semibold">{{ formatCurrency(tx.amount) }}</span>
          </label>
          <p v-if="linkCandidates.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
            No {{ linkType }} records found.
          </p>
        </div>

        <div class="flex gap-3">
          <button @click="showLinkModal = false" class="btn btn-secondary flex-1">Cancel</button>
          <button @click="submitLink" :disabled="selectedTxIds.length === 0" class="btn btn-primary flex-1">Link Selected</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from 'vue';
import axios from 'axios';
import { useTagStore, type Tag } from '../stores/tagStore';
import { toast } from '../components/Toast.vue';
import { confirm } from '../components/ConfirmModal.vue';

const API_URL = 'http://localhost:3001/api';

export default defineComponent({
  name: 'TagsView',
  setup() {
    const tagStore = useTagStore();
    const showAddModal = ref(false);
    const showLinkModal = ref(false);
    const editMode = ref(false);
    const selectedTagId = ref<number | null>(null);
    const linkType = ref<'income' | 'expense'>('expense');
    const linkedTransactions = ref<any[]>([]);
    const linkCandidates = ref<any[]>([]);
    const selectedTxIds = ref<number[]>([]);
    const linkedCounts = ref<Record<number, number>>({});

    const form = reactive({
      id: null as number | null,
      name: '',
      color: '#6366f1'
    });

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(amount) || 0);
    };

    const loadLinked = async () => {
      if (selectedTagId.value === null) return;
      try {
        linkedTransactions.value = await tagStore.getTagTransactions(selectedTagId.value, linkType.value);
        linkedCounts.value[selectedTagId.value] = linkedTransactions.value.length;
      } catch (e) {
        toast.error('Failed to load linked transactions');
      }
    };

    const viewTransactions = async (id: number) => {
      selectedTagId.value = selectedTagId.value === id ? null : id;
      if (selectedTagId.value !== null) await loadLinked();
    };

    const setLinkType = async (type: 'income' | 'expense') => {
      linkType.value = type;
      if (selectedTagId.value !== null && !showLinkModal.value) await loadLinked();
      if (showLinkModal.value) await loadCandidates();
    };

    const loadCandidates = async () => {
      try {
        const endpoint = linkType.value === 'expense' ? 'expenses' : 'incomes';
        const response = await axios.get(`${API_URL}/${endpoint}`);
        linkCandidates.value = Array.isArray(response.data) ? response.data : [];
      } catch (e) {
        toast.error(`Failed to load ${linkType.value} records`);
      }
    };

    const openLinkModal = async (id: number) => {
      selectedTagId.value = id;
      selectedTxIds.value = [];
      showLinkModal.value = true;
      await loadCandidates();
    };

    const submitLink = async () => {
      if (selectedTagId.value === null) return;
      try {
        await tagStore.addToTransactions(selectedTagId.value, selectedTxIds.value, linkType.value);
        toast.success(`Linked ${selectedTxIds.value.length} transaction(s)`);
        showLinkModal.value = false;
        await loadLinked();
      } catch (e) {
        toast.error('Failed to link transactions');
      }
    };

    const editTag = (tag: Tag) => {
      form.id = tag.id;
      form.name = tag.name;
      form.color = tag.color || '#6366f1';
      editMode.value = true;
      showAddModal.value = true;
    };

    const deleteTag = async (id: number) => {
      const ok = await confirm({
        title: 'Delete Tag',
        content: 'Are you sure you want to delete this tag? Links to transactions will be removed.',
        confirmText: 'Delete'
      });
      if (!ok) return;
      try {
        await tagStore.deleteTag(id);
        if (selectedTagId.value === id) {
          selectedTagId.value = null;
          linkedTransactions.value = [];
        }
        toast.success('Tag deleted');
      } catch (e) {
        toast.error('Failed to delete tag');
      }
    };

    const handleSubmit = async () => {
      try {
        if (editMode.value && form.id) {
          await tagStore.updateTag(form.id, { name: form.name, color: form.color });
          toast.success('Tag updated');
        } else {
          await tagStore.createTag({ name: form.name, color: form.color });
          toast.success('Tag created');
        }
        closeModal();
      } catch (e: any) {
        toast.error(e.response?.data?.error || 'Failed to save tag');
      }
    };

    const closeModal = () => {
      showAddModal.value = false;
      editMode.value = false;
      form.id = null;
      form.name = '';
      form.color = '#6366f1';
    };

    onMounted(async () => {
      try {
        await tagStore.fetchTags();
      } catch (e) {
        toast.error('Failed to load tags');
      }
    });

    return {
      tagStore,
      showAddModal,
      showLinkModal,
      editMode,
      form,
      selectedTagId,
      linkType,
      linkedTransactions,
      linkCandidates,
      selectedTxIds,
      linkedCounts,
      formatCurrency,
      viewTransactions,
      setLinkType,
      openLinkModal,
      submitLink,
      editTag,
      deleteTag,
      handleSubmit,
      closeModal
    };
  }
});
</script>
