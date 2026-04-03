<template>
  <div class="animate-fade-in">
    <!-- Page Header with View Switcher -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-800 mb-1">Dashboard</h1>
        <p class="text-gray-500">Welcome back, {{ fullName }}!</p>
      </div>
      
      <!-- View Type Switcher -->
      <div class="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
        <button
          v-for="v in viewTypes"
          :key="v.value"
          @click="currentView = v.value"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          :class="currentView === v.value 
            ? 'bg-indigo-100 text-indigo-700' 
            : 'text-gray-500 hover:text-gray-700'"
        >
          {{ v.label }}
        </button>
      </div>
    </div>

    <!-- Period Selector -->
    <div class="card p-4 mb-6">
      <div class="flex flex-col sm:flex-row items-center gap-4">
        <button @click="prevPeriod" class="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        
        <div v-if="currentView === 'bi-monthly'" class="flex items-center gap-2">
          <select v-model="selectedHalfMonth" @change="fetchDashboard" class="input w-auto">
            <option :value="1">1st Half (Days 1-15)</option>
            <option :value="2">2nd Half (Days 16-31)</option>
          </select>
        </div>
        
        <span class="text-lg font-semibold text-gray-800 flex-1 text-center">
          {{ periodLabel }}
        </span>
        
        <button @click="nextPeriod" class="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Income Card -->
      <div class="stat-card card-hover">
        <div class="flex items-start justify-between mb-4">
          <div class="stat-icon bg-income-light text-income">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
          </div>
        </div>
        <p class="text-sm font-medium text-gray-500 uppercase tracking-wide">{{ viewLabel }} Income</p>
        <p class="text-2xl font-bold text-gray-800 mt-1">₱{{ formatNumber(summary.totalIncome) }}</p>
      </div>

      <!-- Expenses Card -->
      <div class="stat-card card-hover">
        <div class="flex items-start justify-between mb-4">
          <div class="stat-icon bg-expense-light text-expense">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
        <p class="text-sm font-medium text-gray-500 uppercase tracking-wide">{{ viewLabel }} Expenses</p>
        <p class="text-2xl font-bold text-gray-800 mt-1">₱{{ formatNumber(summary.totalExpenses) }}</p>
      </div>

      <!-- Balance Card -->
      <div class="stat-card card-hover">
        <div class="flex items-start justify-between mb-4">
          <div class="stat-icon bg-brand-100 text-brand-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
          </div>
        </div>
        <p class="text-sm font-medium text-gray-500 uppercase tracking-wide">Balance</p>
        <p :class="summary.balance >= 0 ? 'text-green-600' : 'text-red-600'" class="text-2xl font-bold mt-1">
          ₱{{ formatNumber(summary.balance) }}
        </p>
      </div>

      <!-- Budget Card -->
      <div class="stat-card card-hover">
        <div class="flex items-start justify-between mb-4">
          <div class="stat-icon bg-warning-light text-warning">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
        </div>
        <p class="text-sm font-medium text-gray-500 uppercase tracking-wide">Budget Used</p>
        <p class="text-2xl font-bold text-gray-800 mt-1">{{ budgetUsedPercent }}%</p>
        <div class="progress-bar mt-3">
          <div 
            class="progress-fill"
            :class="budgetUsedPercent > 80 ? 'bg-red-500' : budgetUsedPercent > 60 ? 'bg-amber-500' : 'bg-indigo-500'"
            :style="{ width: `${Math.min(budgetUsedPercent, 100)}%` }"
          ></div>
        </div>
        <p class="text-xs text-gray-500 mt-2">of ₱{{ formatNumber(totalBudgeted) }} budget</p>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Overview Chart -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-800">{{ chartTitle }}</h3>
        </div>
        <div ref="chartRef" class="h-64"></div>
      </div>

      <!-- Expenses by Category -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-6">Expenses by Category</h3>
        <div class="space-y-4">
          <div 
            v-for="(amount, category) in summary.expensesByCategory" 
            :key="category"
            class="flex items-center gap-4"
          >
            <div class="w-3 h-3 rounded-full" :style="{ background: getCategoryColor(category) }"></div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-gray-700">{{ category }}</span>
                <span class="text-sm font-semibold text-gray-800">₱{{ formatNumber(amount) }}</span>
              </div>
              <div class="progress-bar">
                <div 
                  class="progress-fill"
                  :style="{ 
                    width: `${getCategoryPercent(amount)}%`,
                    background: getCategoryColor(category)
                  }"
                ></div>
              </div>
            </div>
            <span class="text-xs text-gray-500 w-10 text-right">{{ getCategoryPercent(amount) }}%</span>
          </div>
          
          <div v-if="Object.keys(summary.expensesByCategory).length === 0" class="empty-state py-8">
            <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p class="empty-state-title">No expenses yet</p>
            <p class="empty-state-description">Start adding expenses to see your spending breakdown</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Budget Status Table -->
    <div class="card overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800">Budget Status</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Type</th>
              <th>Budget</th>
              <th>Spent</th>
              <th>Remaining</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in summary.budgetStatus" :key="record.category + record.type">
              <td>
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full" :style="{ background: getCategoryColor(record.category) }"></div>
                  <span class="font-medium">{{ record.category }}</span>
                </div>
              </td>
              <td>
                <span 
                  class="badge"
                  :class="{
                    'badge-success': record.type === 'monthly',
                    'badge-warning': record.type === 'yearly',
                    'badge-neutral': record.type === 'bi-monthly'
                  }"
                >
                  {{ formatBudgetType(record.type) }}
                </span>
              </td>
              <td>₱{{ formatNumber(record.budgeted) }}</td>
              <td>₱{{ formatNumber(record.spent) }}</td>
              <td :class="record.remaining >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ record.remaining >= 0 ? '+' : '' }}₱{{ formatNumber(record.remaining) }}
              </td>
              <td>
                <span :class="record.remaining >= 0 ? 'badge-success' : 'badge-danger'">
                  {{ record.remaining >= 0 ? 'Under Budget' : 'Over Budget' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="!summary.budgetStatus?.length" class="empty-state py-12">
        <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>
        <p class="empty-state-title">No budgets set</p>
        <p class="empty-state-description">Set up budgets to track your spending limits</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted, nextTick } from 'vue';
import { useAuthStore } from '../stores/authStore';
import axios from 'axios';
import type { DashboardSummary, BudgetView } from '../types';

const API_URL = 'http://localhost:3001/api';

const VIEW_TYPES = [
  { value: 'bi-monthly', label: 'Bi-Monthly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default defineComponent({
  name: 'DashboardView',
  setup() {
    const authStore = useAuthStore();
    const chartRef = ref<HTMLElement | null>(null);
    const currentView = ref<BudgetView>('bi-monthly');
    const selectedYear = ref(new Date().getFullYear());
    const selectedMonth = ref(new Date().getMonth() + 1);
    const selectedHalfMonth = ref(1);
    const viewTypes = ref(VIEW_TYPES);
    
    const summary = ref<DashboardSummary>({
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
      expensesByCategory: {},
      budgetStatus: [],
      monthlyData: [],
      yearlyData: [],
      biMonthlyData: []
    });

    const fullName = computed(() => authStore.fullName || 'User');

    const totalBudgeted = computed(() => summary.value.budgetStatus?.reduce((sum, b) => sum + b.budgeted, 0) || 0);
    const budgetUsedPercent = computed(() => {
      if (totalBudgeted.value === 0) return 0;
      const spent = summary.value.budgetStatus?.reduce((sum, b) => sum + b.spent, 0) || 0;
      return Math.round((spent / totalBudgeted.value) * 100);
    });

    const viewLabel = computed(() => {
      const labels: Record<string, string> = {
        'monthly': 'Monthly',
        'yearly': 'Yearly',
        'bi-monthly': 'Bi-Monthly'
      };
      return labels[currentView.value] || 'Monthly';
    });

    const periodLabel = computed(() => {
      if (currentView.value === 'yearly') {
        return `${selectedYear.value}`;
      } else if (currentView.value === 'bi-monthly') {
        const monthName = MONTHS[selectedMonth.value - 1];
        const halfLabel = selectedHalfMonth.value === 1 ? '1st Half (1-15)' : '2nd Half (16-31)';
        return `${monthName} ${halfLabel} ${selectedYear.value}`;
      } else {
        return `${MONTHS[selectedMonth.value - 1]} ${selectedYear.value}`;
      }
    });

    const chartTitle = computed(() => {
      if (currentView.value === 'yearly') return 'Yearly Overview';
      if (currentView.value === 'bi-monthly') return 'Bi-Monthly Overview';
      return 'Monthly Overview';
    });

    const formatNumber = (num: number): string => {
      return num.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const formatBudgetType = (type: string): string => {
      const labels: Record<string, string> = {
        'monthly': 'Monthly',
        'yearly': 'Yearly',
        'bi-monthly': 'Bi-Monthly'
      };
      return labels[type] || type;
    };

    const getCategoryPercent = (amount: number): number => {
      const total: any = Object.values(summary.value.expensesByCategory).reduce((a: any, b: any) => a + b, 0);
      return total > 0 ? Math.round((amount / total) * 100) : 0;
    };

    const getCategoryColor = (category: string): string => {
      const colors: Record<string, string> = {
        'Food': '#10b981',
        'Transportation': '#6366f1',
        'Housing': '#f59e0b',
        'Utilities': '#8b5cf6',
        'Healthcare': '#ec4899',
        'Entertainment': '#06b6d4',
        'Shopping': '#ef4444',
        'Education': '#84cc16',
        'Personal': '#14b8a6',
        'Other': '#64748b'
      };
      return colors[category] || '#6366f1';
    };

    const prevPeriod = () => {
      if (currentView.value === 'yearly') {
        selectedYear.value--;
      } else if (currentView.value === 'bi-monthly') {
        if (selectedHalfMonth.value === 1) {
          selectedHalfMonth.value = 2;
          selectedMonth.value--;
          if (selectedMonth.value < 1) {
            selectedMonth.value = 12;
            selectedYear.value--;
          }
        } else {
          selectedHalfMonth.value = 1;
        }
      } else {
        selectedMonth.value--;
        if (selectedMonth.value < 1) {
          selectedMonth.value = 12;
          selectedYear.value--;
        }
      }
      fetchDashboard();
    };

    const nextPeriod = () => {
      if (currentView.value === 'yearly') {
        selectedYear.value++;
      } else if (currentView.value === 'bi-monthly') {
        if (selectedHalfMonth.value === 2) {
          selectedHalfMonth.value = 1;
          selectedMonth.value++;
          if (selectedMonth.value > 12) {
            selectedMonth.value = 1;
            selectedYear.value++;
          }
        } else {
          selectedHalfMonth.value = 2;
        }
      } else {
        selectedMonth.value++;
        if (selectedMonth.value > 12) {
          selectedMonth.value = 1;
          selectedYear.value++;
        }
      }
      fetchDashboard();
    };

    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<DashboardSummary>(`${API_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { 
            view: currentView.value,
            year: selectedYear.value,
            month: selectedMonth.value,
            halfMonth: currentView.value === 'bi-monthly' ? selectedHalfMonth.value : undefined
          }
        });
        summary.value = response.data;
        await nextTick();
        renderChart();
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      }
    };

    const renderChart = () => {
      if (!chartRef.value) return;

      let data: any[] = [];
      if (currentView.value === 'yearly') {
        data = summary.value.yearlyData || [];
      } else if (currentView.value === 'bi-monthly') {
        data = summary.value.biMonthlyData || [];
      } else {
        data = summary.value.monthlyData || [];
      }

      if (!data.length) {
        chartRef.value.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400">No data available</div>';
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      chartRef.value.innerHTML = '';
      chartRef.value.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = chartRef.value.offsetWidth;
      const height = 256;
      canvas.width = width * 2;
      canvas.height = height * 2;
      ctx.scale(2, 2);

      const padding = { top: 40, right: 20, bottom: 40, left: 50 };
      const chartWidth = width - padding.left - padding.right;
      const chartHeight = height - padding.top - padding.bottom;

      const maxValue = Math.max(...data.map((d: any) => Math.max(d.income || 0, d.expenses || 0))) * 1.2 || 1000;
      const barWidth = chartWidth / data.length / 3;
      const spacing = chartWidth / data.length;

      ctx.fillStyle = '#64748b';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';

      data.forEach((d: any, i: number) => {
        const x = padding.left + i * spacing + spacing / 2;
        const label = d.month || d.label || String(d.year);
        ctx.fillText(label.length > 10 ? label.substring(0, 10) + '...' : label, x, height - padding.bottom + 20);
      });

      data.forEach((d: any, i: number) => {
        const x = padding.left + i * spacing + spacing / 2 - barWidth / 2;

        ctx.fillStyle = '#10b981';
        const ih = ((d.income || 0) / maxValue) * chartHeight;
        ctx.beginPath();
        ctx.roundRect(x, padding.top + chartHeight - ih, barWidth - 4, ih, [4, 4, 0, 0]);
        ctx.fill();

        ctx.fillStyle = '#ef4444';
        const eh = ((d.expenses || 0) / maxValue) * chartHeight;
        ctx.beginPath();
        ctx.roundRect(x + barWidth + 4, padding.top + chartHeight - eh, barWidth - 4, eh, [4, 4, 0, 0]);
        ctx.fill();
      });

      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#10b981';
      ctx.fillRect(padding.left, 12, 10, 10);
      ctx.fillStyle = '#64748b';
      ctx.fillText('Income', padding.left + 14, 20);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(padding.left + 70, 12, 10, 10);
      ctx.fillStyle = '#64748b';
      ctx.fillText('Expenses', padding.left + 84, 20);
    };

    watch(currentView, () => {
      fetchDashboard();
    });

    onMounted(() => {
      fetchDashboard();
    });

    return {
      chartRef,
      summary,
      fullName,
      totalBudgeted,
      budgetUsedPercent,
      currentView,
      viewTypes,
      viewLabel,
      periodLabel,
      chartTitle,
      formatNumber,
      formatBudgetType,
      getCategoryPercent,
      getCategoryColor,
      selectedHalfMonth,
      prevPeriod,
      nextPeriod,
      fetchDashboard
    };
  }
});
</script>