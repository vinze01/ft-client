<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-800 mb-1">Income</h1>
        <p class="text-gray-500">Track your salary and income by period</p>
      </div>
      <button @click="showModal()" class="btn btn-primary shadow-lg shadow-emerald-500/30">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Add Income
      </button>
    </div>

    <!-- Filters -->
    <div class="card p-4 mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <select v-model="filters.type" @change="fetchIncomes" class="input">
          <option value="">All Types</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="bi-monthly">Bi-Monthly (Quincena)</option>
        </select>
        <select v-model="filters.year" @change="fetchIncomes" class="input">
          <option value="">All Years</option>
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
        <select v-if="filters.type === 'monthly' || !filters.type || filters.type === 'bi-monthly'" v-model="filters.month" @change="fetchIncomes" class="input">
          <option value="">All Months</option>
          <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
        </select>
        <select v-if="filters.type === 'bi-monthly'" v-model="filters.halfMonth" @change="fetchIncomes" class="input">
          <option value="">All Periods</option>
          <option :value="1">1st Half (Days 1-15)</option>
          <option :value="2">2nd Half (Days 16-31)</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="card overflow-hidden">
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Period</th>
              <th>Created</th>
              <th>Updated</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="income in incomes" :key="income.id">
              <td>
                <span 
                  class="badge"
                  :class="{
                    'badge-success': income.type === 'monthly',
                    'badge-warning': income.type === 'yearly',
                    'badge-neutral': income.type === 'bi-monthly'
                  }"
                >
                  {{ formatType(income.type) }}
                </span>
              </td>
              <td>
                <span class="font-bold text-emerald-600">+₱{{ formatNumber(income.amount) }}</span>
              </td>
              <td class="text-gray-500">{{ getPeriodLabel(income) }}</td>
              <td class="text-gray-500">{{ income.createdAt ? formatDate(income.createdAt) : '-' }}</td>
              <td class="text-gray-500">{{ income.updatedAt ? formatDate(income.updatedAt) : '-' }}</td>
              <td class="text-right">
                <div class="flex items-center justify-end gap-1">
                  <button @click="editIncome(income)" class="p-2 rounded-xl hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button @click="confirmDelete(income)" class="p-2 rounded-xl hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="incomes.length === 0" class="empty-state py-16">
        <div class="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mb-4">
          <svg class="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <p class="empty-state-title">No income recorded</p>
        <p class="empty-state-description">Start adding your salary and income sources</p>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="modalVisible" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content animate-scale-in">
          <div class="modal-header">
            <div class="flex items-center gap-4">
              <div class="modal-icon bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
                <svg v-if="!editingId" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-800">
                  {{ editingId ? 'Edit Income' : 'Add New Income' }}
                </h3>
                <p class="text-sm text-gray-500">
                  {{ editingId ? 'Update the income details below' : 'Record your salary or income' }}
                </p>
              </div>
            </div>
            <button @click="closeModal" class="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="handleSubmit" class="modal-body space-y-5">
            <!-- Income Type Selection -->
            <div>
              <label class="label">Income Type</label>
              <div class="flex gap-2">
                <button
                  v-for="t in incomeTypes"
                  :key="t.value"
                  type="button"
                  @click="form.type = t.value"
                  class="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all border"
                  :class="form.type === t.value 
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-700' 
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'"
                >
                  {{ t.label }}
                </button>
              </div>
            </div>
            
            <div>
              <label class="label">Amount</label>
              <div class="relative">
                <span class="modal-input-icon">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </span>
                <input
                  v-model.number="form.amount"
                  type="number"
                  step="0.01"
                  min="0"
                  class="input pl-12"
                  placeholder="0.00"
                />
              </div>
            </div>

            <!-- Year Selection -->
            <div>
              <label class="label">Year</label>
              <div class="relative">
                <select v-model="form.year" class="input appearance-none cursor-pointer">
                  <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
                </select>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Monthly Selection -->
            <div v-if="form.type === 'monthly'">
              <label class="label">Month</label>
              <div class="relative">
                <select v-model="form.month" class="input appearance-none cursor-pointer">
                  <option value="">Select a month</option>
                  <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
                </select>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Bi-Monthly Selection (Quincena) -->
            <div v-if="form.type === 'bi-monthly'">
              <label class="label">Month</label>
              <div class="relative mb-4">
                <select v-model="form.month" class="input appearance-none cursor-pointer">
                  <option value="">Select a month</option>
                  <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
                </select>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              
              <label class="label">Pay Period (Quincena)</label>
              <div class="relative">
                <select v-model="form.halfMonth" class="input appearance-none cursor-pointer">
                  <option :value="undefined">Select period</option>
                  <option :value="1">1st Half (Days 1-15)</option>
                  <option :value="2">2nd Half (Days 16-31)</option>
                </select>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-1">In the Philippines, salaries are often paid in two installments: 1st half (1-15) and 2nd half (16-31)</p>
            </div>
          </form>
          
          <div class="modal-footer">
            <button @click="closeModal" class="btn btn-secondary">Cancel</button>
            <button @click="handleSubmit" :disabled="submitting" class="btn btn-primary shadow-lg shadow-emerald-500/30">
              <svg v-if="submitting" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-else>{{ editingId ? 'Update Income' : 'Add Income' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted } from 'vue';
import { toast } from '../components/Toast.vue';
import { confirm } from '../components/ConfirmModal.vue';
import dayjs from 'dayjs';
import axios from 'axios';
import type { Income, IncomeInput, Income as IncomeType, HalfMonth } from '../types';

const API_URL = 'http://localhost:3001/api';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const INCOME_TYPES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'bi-monthly', label: 'Bi-Monthly (Quincena)' }
];

