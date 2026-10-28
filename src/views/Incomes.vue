<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <PageHeader title="Income" subtitle="Track your salary and income by period">
      <template #actions>
        <button @click="showModal()" class="btn btn-primary">
          <component :is="PlusIcon" class="w-4 h-4" />
          Add Income
        </button>
      </template>
    </PageHeader>

    <!-- Filters -->
    <div class="card p-4 mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <select
          v-if="
            filters.type === 'monthly' ||
            !filters.type ||
            filters.type === 'bi-monthly'
          "
          v-model="filters.month"
          @change="fetchIncomes"
          class="input"
        >
          <option value="">All Months</option>
          <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
        </select>
        <select
          v-if="filters.type === 'bi-monthly'"
          v-model="filters.halfMonth"
          @change="fetchIncomes"
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
              <th>Amount</th>
              <th>Period</th>
              <th>Category</th>
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
                    'badge-neutral': income.type === 'bi-monthly',
                  }"
                >
                  {{ formatType(income.type) }}
                </span>
              </td>
              <td>
                <span class="font-semibold text-income financial-amount"
                  >+₱{{ formatNumber(income.amount) }}</span
                >
              </td>
              <td class="text-ink-secondary">
                {{ getPeriodLabel(income) }}
              </td>
              <td class="text-ink-secondary">
                <template v-if="income.category || income.note">
                  <span v-if="income.category" class="font-medium text-ink-secondary">{{ income.category }}</span>
                  <p v-if="income.note" class="text-xs text-ink-muted truncate max-w-[180px]" :title="income.note">
                    {{ income.note }}
                  </p>
                </template>
                <template v-else>—</template>
              </td>
              <td class="text-ink-secondary">
                {{ income.createdAt ? formatDate(income.createdAt) : "-" }}
              </td>
              <td class="text-ink-secondary">
                {{ income.updatedAt ? formatDate(income.updatedAt) : "-" }}
              </td>
              <td>
                <button
                  @click="editIncome(income)"
                  class="p-2 rounded-lg hover:bg-[var(--accent-50)] text-ink-muted hover:text-[var(--accent-color)] transition-all"
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
                  @click="confirmDelete(income)"
                  class="p-2 rounded-lg hover:bg-[var(--expense-soft)] text-ink-muted hover:text-[var(--expense)] transition-all"
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
      <div v-for="income in incomes" :key="income.id" class="mobile-card">
        <div class="mobile-card-header">
          <div>
            <span
              class="badge"
              :class="{
                'badge-success': income.type === 'monthly',
                'badge-warning': income.type === 'yearly',
                'badge-neutral': income.type === 'bi-monthly',
              }"
            >
              {{ formatType(income.type) }}
            </span>
            <p class="text-sm text-ink-secondary mt-1">
              {{ getPeriodLabel(income) }}
            </p>
            <p
              v-if="income.category || income.note"
              class="text-xs text-ink-muted mt-1 truncate max-w-[200px]"
            >
              <span v-if="income.category">{{ income.category }}</span>
              <span v-if="income.category && income.note"> · </span>
              <span v-if="income.note">{{ income.note }}</span>
            </p>
            <div class="flex gap-2 mt-2">
              <button
                @click="editIncome(income)"
                class="p-2 rounded-lg hover:bg-[var(--accent-50)] text-ink-muted hover:text-[var(--accent-color)]"
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
                @click="confirmDelete(income)"
                class="p-2 rounded-lg hover:bg-[var(--expense-soft)] text-ink-muted hover:text-[var(--expense)]"
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
      </div>

      <EmptyState
        v-if="incomes.length === 0"
        :icon="WalletIcon"
        title="No incomes found"
        description="Start tracking your income by adding one."
        action-label="Add Income"
        @action="showModal()"
      />
    </div>

    <!-- Desktop Empty State -->
    <div v-if="incomes.length === 0" class="card hidden md:block">
      <EmptyState
        :icon="WalletIcon"
        title="No income recorded"
        description="Start adding your salary and income sources."
        action-label="Add Income"
        @action="showModal()"
      />
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="modalVisible" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content animate-scale-in">
          <div class="modal-header">
            <div class="flex items-center gap-4 w-full">
              <div
                class="modal-icon bg-income-light text-income"
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
              <div class="flex-1">
                <h3 class="text-lg font-semibold" style="color: var(--text-primary)">
                  {{ editingId ? "Edit Income" : "Add New Income" }}
                </h3>
              </div>
              <button
                @click="closeModal"
                class="ml-auto flex-shrink-0 p-2 rounded-lg hover:bg-[var(--surface-elevated)] text-ink-muted"
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
                  :class="
                    form.type === t.value
                      ? 'bg-[var(--accent-50)] border-[var(--accent-color)] text-[var(--accent-color)]'
                      : 'border-line text-ink-secondary hover:border-line-strong'
                  "
                >
                  {{ t.label }}
                </button>
              </div>
            </div>

            <div>
              <label class="label">Amount</label>
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

            <!-- Account Selection (optional) -->
            <div>
              <label class="label">Account (Optional)</label>
              <select
                v-model="form.accountId"
                class="input appearance-none cursor-pointer"
              >
                <option :value="null">No account</option>
                <option v-for="acc in accounts" :key="acc.id" :value="acc.id">
                  {{ acc.name }}
                </option>
              </select>
            </div>

            <!-- Category (optional) -->
            <div>
              <label class="label">Category (Optional)</label>
              <input
                v-model="form.category"
                type="text"
                class="input"
                placeholder="Salary, Business, Gift..."
              />
            </div>

            <!-- Note (optional) -->
            <div>
              <label class="label">Note (Optional)</label>
              <textarea
                v-model="form.note"
                class="input"
                rows="2"
                placeholder="e.g. 13th month pay"
              ></textarea>
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
                    class="w-5 h-5 text-ink-muted"
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
              <div class="flex items-center justify-between mb-2">
                <label class="label !mb-0">Month(s)</label>
                <div class="flex gap-3">
                  <button
                    v-if="form.months.length === months.length"
                    type="button"
                    @click="deselectAllMonths"
                    class="text-xs font-medium text-ink-secondary hover:underline"
                  >
                    Deselect all
                  </button>
                  <button
                    v-else
                    type="button"
                    @click="selectAllMonths"
                    class="text-xs font-medium hover:underline" style="color: var(--accent-color)"
                  >
                    Select all
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <label
                  v-for="m in months"
                  :key="m"
                  class="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] cursor-pointer hover:border-[var(--border-strong)]"
                >
                  <input
                    type="checkbox"
                    :value="m"
                    v-model="form.months"
                    class="w-4 h-4 rounded accent-emerald-600"
                  />
                  <span
                    class="text-sm text-ink-secondary"
                    >{{ m }}</span
                  >
                </label>
              </div>
            </div>

            <!-- Bi-Monthly Selection (Quincena) -->
            <div v-if="form.type === 'bi-monthly'">
              <div class="flex items-center justify-between mb-2">
                <label class="label !mb-0">Month(s)</label>
                <div class="flex gap-3">
                  <button
                    v-if="form.months.length === months.length"
                    type="button"
                    @click="deselectAllMonths"
                    class="text-xs font-medium text-ink-secondary hover:underline"
                  >
                    Deselect all
                  </button>
                  <button
                    v-else
                    type="button"
                    @click="selectAllMonths"
                    class="text-xs font-medium hover:underline" style="color: var(--accent-color)"
                  >
                    Select all
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                <label
                  v-for="m in months"
                  :key="m"
                  class="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] cursor-pointer hover:border-[var(--border-strong)]"
                >
                  <input
                    type="checkbox"
                    :value="m"
                    v-model="form.months"
                    class="w-4 h-4 rounded accent-emerald-600"
                  />
                  <span
                    class="text-sm text-ink-secondary"
                    >{{ m }}</span
                  >
                </label>
              </div>

              <div class="flex items-center justify-between mb-2">
                <label class="label !mb-0">Pay Period (Quincena)</label>
                <div class="flex gap-3">
                  <button
                    v-if="form.halfMonths.length === 2"
                    type="button"
                    @click="deselectAllHalfMonths"
                    class="text-xs font-medium text-ink-secondary hover:underline"
                  >
                    Deselect all
                  </button>
                  <button
                    v-else
                    type="button"
                    @click="selectAllHalfMonths"
                    class="text-xs font-medium hover:underline" style="color: var(--accent-color)"
                  >
                    Select all
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label
                  class="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] cursor-pointer hover:border-[var(--border-strong)]"
                >
                  <input
                    type="checkbox"
                    :value="1"
                    v-model="form.halfMonths"
                    class="w-4 h-4 rounded accent-emerald-600"
                  />
                  <span class="text-sm text-ink-secondary"
                    >1st Half (Days 1-15)</span
                  >
                </label>
                <label
                  class="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] cursor-pointer hover:border-[var(--border-strong)]"
                >
                  <input
                    type="checkbox"
                    :value="2"
                    v-model="form.halfMonths"
                    class="w-4 h-4 rounded accent-emerald-600"
                  />
                  <span class="text-sm text-ink-secondary"
                    >2nd Half (Days 16-31)</span
                  >
                </label>
              </div>
              <p class="text-xs text-ink-secondary mt-1">
                In the Philippines, salaries are often paid in two installments:
                1st half (1-15) and 2nd half (16-31)
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
              class="btn btn-primary shadow-lg shadow-emerald-500/30"
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
                editingId ? "Update Income" : "Add Income"
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
import type { Income, IncomeInput, IncomeType, HalfMonth } from "../types";
import PageHeader from "../components/PageHeader.vue";
import EmptyState from "../components/EmptyState.vue";
import { PlusIcon, WalletIcon } from "../components/icons";

