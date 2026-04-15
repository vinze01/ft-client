<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
    >
      <div>
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-1">
          Budgets
        </h1>
        <p class="text-gray-500 dark:text-gray-400">
          Set spending limits by period
        </p>
      </div>
      <button @click="showModal()" class="btn btn-primary shadow-lg">
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
        Add Budget
      </button>
    </div>

    <!-- Filters -->
    <div class="card p-4 mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <select v-model="filters.type" @change="fetchBudgets" class="input">
          <option value="">All Types</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="bi-monthly">Bi-Monthly (Quincena)</option>
        </select>
        <select v-model="filters.year" @change="fetchBudgets" class="input">
          <option value="">All Years</option>
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
        <select
          v-if="
            filters.type === 'monthly' ||
            !filters.type ||
            filters.type === 'bi-monthly'
          "
          v-model="filters.month"
          @change="fetchBudgets"
          class="input"
        >
          <option value="">All Months</option>
          <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
        </select>
        <select
          v-if="filters.type === 'bi-monthly'"
          v-model="filters.halfMonth"
          @change="fetchBudgets"
          class="input"
        >
          <option value="">All Periods</option>
          <option :value="1">1st Half (Days 1-15)</option>
          <option :value="2">2nd Half (Days 16-31)</option>
        </select>
      </div>
    </div>

    <!-- Desktop Table -->
    <div class="card overflow-hidden hidden md:block">
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Period</th>
              <th>Created</th>
              <th>Updated</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="budget in budgets" :key="budget.id">
              <td>
                <span
                  class="badge"
                  :class="{
                    'badge-success': budget.type === 'monthly',
                    'badge-warning': budget.type === 'yearly',
                    'badge-neutral': budget.type === 'bi-monthly',
                  }"
                >
                  {{ formatType(budget.type) }}
                </span>
              </td>
              <td>
                <div class="flex items-center gap-2">
                  <div
                    class="w-3 h-3 rounded-full"
                    :style="{ background: getCategoryColor(budget.category) }"
                  ></div>
                  <span class="font-medium text-gray-800 dark:text-white">{{
                    budget.category
                  }}</span>
                </div>
              </td>
              <td>
                <span class="font-bold text-amber-600"
                  >₱{{ formatNumber(budget.amount) }}</span
                >
              </td>
              <td class="text-gray-500 dark:text-gray-400">
                {{ getPeriodLabel(budget) }}
              </td>
              <td class="text-gray-500 dark:text-gray-400">
                {{ budget.createdAt ? formatDate(budget.createdAt) : "-" }}
              </td>
              <td class="text-gray-500 dark:text-gray-400">
                {{ budget.updatedAt ? formatDate(budget.updatedAt) : "-" }}
              </td>
              <td>
                <button
                  @click="editBudget(budget)"
                  class="p-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                  </svg>
                </button>
                <button
                  @click="confirmDelete(budget)"
                  class="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 text-gray-400 dark:text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 transition-all"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mobile Card List -->
    <div class="md:hidden space-y-3">
      <div v-for="budget in budgets" :key="budget.id" class="mobile-card">
        <div class="mobile-card-header">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <div
                class="w-3 h-3 rounded-full"
                :style="{ background: getCategoryColor(budget.category) }"
              ></div>
              <span class="font-medium text-gray-800 dark:text-white">{{
                budget.category
              }}</span>
            </div>
            <span
              class="text-xs px-2 py-0.5 rounded"
              :class="{
                'bg-emerald-100 text-emerald-700': budget.type === 'monthly',
                'bg-amber-100 text-amber-700': budget.type === 'yearly',
                'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200':
                  budget.type === 'bi-monthly',
              }"
            >
              {{ formatType(budget.type) }}
            </span>
          </div>
          <span class="mobile-card-amount text-amber-600"
            >₱{{ formatNumber(budget.amount) }}</span
          >
        </div>
        <div class="mobile-card-details mt-2">
          <span>{{ getPeriodLabel(budget) }}</span>
          <div class="ml-auto flex gap-2">
            <button
              @click="editBudget(budget)"
              class="p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                ></path>
              </svg>
            </button>
            <button
              @click="confirmDelete(budget)"
              class="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-gray-400 dark:text-gray-500 hover:text-rose-600 dark:hover:text-rose-400"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div v-if="budgets.length === 0" class="empty-state py-12">
        <div
          class="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mb-4"
        >
          <svg
            class="w-8 h-8 text-amber-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            ></path>
          </svg>
        </div>
        <p class="empty-state-title">No budgets found</p>
        <p class="empty-state-description">
          Create a budget to manage your spending
        </p>
      </div>
    </div>

    <!-- Desktop Empty State -->
    <div
      v-if="budgets.length === 0"
      class="card hidden md:block empty-state py-16"
    >
      <div
        class="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mb-4"
      >
        <svg
          class="w-10 h-10 text-amber-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          ></path>
        </svg>
      </div>
      <p class="empty-state-title">No budgets set</p>
      <p class="empty-state-description">
        Create budgets to track your spending limits
      </p>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="modalVisible" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content animate-scale-in">
          <div class="modal-header">
            <div class="flex items-center gap-4">
              <div
                class="modal-icon bg-gradient-to-br from-amber-400 to-orange-500 text-white"
              >
                <svg
                  v-if="!editingId"
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
                <svg
                  v-else
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-800 dark:text-white">
                  {{ editingId ? "Edit Budget" : "Add New Budget" }}
                </h3>
              </div>
              <button
                @click="closeModal"
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="modal-body space-y-5">
            <!-- Budget Type Selection -->
            <div>
              <label class="label">Budget Type</label>
              <div class="flex gap-2">
                <button
                  v-for="t in budgetTypes"
                  :key="t.value"
                  type="button"
                  @click="form.type = t.value"
                  class="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all border"
                  :class="
                    form.type === t.value
                      ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-400 text-amber-700 dark:text-amber-300'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  "
                >
                  {{ t.label }}
                </button>
              </div>
            </div>

            <div>
              <label class="label">Category</label>
              <select
                v-model="form.category"
                class="input appearance-none cursor-pointer"
              >
                <option value="">Select a category</option>
                <option v-for="c in categories" :key="c" :value="c">
                  {{ c }}
                </option>
              </select>
            </div>

            <div>
              <label class="label">Budget Amount</label>
              <div class="relative">
                <span class="modal-input-icon">
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
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
                <select
                  v-model="form.year"
                  class="input appearance-none cursor-pointer"
                >
                  <option v-for="y in years" :key="y" :value="y">
                    {{ y }}
                  </option>
                </select>
                <div
                  class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                >
                  <svg
                    class="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Monthly Selection -->
            <div v-if="form.type === 'monthly'">
              <label class="label">Month(s)</label>
              <div class="relative">
                <select
                  v-model="form.months"
                  multiple
                  class="input h-40 appearance-none cursor-pointer"
                >
                  <option v-for="m in months" :key="m" :value="m">
                    {{ m }}
                  </option>
                </select>
                <div
                  class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                >
                  <svg
                    class="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Hold Ctrl/Cmd to select multiple months
              </p>
            </div>

            <!-- Bi-Monthly Selection (Quincena) -->
            <div v-if="form.type === 'bi-monthly'">
              <label class="label">Month(s)</label>
              <div class="relative mb-4">
                <select
                  v-model="form.months"
                  multiple
                  class="input h-32 appearance-none cursor-pointer"
                >
                  <option v-for="m in months" :key="m" :value="m">
                    {{ m }}
                  </option>
                </select>
                <div
                  class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                >
                  <svg
                    class="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>

              <label class="label">Budget Period (Quincena)</label>
              <div class="relative">
                <select
                  v-model="form.halfMonths"
                  multiple
                  class="input h-24 appearance-none cursor-pointer"
                >
                  <option :value="1">1st Half (Days 1-15)</option>
                  <option :value="2">2nd Half (Days 16-31)</option>
                </select>
                <div
                  class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                >
                  <svg
                    class="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Set budget limits for each half of the month
              </p>
            </div>
          </form>

          <div class="modal-footer">
            <button @click="closeModal" class="btn btn-secondary">
              Cancel
            </button>
            <button
              @click="handleSubmit"
              :disabled="submitting"
              class="btn btn-primary shadow-lg shadow-amber-500/30"
            >
              <svg
                v-if="submitting"
                class="animate-spin w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span v-else>{{
                editingId ? "Update Budget" : "Add Budget"
              }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted } from "vue";
