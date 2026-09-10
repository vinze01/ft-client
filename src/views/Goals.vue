<template>
  <div class="animate-fade-in">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-1">
          Financial Goals
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          Set and track your savings goals
        </p>
      </div>
      <button @click="showAddModal = true" class="btn btn-primary">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Add Goal
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div
        v-for="goal in goals"
        :key="goal.id"
        class="card p-4"
      >
        <div class="flex items-start justify-between mb-3">
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
            :style="{ backgroundColor: getCategoryColor(goal.category) }"
          >
            {{ goal.name.charAt(0).toUpperCase() }}
          </div>
          <span
            class="badge"
            :class="{
              'badge-danger': goal.priority === 'high',
              'badge-warning': goal.priority === 'medium',
              'badge-neutral': goal.priority === 'low'
            }"
          >
            {{ goal.priority }}
          </span>
        </div>

        <h3 class="font-semibold text-gray-800 dark:text-white mb-1">{{ goal.name }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-3 capitalize">{{ goal.category }}</p>

        <div class="progress-bar mb-2">
          <div
            class="progress-fill"
            :style="{ width: getProgress(goal) + '%', backgroundColor: themeStore.accentColor }"
          ></div>
        </div>

        <div class="flex justify-between text-sm mb-3">
          <span class="text-gray-600 dark:text-gray-400">{{ formatCurrency(goal.currentAmount) }}</span>
          <span class="text-gray-500">{{ formatCurrency(goal.targetAmount) }}</span>
        </div>

        <div class="flex gap-2">
          <button @click="contribute(goal)" class="btn btn-primary flex-1 text-sm">
            Contribute
          </button>
          <button @click="editGoal(goal)" class="btn btn-ghost">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a3.5 3.5 0 11-4.95 4.95l-4.95 4.95a3.5 3.5 0 014.95 4.95l5.657 5.657a3.5 3.5 0 01-4.95 4.95l-5.657-5.657a3.5 3.5 0 00-4.95 0"></path>
            </svg>
          </button>
          <button @click="deleteGoal(goal.id)" class="btn btn-ghost text-red-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1H6a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>

        <p v-if="goal.isCompleted" class="text-sm text-green-600 mt-2 font-semibold">Completed!</p>
        <p v-else-if="goal.deadline" class="text-sm text-gray-500 mt-2">
          Target: {{ formatDate(goal.deadline) }}
        </p>
      </div>
    </div>

    <div v-if="goals.length === 0" class="empty-state">
      <div class="empty-state-icon">
        <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <h3 class="empty-state-title">No goals yet</h3>
      <p class="empty-state-description">Create your first savings goal</p>
      <button @click="showAddModal = true" class="btn btn-primary mt-4">Add Goal</button>
    </div>

    <div v-if="showAddModal || showContributeModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closeModal">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md animate-fade-in">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">
            {{ showContributeModal ? 'Contribute' : (editMode ? 'Edit' : 'Add') }} Goal
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div v-if="!showContributeModal">
            <label class="label">Goal Name</label>
            <input v-model="form.name" type="text" class="input" placeholder="Emergency Fund" required />
          </div>

          <div v-if="!showContributeModal">
            <label class="label">Target Amount</label>
            <input v-model.number="form.targetAmount" type="number" step="0.01" class="input" placeholder="10000" required />
          </div>

          <div v-if="showContributeModal">
            <label class="label">Amount to Add</label>
            <input v-model.number="form.currentAmount" type="number" step="0.01" class="input" placeholder="100" required />
          </div>

          <div v-if="!showContributeModal">
            <label class="label">Deadline (Optional)</label>
            <input v-model="form.deadline" type="date" class="input" />
          </div>

          <div v-if="!showContributeModal">
            <label class="label">Category</label>
            <select v-model="form.category" class="input">
              <option value="emergency">Emergency Fund</option>
              <option value="investment">Investment</option>
              <option value="purchase">Purchase</option>
              <option value="travel">Travel</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div v-if="!showContributeModal">
            <label class="label">Priority</label>
            <select v-model="form.priority" class="input">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div class="flex gap-3">
            <button type="button" @click="closeModal" class="btn btn-secondary flex-1">Cancel</button>
            <button type="submit" class="btn btn-primary flex-1">{{ showContributeModal ? 'Add' : (editMode ? 'Update' : 'Create') }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from 'vue';
import { useGoalStore, type Goal } from '../stores/goalStore';
import { useThemeStore } from '../stores/themeStore';
import { toast } from '../components/Toast.vue';

const categoryColors: Record<string, string> = {
  emergency: '#ef4444',
  investment: '#8b5cf6',
  purchase: '#f97316',
  travel: '#0ea5e9',
  other: '#6366f1'
};

export default defineComponent({
  name: 'GoalsView',
  setup() {
    const goalStore = useGoalStore();
    const themeStore = useThemeStore();
    const showAddModal = ref(false);
    const showContributeModal = ref(false);
    const editMode = ref(false);

    const form = reactive({
      id: null as number | null,
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      deadline: '',
      category: 'other' as string,
      priority: 'medium' as string
    });

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
    };

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getProgress = (goal: Goal) => {
      return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
    };

    const getCategoryColor = (category: string) => {
      return categoryColors[category] || '#6366f1';
    };

    const contribute = (goal: Goal) => {
      form.id = goal.id;
      form.name = goal.name;
      showContributeModal.value = true;
    };

    const editGoal = (goal: Goal) => {
      form.id = goal.id;
      form.name = goal.name;
      form.targetAmount = goal.targetAmount;
      form.deadline = goal.deadline || '';
      form.category = goal.category;
      form.priority = goal.priority;
      editMode.value = true;
      showAddModal.value = true;
    };

    const deleteGoal = async (id: number) => {
      if (confirm('Delete this goal?')) {
        try {
          await goalStore.deleteGoal(id);
          toast.success('Goal deleted');
        } catch (e) {
          toast.error('Failed to delete goal');
        }
      }
    };

    const handleSubmit = async () => {
      try {
        if (showContributeModal.value && form.id) {
          await goalStore.contribute(form.id, form.currentAmount);
          toast.success('Contribution added');
        } else if (editMode.value && form.id) {
          await goalStore.updateGoal(form.id, form);
          toast.success('Goal updated');
        } else {
          await goalStore.createGoal(form);
          toast.success('Goal created');
        }
        closeModal();
      } catch (e: any) {
        toast.error(e.response?.data?.error || 'Failed to save goal');
      }
    };

    const closeModal = () => {
      showAddModal.value = false;
      showContributeModal.value = false;
      editMode.value = false;
      form.id = null;
      form.name = '';
      form.targetAmount = 0;
      form.currentAmount = 0;
      form.deadline = '';
      form.category = 'other';
      form.priority = 'medium';
    };

    onMounted(async () => {
      await goalStore.fetchGoals();
    });

    return {
      goals: goalStore.goals,
      showAddModal,
      showContributeModal,
      editMode,
      form,
      themeStore,
      formatCurrency,
      formatDate,
      getProgress,
      getCategoryColor,
      contribute,
      editGoal,
      deleteGoal,
      handleSubmit,
      closeModal
    };
  }
});
</script>