const API_URL = "http://localhost:3001/api";

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

const INCOME_TYPES = [
  { value: "monthly" as IncomeType, label: "Monthly" },
  { value: "yearly" as IncomeType, label: "Yearly" },
  { value: "bi-monthly" as IncomeType, label: "Bi-Monthly (Quincena)" },
];

export default defineComponent({
  name: "IncomesView",
  components: { PageHeader, EmptyState },
  setup() {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

    const loading = ref(false);
    const submitting = ref(false);
    const modalVisible = ref(false);
    const editingId = ref<number | null>(null);
    const incomes = ref<Income[]>([]);
    const months = ref(MONTHS);
    const accounts = ref<{ id: number; name: string }[]>([]);
    const incomeTypes = ref(
      INCOME_TYPES as { value: IncomeType; label: string }[],
    );

    const filters = reactive({
      type: "" as string,
      year: currentYear,
      month: "",
      halfMonth: "" as string,
    });

    const form = reactive<IncomeInput>({
      amount: 0,
      type: "monthly",
      year: currentYear,
      months: [],
      halfMonths: [],
      accountId: null,
      category: "",
      note: "",
    });

    const monthOptions = computed(() =>
      months.value.map((m) => ({ value: m, label: m })),
    );
    const halfMonthOptions = [
      { value: 1, label: "1st Half (Days 1-15)" },
      { value: 2, label: "2nd Half (Days 16-31)" },
    ];

    const formatNumber = (num: number): string => {
      return num.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
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

    const getPeriodLabel = (income: Income | IncomeInput): string => {
      if (income.type === "yearly") {
        return `${income.year}`;
      } else if (income.type === "bi-monthly") {
        const period =
          ("halfMonth" in income && income.halfMonth === 1) ||
          ("halfMonths" in income &&
            income.halfMonths?.includes(1 as HalfMonth))
            ? "1st Half (1-15)"
            : "2nd Half (16-31)";
        return `${period} ${income.year}`;
      } else {
        const month = "month" in income ? income.month : income.months?.[0];
        return `${month} ${income.year}`;
      }
    };

    const fetchIncomes = async () => {
      loading.value = true;
      try {
        const token = localStorage.getItem("token");
        const params: Record<string, string> = {};
        if (filters.type) params.type = filters.type;
        if (filters.year) params.year = String(filters.year);

        const response = await axios.get<Income[]>(`${API_URL}/incomes`, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });

        let filtered = response.data;

        if (filters.type === "monthly" && filters.month) {
          filtered = filtered.filter((i) => i.month === filters.month);
        }

        if (filters.type === "bi-monthly" && filters.month) {
          filtered = filtered.filter((i) => i.month === filters.month);
        }

        if (filters.type === "bi-monthly" && filters.halfMonth) {
          filtered = filtered.filter(
            (i) => i.halfMonth === parseInt(filters.halfMonth),
          );
        }

        incomes.value = filtered;
      } catch (error) {
        toast.error("Failed to fetch incomes");
      } finally {
        loading.value = false;
      }
    };

    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<{ id: number; name: string }[]>(
          `${API_URL}/accounts`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        accounts.value = response.data;
      } catch {
        // Account linking is optional; leave the dropdown empty on failure.
      }
    };

    const showModal = () => {
      editingId.value = null;
      Object.assign(form, {
        amount: 0,
        type: "monthly",
        year: currentYear,
        months: [],
        halfMonths: [1, 2],
        accountId: null,
        category: "",
        note: "",
      });
      modalVisible.value = true;
    };

    const editIncome = (income: Income) => {
      editingId.value = income.id;
      Object.assign(form, {
        amount: income.amount,
        type: income.type,
        year: income.year,
        months: income.month ? [income.month] : [],
        halfMonths: income.halfMonth ? [income.halfMonth] : [],
        accountId: income.accountId ?? null,
        category: income.category || "",
        note: income.note || "",
      });
      modalVisible.value = true;
    };

    const closeModal = () => {
      modalVisible.value = false;
      editingId.value = null;
    };

    const validateForm = (): boolean => {
      if (!form.amount) {
        toast.error("Please enter an amount");
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
        toast.error("Please select at least one pay period (1st or 2nd half)");
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
          amount: form.amount,
          type: form.type,
          year: form.year,
          months:
            form.type === "monthly" || form.type === "bi-monthly"
              ? form.months
              : [],
          halfMonths: form.type === "bi-monthly" ? form.halfMonths : [],
          accountId: form.accountId || null,
          category: form.category || null,
          note: form.note || null,
        };

        if (editingId.value) {
          await axios.put(`${API_URL}/incomes/${editingId.value}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          });
          toast.success("Income updated successfully");
        } else {
          await axios.post(`${API_URL}/incomes`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          });
          toast.success("Income added successfully");
        }

        closeModal();
        await fetchIncomes();
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Failed to save income");
      } finally {
        submitting.value = false;
      }
    };

    const confirmDelete = async (income: Income) => {
      const periodLabel = getPeriodLabel(income);
      const ok = await confirm({
        title: "Delete Income",
        content: `Are you sure you want to delete the income for ${periodLabel}?`,
        type: "danger",
        confirmText: "Delete",
        cancelText: "Cancel",
      });

      if (ok) {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`${API_URL}/incomes/${income.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          toast.success("Income deleted successfully");
          await fetchIncomes();
        } catch (error) {
          toast.error("Failed to delete income");
        }
      }
    };

    const selectAllMonths = () => {
      form.months = [...months.value];
    };

    const deselectAllMonths = () => {
      form.months = [];
    };

    const selectAllHalfMonths = () => {
      form.halfMonths = [1, 2];
    };

    const deselectAllHalfMonths = () => {
      form.halfMonths = [];
    };

    onMounted(() => {
      fetchIncomes();
      fetchAccounts();
    });

    return {
      loading,
      submitting,
      modalVisible,
      editingId,
      incomes,
      months,
      accounts,
      incomeTypes,
      years,
      filters,
      form,
      monthOptions,
      halfMonthOptions,
      selectAllMonths,
      deselectAllMonths,
      selectAllHalfMonths,
      deselectAllHalfMonths,
      formatNumber,
      formatDate,
      formatType,
      getPeriodLabel,
      fetchIncomes,
      showModal,
      editIncome,
      closeModal,
      handleSubmit,
      confirmDelete,
      PlusIcon,
      WalletIcon,
    };
  },
});
</script>
