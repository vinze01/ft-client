<template>
  <div class="animate-fade-in">
    <PageHeader title="Financial Goals" subtitle="Set and track your savings goals">
      <template #actions>
        <button @click="showAddModal = true" class="btn btn-primary">
          <component :is="PlusIcon" class="w-4 h-4" />
          Add Goal
        </button>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div
        v-for="goal in goals"
        :key="goal.id"
        class="card p-4"
      >
        <div class="flex items-start justify-between mb-3">
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold overflow-hidden"
            :style="{ backgroundColor: getCategoryColor(goal.category) }"
          >
            <img
              v-if="goal.imageUrl"
              :src="goal.imageUrl"
              :alt="goal.name"
              class="w-full h-full object-cover"
            />
            <template v-else>{{ goal.name.charAt(0).toUpperCase() }}</template>
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

        <h3 class="font-semibold mb-1" style="color: var(--text-primary)">{{ goal.name }}</h3>
        <p class="text-sm mb-3 capitalize" style="color: var(--text-secondary)">{{ goal.category }}</p>

        <div class="progress-bar mb-2">
          <div
            class="progress-fill"
            :style="{ width: getProgress(goal) + '%', backgroundColor: 'var(--accent-color)' }"
          ></div>
        </div>

        <div class="flex justify-between text-sm mb-3">
          <span class="financial-amount" style="color: var(--text-primary)">{{ formatCurrency(goal.currentAmount) }}</span>
          <span class="financial-amount" style="color: var(--text-secondary)">{{ formatCurrency(goal.targetAmount) }}</span>
        </div>

        <div class="flex gap-2">
          <button @click="contribute(goal)" class="btn btn-primary flex-1 text-sm">
            Contribute
          </button>
          <button @click="editGoal(goal)" class="btn btn-ghost" title="Edit goal" aria-label="Edit goal">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a3.5 3.5 0 11-4.95 4.95l-4.95 4.95a3.5 3.5 0 014.95 4.95l5.657 5.657a3.5 3.5 0 01-4.95 4.95l-5.657-5.657a3.5 3.5 0 00-4.95 0"></path>
            </svg>
          </button>
          <button @click="deleteGoal(goal.id)" class="btn btn-ghost" style="color: var(--expense)" title="Delete goal" aria-label="Delete goal">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1H6a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>

        <p v-if="goal.isCompleted" class="text-sm mt-2 font-semibold" style="color: var(--income)">Completed!</p>
        <p v-else-if="goal.deadline" class="text-sm mt-2" style="color: var(--text-secondary)">
          Target: {{ formatDate(goal.deadline) }}
        </p>
      </div>
    </div>

    <EmptyState
      v-if="goals.length === 0"
      :icon="TargetIcon"
      title="No goals yet"
      description="Create your first savings goal."
      action-label="Add Goal"
      @action="showAddModal = true"
    />

    <div v-if="showAddModal || showContributeModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content animate-scale-in" role="dialog" aria-modal="true">
        <div class="modal-header">
          <h3 class="section-title">
            {{ showContributeModal ? 'Contribute' : (editMode ? 'Edit' : 'Add') }} Goal
          </h3>
          <button @click="closeModal" class="p-1.5 rounded-lg hover:bg-[var(--surface-elevated)]" style="color: var(--text-muted)" aria-label="Close">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="modal-body">
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

          <div v-if="!showContributeModal">
            <label class="label">Image URL (Optional)</label>
            <input
              v-model="form.imageUrl"
              type="url"
              class="input"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" @click="closeModal" class="btn btn-secondary flex-1">Cancel</button>
            <button type="submit" class="btn btn-primary flex-1">{{ showContributeModal ? 'Add' : (editMode ? 'Update' : 'Create') }}</button>
          </div>
        </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from 'vue';
import { useGoalStore, type Goal } from '../stores/goalStore';
import { useThemeStore } from '../stores/themeStore';
import { toast } from '../components/Toast.vue';
import PageHeader from '../components/PageHeader.vue';
import EmptyState from '../components/EmptyState.vue';
import { PlusIcon, TargetIcon } from '../components/icons';

const categoryColors: Record<string, string> = {
  emergency: '#ef4444',
  investment: '#8b5cf6',
  purchase: '#f97316',
  travel: '#0ea5e9',
  other: '#64748b'
};

export default defineComponent({
  name: 'GoalsView',
  components: { PageHeader, EmptyState },
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
      priority: 'medium' as string,
      imageUrl: ''
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
      return categoryColors[category] || '#64748b';
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
      form.imageUrl = goal.imageUrl || '';
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
      form.imageUrl = '';
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
      closeModal,
      PlusIcon,
      TargetIcon
    };
  }
});
</script>