export default defineComponent({
  name: 'IncomesView',
  setup() {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

    const loading = ref(false);
    const submitting = ref(false);
    const modalVisible = ref(false);
    const editingId = ref<number | null>(null);
    const incomes = ref<Income[]>([]);
    const months = ref(MONTHS);
    const incomeTypes = ref(INCOME_TYPES);

    const filters = reactive({
      type: '' as string,
      year: currentYear,
      month: '',
      halfMonth: '' as string
    });

    const form = reactive<IncomeInput>({
      amount: 0,
      type: 'monthly',
      year: currentYear,
      month: '',
      halfMonth: undefined
    });

    const formatNumber = (num: number): string => {
      return num.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const formatDate = (date: string): string => {
      return dayjs(date).format('MMMM DD, YYYY hh:mm A');
    };

    const formatType = (type: string): string => {
      const labels: Record<string, string> = {
        'monthly': 'Monthly',
        'yearly': 'Yearly',
        'bi-monthly': 'Bi-Monthly'
      };
      return labels[type] || type;
    };

    const getPeriodLabel = (income: Income): string => {
      if (income.type === 'yearly') {
        return `${income.year}`;
      } else if (income.type === 'bi-monthly') {
        const period = income.halfMonth === 1 ? '1st Half (1-15)' : '2nd Half (16-31)';
        return `${period} ${income.year}`;
      } else {
        return `${income.month} ${income.year}`;
      }
    };

    const fetchIncomes = async () => {
      loading.value = true;
      try {
        const token = localStorage.getItem('token');
        const params: Record<string, string> = {};
        if (filters.type) params.type = filters.type;
        if (filters.year) params.year = String(filters.year);

        const response = await axios.get<Income[]>(`${API_URL}/incomes`, {
          headers: { Authorization: `Bearer ${token}` },
          params
        });
        
        let filtered = response.data;
        
        if (filters.type === 'monthly' && filters.month) {
          filtered = filtered.filter(i => i.month === filters.month);
        }
        
        if (filters.type === 'bi-monthly' && filters.month) {
          filtered = filtered.filter(i => i.month === filters.month);
        }
        
        if (filters.type === 'bi-monthly' && filters.halfMonth) {
          filtered = filtered.filter(i => i.halfMonth === parseInt(filters.halfMonth));
        }
        
        incomes.value = filtered;
      } catch (error) {
        toast.error('Failed to fetch incomes');
      } finally {
        loading.value = false;
      }
    };

    const showModal = () => {
      editingId.value = null;
      Object.assign(form, {
        amount: 0,
        type: 'monthly',
        year: currentYear,
        month: '',
        halfMonth: undefined
      });
      modalVisible.value = true;
    };

    const editIncome = (income: Income) => {
      editingId.value = income.id;
      Object.assign(form, {
        amount: income.amount,
        type: income.type,
        year: income.year,
        month: income.month || '',
        halfMonth: income.halfMonth as HalfMonth | undefined
      });
      modalVisible.value = true;
    };

    const closeModal = () => {
      modalVisible.value = false;
      editingId.value = null;
    };

    const validateForm = (): boolean => {
      if (!form.amount) {
        toast.error('Please enter an amount');
        return false;
      }
      if (form.type === 'monthly' && !form.month) {
        toast.error('Please select a month');
        return false;
      }
      if (form.type === 'bi-monthly' && !form.month) {
        toast.error('Please select a month');
        return false;
      }
      if (form.type === 'bi-monthly' && !form.halfMonth) {
        toast.error('Please select a pay period (1st or 2nd half)');
        return false;
      }
      return true;
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;

      submitting.value = true;
      try {
        const token = localStorage.getItem('token');
        
        const payload = {
          amount: form.amount,
          type: form.type,
          year: form.year,
          month: (form.type === 'monthly' || form.type === 'bi-monthly') ? form.month : null,
          halfMonth: form.type === 'bi-monthly' ? form.halfMonth : null
        };
        
        if (editingId.value) {
          await axios.put(`${API_URL}/incomes/${editingId.value}`, payload, {
            headers: { Authorization: `Bearer ${token}` }
          });
          toast.success('Income updated successfully');
        } else {
          await axios.post(`${API_URL}/incomes`, payload, {
            headers: { Authorization: `Bearer ${token}` }
          });
          toast.success('Income added successfully');
        }

        closeModal();
        await fetchIncomes();
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to save income');
      } finally {
        submitting.value = false;
      }
    };

    const confirmDelete = async (income: Income) => {
      const periodLabel = getPeriodLabel(income);
      const ok = await confirm({
        title: 'Delete Income',
        content: `Are you sure you want to delete the income for ${periodLabel}?`,
        type: 'danger',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      });
      
      if (ok) {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`${API_URL}/incomes/${income.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          toast.success('Income deleted successfully');
          await fetchIncomes();
        } catch (error) {
          toast.error('Failed to delete income');
        }
      }
    };

    onMounted(() => {
      fetchIncomes();
    });

    return {
      loading,
      submitting,
      modalVisible,
      editingId,
      incomes,
      months,
      incomeTypes,
      years,
      filters,
      form,
      formatNumber,
      formatDate,
      formatType,
      getPeriodLabel,
      fetchIncomes,
      showModal,
      editIncome,
      closeModal,
      handleSubmit,
      confirmDelete
    };
  }
});
</script>