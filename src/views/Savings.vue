<template>
  <div class="animate-fade-in">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-1">
          Savings
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          Automate savings and track projections
        </p>
      </div>
      <div class="flex gap-2">
        <button
          v-if="savingsStore.hasConfig"
          @click="toggleActive"
          class="btn"
          :class="savingsStore.isActive ? 'btn-secondary' : 'btn-primary'"
        >
          {{ savingsStore.isActive ? 'Pause' : 'Activate' }}
        </button>
      </div>
    </div>

    <div class="card p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Savings Plan</h2>
      <form @submit.prevent="saveConfig" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="label">Mode</label>
          <select v-model="configForm.mode" class="input">
            <option value="fixed_percentage">Fixed Percentage</option>
            <option value="leftover_based">Leftover Based</option>
            <option value="goal_based">Goal Based</option>
          </select>
        </div>
        <div v-if="configForm.mode === 'fixed_percentage'">
          <label class="label">Target Percentage (%)</label>
          <input v-model.number="configForm.targetPercentage" type="number" min="0" max="100" step="0.1" class="input" placeholder="10" />
        </div>
        <div>
          <label class="label">Target Account</label>
          <select v-model.number="configForm.targetAccountId" class="input">
            <option :value="undefined">Select account</option>
            <option v-for="acc in accountStore.accounts" :key="acc.id" :value="acc.id">
              {{ acc.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="label">Spending Account</label>
          <select v-model.number="configForm.spendingAccountId" class="input">
            <option :value="undefined">Select account</option>
            <option v-for="acc in accountStore.accounts" :key="acc.id" :value="acc.id">
              {{ acc.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="label">Minimum Balance</label>
          <input v-model.number="configForm.minBalance" type="number" min="0" step="0.01" class="input" placeholder="0.00" />
        </div>
        <div class="flex items-end">
          <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 pb-3">
            <input v-model="configForm.isActive" type="checkbox" class="w-4 h-4" />
            Active
          </label>
        </div>
        <div class="md:col-span-2 flex justify-end">
          <button type="submit" class="btn btn-primary">Save Plan</button>
        </div>
      </form>
      <p v-if="!savingsStore.hasConfig" class="text-sm text-gray-500 dark:text-gray-400 mt-3">
        No savings plan yet. Saving this form creates one.
      </p>
    </div>

    <div class="card p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Calculate Savings</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="label">Period Start</label>
          <input v-model="calcForm.periodStart" type="date" class="input" />
        </div>
        <div>
          <label class="label">Period End</label>
          <input v-model="calcForm.periodEnd" type="date" class="input" />
        </div>
        <div class="flex items-end">
          <button @click="runCalculate" :disabled="!savingsStore.hasConfig" class="btn btn-primary w-full">
            Calculate & Allocate
          </button>
        </div>
      </div>
      <div v-if="savingsStore.lastCalculation" class="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
        <p class="text-sm text-gray-500 dark:text-gray-400">Allocated this run</p>
        <p class="text-xl font-bold text-emerald-600">{{ formatCurrency(savingsStore.lastCalculation.allocated) }}</p>
      </div>
      <p v-if="!savingsStore.hasConfig" class="text-sm text-gray-500 dark:text-gray-400">
        Save a plan first, then run a calculation.
      </p>
    </div>

    <div class="card p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Allocation History</h2>
      <div v-if="savingsStore.allocations.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
        No allocations yet. Run a calculation to create some.
      </div>
      <div v-else class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Goal</th>
              <th>Period</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alloc in savingsStore.allocations" :key="alloc.id">
              <td class="font-bold text-emerald-600">{{ formatCurrency(alloc.amount) }}</td>
              <td class="text-gray-800 dark:text-white">{{ alloc.goal?.name || '-' }}</td>
              <td class="text-gray-500 dark:text-gray-400">{{ formatDate(alloc.periodStart) }} → {{ formatDate(alloc.periodEnd) }}</td>
              <td><span class="badge badge-success">{{ alloc.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Projection</h2>
        <div class="flex gap-2 items-center">
          <span class="text-sm text-gray-500 dark:text-gray-400">Months</span>
          <select v-model.number="projectionMonths" @change="loadProjection" class="input !w-auto !py-2">
            <option :value="6">6</option>
            <option :value="12">12</option>
            <option :value="24">24</option>
          </select>
        </div>
      </div>
      <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 mb-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">Total projected ({{ projectionMonths }} mo)</p>
        <p class="text-xl font-bold text-gray-800 dark:text-white">{{ formatCurrency(savingsStore.totalProjected) }}</p>
      </div>
      <div v-if="savingsStore.projections.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
        No projection available. Activate a savings plan first.
      </div>
      <div v-else class="space-y-2">
        <div v-for="p in savingsStore.projections" :key="p.month" class="flex items-center justify-between text-sm">
          <span class="text-gray-700 dark:text-gray-300">{{ p.month }}</span>
          <span class="font-medium text-gray-800 dark:text-white">
            {{ formatCurrency(p.projectedSavings) }}
            <span class="text-gray-500 dark:text-gray-400 ml-2">cum. {{ formatCurrency(p.cumulativeSavings) }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from 'vue';
import { useSavingsStore } from '../stores/savingsStore';
import { useAccountStore } from '../stores/accountStore';
import { toast } from '../components/Toast.vue';

export default defineComponent({
  name: 'SavingsView',
  setup() {
    const savingsStore = useSavingsStore();
    const accountStore = useAccountStore();
    const projectionMonths = ref(12);

    const configForm = reactive({
      mode: 'fixed_percentage' as string,
      targetPercentage: 10,
      targetAccountId: undefined as number | undefined,
      spendingAccountId: undefined as number | undefined,
      minBalance: 0,
      isActive: true
    });

    const calcForm = reactive({
      periodStart: '',
      periodEnd: ''
    });

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(amount) || 0);
    };

    const formatDate = (date: string) => {
      if (!date) return '-';
      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const fillConfigForm = () => {
      const c = savingsStore.config;
      if (!c) return;
      configForm.mode = c.mode;
      configForm.targetPercentage = c.targetPercentage ?? 10;
      configForm.targetAccountId = c.targetAccountId;
      configForm.spendingAccountId = c.spendingAccountId;
      configForm.minBalance = Number(c.minBalance) || 0;
      configForm.isActive = c.isActive;
    };

    const saveConfig = async () => {
      try {
        await savingsStore.saveConfig({ ...configForm });
        toast.success('Savings plan saved');
      } catch (e: any) {
        toast.error(e.response?.data?.error || 'Failed to save savings plan');
      }
    };

    const toggleActive = async () => {
      try {
        if (savingsStore.isActive) {
          await savingsStore.deactivate();
          toast.success('Savings automation paused');
        } else {
          await savingsStore.activate();
          toast.success('Savings automation activated');
        }
      } catch (e) {
        toast.error('Failed to update savings plan status');
      }
    };

    const runCalculate = async () => {
      try {
        const result = await savingsStore.calculate(calcForm.periodStart || undefined, calcForm.periodEnd || undefined);
        toast.success(`Allocated ${formatCurrency(result.allocated)}`);
      } catch (e: any) {
        toast.error(e.response?.data?.error || 'Failed to calculate savings');
      }
    };

    const loadProjection = async () => {
      try {
        await savingsStore.fetchProjection(projectionMonths.value);
      } catch (e) {
        toast.error('Failed to load projection');
      }
    };

    onMounted(async () => {
      try {
        await accountStore.fetchAccounts();
        await savingsStore.fetchConfig();
        fillConfigForm();
        await savingsStore.fetchAllocations();
        await loadProjection();
      } catch (e) {
        toast.error('Failed to load savings data');
      }
    });

    return {
      savingsStore,
      accountStore,
      configForm,
      calcForm,
      projectionMonths,
      formatCurrency,
      formatDate,
      saveConfig,
      toggleActive,
      runCalculate,
      loadProjection
    };
  }
});
</script>
