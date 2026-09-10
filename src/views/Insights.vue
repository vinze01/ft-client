<template>
  <div class="animate-fade-in">
    <div class="mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-1">
        Financial Insights
      </h1>
      <p class="text-gray-500 dark:text-gray-400 text-sm">
        Analysis of your finances
      </p>
    </div>

    <div class="card p-6 mb-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
          <svg class="w-5 h-5 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Monthly Summary</h2>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Total Income</p>
          <p class="text-lg font-bold text-green-600">{{ formatCurrency(stats.totalIncome) }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
          <p class="text-lg font-bold text-red-600">{{ formatCurrency(stats.totalExpenses) }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Net Savings</p>
          <p class="text-lg font-bold" :class="stats.netSavings >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ formatCurrency(stats.netSavings) }}
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Savings Rate</p>
          <p class="text-lg font-bold text-brand-600">{{ stats.savingsRate.toFixed(1) }}%</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="card p-6">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Net Worth</p>
        <p class="text-xl font-bold text-gray-800 dark:text-white">{{ formatCurrency(netWorth) }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Active accounts balance</p>
      </div>
      <div class="card p-6">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Burn Rate (MTD)</p>
        <p class="text-xl font-bold text-gray-800 dark:text-white">{{ formatCurrency(burnRate.current) }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {{ formatCurrency(burnRate.daily) }}/day · proj. {{ formatCurrency(burnRate.projectedMonthly) }}/mo
        </p>
      </div>
      <div class="card p-6">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Savings Rate (12 mo)</p>
        <p class="text-xl font-bold text-brand-600">{{ savingsRateYear.toFixed(1) }}%</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Income vs expenses</p>
      </div>
    </div>

    <div class="card p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Spending by Category</h2>
      <div v-if="expenseCategories.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
        No expense data yet.
      </div>
      <div v-else class="space-y-3">
        <div v-for="cat in expenseCategories" :key="cat.category" class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: categoryColor(cat.category) }"></div>
            <span class="text-gray-700 dark:text-gray-300">{{ cat.category }}</span>
          </div>
          <div class="text-right">
            <span class="font-medium text-gray-800 dark:text-white">{{ formatCurrency(cat.amount) }}</span>
            <span class="text-sm text-gray-500 ml-2">({{ cat.percentage }}%)</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Income by Category</h2>
      <div v-if="incomeCategories.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
        No income data yet.
      </div>
      <div v-else class="space-y-3">
        <div v-for="cat in incomeCategories" :key="cat.category" class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: categoryColor(cat.category) }"></div>
            <span class="text-gray-700 dark:text-gray-300">{{ cat.category }}</span>
          </div>
          <div class="text-right">
            <span class="font-medium text-gray-800 dark:text-white">{{ formatCurrency(cat.amount) }}</span>
            <span class="text-sm text-gray-500 ml-2">({{ cat.percentage }}%)</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card p-6">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Expense Trend (12 mo)</h2>
      <div v-if="trend.labels.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
        Not enough data for a trend yet.
      </div>
      <div v-else class="space-y-2">
        <div v-for="(label, i) in trend.labels" :key="label">
          <div class="flex items-center justify-between text-sm mb-1">
            <span class="text-gray-700 dark:text-gray-300">{{ label }}</span>
            <span class="font-medium text-gray-800 dark:text-white">{{ formatCurrency(trend.values[i]) }}</span>
          </div>
          <div class="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
            <div
              class="h-full rounded-full bg-[var(--accent-color)]"
              :style="{ width: trendMax > 0 ? Math.round((trend.values[i] / trendMax) * 100) + '%' : '0%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref, computed } from 'vue';
import axios from 'axios';
import { toast } from '../components/Toast.vue';

const API_URL = 'http://localhost:3001/api';

interface CategorySlice {
  category: string;
  amount: number;
  percentage: number;
}

const PALETTE = ['#ef4444', '#3b82f6', '#8b5cf6', '#f97316', '#22c55e', '#14b8a6', '#ec4899', '#f59e0b'];

export default defineComponent({
  name: 'InsightsView',
  setup() {
    const stats = reactive({
      totalIncome: 0,
      totalExpenses: 0,
      netSavings: 0,
      savingsRate: 0
    });

    const expenseCategories = ref<CategorySlice[]>([]);
    const incomeCategories = ref<CategorySlice[]>([]);
    const trend = reactive<{ labels: string[]; values: number[] }>({ labels: [], values: [] });
    const burnRate = reactive({ current: 0, daily: 0, projectedMonthly: 0 });
    const netWorth = ref(0);
    const savingsRateYear = ref(0);

    const trendMax = computed(() => Math.max(0, ...trend.values));

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(amount) || 0);
    };

    const categoryColor = (name: string) => {
      let hash = 0;
      for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % 997;
      return PALETTE[hash % PALETTE.length];
    };

    onMounted(async () => {
      try {
        const [incomeRes, expenseRes] = await Promise.all([
          axios.get(`${API_URL}/incomes/total`),
          axios.get(`${API_URL}/expenses/summary`)
        ]);

        stats.totalIncome = incomeRes.data.totalIncome || 0;
        stats.totalExpenses = Object.values(expenseRes.data.totalExpenses || {}).reduce((a: any, b: any) => a + Number(b), 0) as number;
        stats.netSavings = stats.totalIncome - stats.totalExpenses;
        stats.savingsRate = stats.totalIncome > 0
          ? (stats.netSavings / stats.totalIncome) * 100
          : 0;
      } catch (e) {
        toast.error('Failed to load summary');
      }

      try {
        const [
          expCatRes,
          incCatRes,
          trendRes,
          burnRes,
          worthRes,
          rateRes
        ] = await Promise.all([
          axios.get(`${API_URL}/analytics/expenses-by-category`),
          axios.get(`${API_URL}/analytics/income-by-category`),
          axios.get(`${API_URL}/analytics/trends`, { params: { metric: 'expense', months: 12 } }),
          axios.get(`${API_URL}/analytics/burn-rate`),
          axios.get(`${API_URL}/analytics/net-worth`),
          axios.get(`${API_URL}/analytics/savings-rate`)
        ]);

        expenseCategories.value = expCatRes.data.data || [];
        incomeCategories.value = incCatRes.data.data || [];
        trend.labels = trendRes.data.data?.labels || [];
        trend.values = trendRes.data.data?.values || [];
        Object.assign(burnRate, burnRes.data.data || {});
        netWorth.value = worthRes.data.data?.[0]?.value || 0;
        const rates = rateRes.data.data || [];
        savingsRateYear.value = rates.length > 0 ? rates[0].rate || 0 : 0;
      } catch (e) {
        toast.error('Failed to load analytics');
      }
    });

    return {
      stats,
      expenseCategories,
      incomeCategories,
      trend,
      trendMax,
      burnRate,
      netWorth,
      savingsRateYear,
      formatCurrency,
      categoryColor
    };
  }
});
</script>
