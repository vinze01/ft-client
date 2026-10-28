<template>
  <div class="animate-fade-in">
    <PageHeader title="Recurring Transactions" subtitle="Auto-generated income and expenses">
      <template #actions>
        <button @click="showAddModal = true" class="btn btn-primary">
          <component :is="PlusIcon" class="w-4 h-4" />
          Add Recurring
        </button>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="item in recurring"
        :key="item.id"
        class="card p-4"
        :class="{ 'opacity-50': !item.isActive }"
      >
        <div class="flex items-start justify-between mb-3">
          <span class="badge" :class="item.type === 'income' ? 'badge-success' : 'badge-danger'">
            {{ item.type }}
          </span>
          <span class="badge badge-neutral">{{ item.frequency }}</span>
        </div>
        
        <h3 class="font-semibold text-ink mb-1">{{ item.description }}</h3>
        <p class="text-xl font-semibold text-ink financial-amount mb-2">
          {{ formatCurrency(item.amount) }}
        </p>
        <p class="text-sm text-ink-secondary mb-3">
          Next: {{ formatDate(item.nextExecution) }}
        </p>

        <div class="flex gap-2">
          <button @click="executeNow(item.id)" class="btn btn-primary flex-1 text-sm">Execute</button>
          <button @click="toggleActive(item)" class="btn btn-ghost" :title="item.isActive ? 'Deactivate' : 'Activate'" :aria-label="item.isActive ? 'Deactivate' : 'Activate'">
            <svg v-if="item.isActive" class="w-4 h-4 text-income" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <svg v-else class="w-4 h-4 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <EmptyState
      v-if="recurring.length === 0"
      :icon="RepeatIcon"
      title="No recurring transactions"
      description="Set up automatic income and expenses."
      action-label="Add Recurring"
      @action="showAddModal = true"
    />

    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal-content animate-scale-in" role="dialog" aria-modal="true">
        <div class="modal-header">
          <h3 class="section-title">Add Recurring</h3>
          <button @click="showAddModal = false" class="p-1.5 rounded-lg hover:bg-[var(--surface-elevated)]" style="color: var(--text-muted)" aria-label="Close">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="modal-body">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="label">Type</label>
            <select v-model="form.type" class="input">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label class="label">Description</label>
            <input v-model="form.description" type="text" class="input" placeholder="Monthly salary" required />
          </div>
          <div>
            <label class="label">Amount</label>
            <input v-model.number="form.amount" type="number" step="0.01" class="input" required />
          </div>
          <div>
            <label class="label">Frequency</label>
            <select v-model="form.frequency" class="input">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div>
            <label class="label">Start Date</label>
            <input v-model="form.startDate" type="date" class="input" required />
          </div>
          <div>
            <label class="label">End Date (Optional)</label>
            <input v-model="form.endDate" type="date" class="input" />
          </div>
          <div>
            <label class="label">Execution Day (Optional)</label>
            <input
              v-model.number="form.executionDay"
              type="number"
              min="1"
              max="31"
              class="input"
              placeholder="e.g. 15"
            />
          </div>
          <div>
            <label class="label">Account (Optional)</label>
            <select v-model="form.accountId" class="input">
              <option :value="null">No account</option>
              <option v-for="acc in accounts" :key="acc.id" :value="acc.id">
                {{ acc.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="label">Remind Days Before Execution</label>
            <input
              v-model.number="form.reminderDaysBefore"
              type="number"
              min="0"
              max="30"
              class="input"
            />
          </div>
          <div class="flex items-center gap-2">
            <input v-model="form.autoGenerate" type="checkbox" id="autoGenerate" class="w-4 h-4" />
            <label for="autoGenerate" class="text-sm text-ink-secondary">Auto-generate transactions</label>
          </div>
          <div class="flex gap-3 pt-2">
            <button type="button" @click="showAddModal = false" class="btn btn-secondary flex-1">Cancel</button>
            <button type="submit" class="btn btn-primary flex-1">Create</button>
          </div>
        </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from 'vue';
import axios from 'axios';
import { useRecurringStore, type RecurringTransaction } from '../stores/recurringStore';
import PageHeader from '../components/PageHeader.vue';
import EmptyState from '../components/EmptyState.vue';
import { PlusIcon, RepeatIcon } from '../components/icons';

const API_URL = 'http://localhost:3001/api';

export default defineComponent({
  name: 'RecurringView',
  components: { PageHeader, EmptyState },
  setup() {
    const recurringStore = useRecurringStore();
    const showAddModal = ref(false);
    const accounts = ref<{ id: number; name: string }[]>([]);

    const form = reactive({
      type: 'expense' as string,
      description: '',
      amount: 0,
      frequency: 'monthly' as string,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '' as string,
      executionDay: null as number | null,
      accountId: null as number | null,
      reminderDaysBefore: 0,
      autoGenerate: true
    });

    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<{ id: number; name: string }[]>(
          `${API_URL}/accounts`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        accounts.value = response.data;
      } catch {
        // Account linking is optional; leave the dropdown empty on failure.
      }
    };

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
    };

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const executeNow = async (id: number) => {
      await recurringStore.execute(id);
    };

    const toggleActive = async (item: RecurringTransaction) => {
      await recurringStore.updateRecurring(item.id, { isActive: !item.isActive });
    };

    const handleSubmit = async () => {
      await recurringStore.createRecurring({
        ...form,
        endDate: form.endDate || undefined,
        executionDay: form.executionDay || undefined
      });
      showAddModal.value = false;
    };

    onMounted(async () => {
      await recurringStore.fetchRecurring();
      fetchAccounts();
    });

    return {
      recurring: recurringStore.recurring,
      accounts,
      showAddModal,
      form,
      formatCurrency,
      formatDate,
      executeNow,
      toggleActive,
      handleSubmit,
      PlusIcon,
      RepeatIcon
    };
  }
});
</script>