import { toast } from "../components/Toast.vue";
import { confirm } from "../components/ConfirmModal.vue";
import dayjs from "dayjs";
import axios from "axios";
import type { Budget, BudgetInput, BudgetType, HalfMonth } from "../types";

const API_URL = "http://localhost:3001/api";

const CATEGORIES = [
  "Food",
  "Transportation",
  "Housing",
  "Utilities",
  "Healthcare",
  "Entertainment",
  "Shopping",
  "Education",
  "Personal",
  "Other",
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const BUDGET_TYPES: { value: BudgetType; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "bi-monthly", label: "Bi-Monthly (Quincena)" },
];

export default defineComponent({
  name: "BudgetsView",
  setup() {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

    const loading = ref(false);
    const submitting = ref(false);
    const modalVisible = ref(false);
    const editingId = ref<number | null>(null);
    const budgets = ref<Budget[]>([]);
    const categories = ref(CATEGORIES);
    const months = ref(MONTHS);
    const budgetTypes = ref(BUDGET_TYPES);

    const filters = reactive({
      type: "" as string,
      year: currentYear,
      month: "",
      halfMonth: "" as string,
    });

    const form = reactive<BudgetInput>({
      category: "",
      amount: 0,
      type: "monthly",
      year: currentYear,
      months: [],
      halfMonths: [],
    });

    const monthOptions = computed(() =>
      months.value.map((m) => ({ value: m, label: m })),
    );
    const halfMonthOptions = [
      { value: 1, label: "1st Half (Days 1-15)" },
      { value: 2, label: "2nd Half (Days 16-31)" },
    ];
    const categoryOptions = computed(() =>
      categories.value.map((c) => ({ value: c, label: c })),
    );

    const formatNumber = (num: number): string => {
      return num.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    const getCategoryColor = (category: string): string => {
      const colors: Record<string, string> = {
        Food: "#10b981",
        Transportation: "#6366f1",
        Housing: "#f59e0b",
        Utilities: "#8b5cf6",
        Healthcare: "#ec4899",
        Entertainment: "#06b6d4",
        Shopping: "#ef4444",
        Education: "#84cc16",
        Personal: "#14b8a6",
        Other: "#64748b",
      };
      return colors[category] || "#6366f1";
    };

    const formatDate = (date: string): string => {
      return dayjs(date).format("MMMM DD, YYYY hh:mm A");
    };

    const formatType = (type: string): string => {
      const labels: Record<string, string> = {
        monthly: "Monthly",
        yearly: "Yearly",
        "bi-monthly": "Bi-Monthly",
      };
      return labels[type] || type;
    };

    const getPeriodLabel = (budget: Budget | BudgetInput): string => {
      if (budget.type === "yearly") {
        return `${budget.year}`;
      } else if (budget.type === "bi-monthly") {
        const period =
          ("halfMonth" in budget && budget.halfMonth === 1) ||
          ("halfMonths" in budget &&
            budget.halfMonths?.includes(1 as HalfMonth))
            ? "1st Half (1-15)"
            : "2nd Half (16-31)";
        return `${period} ${budget.year}`;
      } else {
        const month = "month" in budget ? budget.month : budget.months?.[0];
        return `${month} ${budget.year}`;
      }
    };

    const fetchBudgets = async () => {
      loading.value = true;
      try {
        const token = localStorage.getItem("token");
        const params: Record<string, string> = {};
        if (filters.type) params.type = filters.type;
        if (filters.year) params.year = String(filters.year);

        const response = await axios.get<Budget[]>(`${API_URL}/budgets`, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });

        let filtered = response.data;

        if (filters.type === "monthly" && filters.month) {
          filtered = filtered.filter((b) => b.month === filters.month);
        }

        if (filters.type === "bi-monthly" && filters.month) {
          filtered = filtered.filter((b) => b.month === filters.month);
        }

        if (filters.type === "bi-monthly" && filters.halfMonth) {
          filtered = filtered.filter(
            (b) => b.halfMonth === parseInt(filters.halfMonth),
          );
        }

        budgets.value = filtered;
      } catch (error) {
        toast.error("Failed to fetch budgets");
      } finally {
        loading.value = false;
      }
    };

    const showModal = () => {
      editingId.value = null;
      Object.assign(form, {
        category: "",
        amount: 0,
        type: "monthly",
        year: currentYear,
        months: [],
        halfMonths: [1, 2],
      });
      modalVisible.value = true;
    };

    const editBudget = (budget: Budget) => {
      editingId.value = budget.id;
      Object.assign(form, {
        category: budget.category,
        amount: budget.amount,
        type: budget.type,
        year: budget.year,
        months: budget.month ? [budget.month] : [],
        halfMonths: budget.halfMonth ? [budget.halfMonth] : [],
      });
      modalVisible.value = true;
    };

    const closeModal = () => {
      modalVisible.value = false;
      editingId.value = null;
    };

    const validateForm = (): boolean => {
      if (!form.category || !form.amount) {
        toast.error("Please fill category and amount");
        return false;
      }
      if (
        (form.type === "monthly" || form.type === "bi-monthly") &&
        form.months.length === 0
      ) {
        toast.error("Please select at least one month");
        return false;
      }
      if (form.type === "bi-monthly" && form.halfMonths.length === 0) {
        toast.error(
          "Please select at least one budget period (1st or 2nd half)",
        );
        return false;
      }
      return true;
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;

      submitting.value = true;
      try {
        const token = localStorage.getItem("token");

        const payload = {
          category: form.category,
          amount: form.amount,
          type: form.type,
          year: form.year,
          months:
            form.type === "monthly" || form.type === "bi-monthly"
              ? form.months
              : [],
          halfMonths: form.type === "bi-monthly" ? form.halfMonths : [],
        };

        if (editingId.value) {
          await axios.put(`${API_URL}/budgets/${editingId.value}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          });
          toast.success("Budget updated successfully");
        } else {
          await axios.post(`${API_URL}/budgets`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          });
          toast.success("Budget added successfully");
        }

        closeModal();
        await fetchBudgets();
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Failed to save budget");
      } finally {
        submitting.value = false;
      }
    };

    const confirmDelete = async (budget: Budget) => {
      const periodLabel = getPeriodLabel(budget);
      const ok = await confirm({
        title: "Delete Budget",
        content: `Are you sure you want to delete the ${budget.category} budget for ${periodLabel}?`,
        type: "danger",
        confirmText: "Delete",
        cancelText: "Cancel",
      });

      if (ok) {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`${API_URL}/budgets/${budget.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          toast.success("Budget deleted automatically");
          await fetchBudgets();
        } catch (error) {
          toast.error("Failed to delete budget");
        }
      }
    };

    onMounted(() => {
      fetchBudgets();
    });

    return {
      loading,
      submitting,
      modalVisible,
      editingId,
      budgets,
      categories,
      months,
      budgetTypes,
      years,
      filters,
      form,
      monthOptions,
      halfMonthOptions,
      categoryOptions,
      formatNumber,
      formatDate,
      formatType,
      getCategoryColor,
      getPeriodLabel,
      fetchBudgets,
      showModal,
      editBudget,
      closeModal,
      handleSubmit,
      confirmDelete,
    };
  },
});
</script>
