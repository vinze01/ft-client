<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <PageHeader title="Expenses" subtitle="Track and manage your daily expenses">
      <template #actions>
        <button @click="showModal()" class="btn btn-primary">
          <component :is="PlusIcon" class="w-4 h-4" />
          Add Expense
        </button>
      </template>
    </PageHeader>

    <!-- Filters -->
    <div class="card p-4 mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="relative">
          <div
            class="absolute inset-y-0 left-3 flex items-center pointer-events-none"
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            v-model="filters.search"
            @input="debouncedSearch"
            type="text"
            class="input pl-10"
            placeholder="Search description..."
          />
        </div>
        <select
          v-model="filters.category"
          @change="fetchExpenses"
          class="input"
        >
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
        <input
          v-model="filters.month"
          type="month"
          @change="fetchExpenses"
          class="input"
        />
      </div>
    </div>

    <!-- Desktop Table -->
    <div class="card overflow-hidden hidden md:block">
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
              <th>Created</th>
              <th>Updated</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="expense in expenses" :key="expense.id">
              <td>
                <span class="font-medium text-ink">{{
                  expense.description
                }}</span>
                <p
                  v-if="expense.note"
                  class="text-xs text-ink-muted truncate max-w-[200px]"
                  :title="expense.note"
                >
                  {{ expense.note }}
                </p>
              </td>
              <td>
                <span class="font-semibold text-expense financial-amount"
                  >-₱{{ formatNumber(expense.amount) }}</span
                >
              </td>
              <td>
                <span
                  class="badge"
                  :style="{
                    background: getCategoryColor(expense.category) + '20',
                    color: getCategoryColor(expense.category),
                  }"
                >
                  {{ expense.category }}
                </span>
              </td>
              <td class="text-ink-secondary">
                {{ formatDate(expense.date) }}
              </td>
              <td class="text-ink-secondary">
                {{ expense.createdAt ? formatDate(expense.createdAt) : "-" }}
              </td>
              <td class="text-ink-secondary">
                {{ expense.updatedAt ? formatDate(expense.updatedAt) : "-" }}
              </td>
              <td>
                <button
                  @click="editExpense(expense)"
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
                  @click="confirmDelete(expense)"
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
    <div v-for="expense in expenses" :key="expense.id" class="mobile-card">
      <div class="mobile-card-header">
        <div class="min-w-0">
          <p class="font-medium text-ink truncate">
            {{ expense.description }}
          </p>
          <p class="text-sm text-ink-secondary mt-1">
            {{ formatDate(expense.date) }}
          </p>
          <p
            v-if="expense.note"
            class="text-xs text-ink-muted mt-1 truncate max-w-[200px]"
          >
            {{ expense.note }}
          </p>
          <div class="flex gap-2 mt-2">
            <button
              @click="editExpense(expense)"
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
              @click="confirmDelete(expense)"
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

      <!-- Empty State -->
      <EmptyState
        v-if="expenses.length === 0"
        :icon="WalletIcon"
        title="No expenses found"
        description="Start tracking your expenses by adding one."
        action-label="Add Expense"
        @action="showModal()"
      />
    </div>

    <!-- Desktop Empty State -->
    <div v-if="expenses.length === 0" class="card hidden md:block">
      <EmptyState
        :icon="WalletIcon"
        title="No expenses found"
        description="Start tracking your expenses by adding one."
        action-label="Add Expense"
        @action="showModal()"
      />
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="modalVisible" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content animate-scale-in">
          <!-- Modal Header with Icon -->
          <div class="modal-header">
            <div class="flex items-center gap-4 w-full">
              <div
                class="modal-icon bg-expense-light text-expense"
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
                  {{ editingId ? "Edit Expense" : "Add New Expense" }}
                </h3>
                <p class="text-sm text-ink-secondary">
                  {{
                    editingId
                      ? "Update the expense details below"
                      : "Fill in the details to add a new expense"
                  }}
                </p>
              </div>
              <button
                @click="closeModal"
                class="ml-auto flex-shrink-0 p-2 rounded-xl hover:bg-[var(--surface-elevated)] transition-colors text-ink-muted"
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

          <!-- Modal Body -->
          <form @submit.prevent="handleSubmit" class="modal-body space-y-5">
            <div>
              <label class="label">Description</label>
              <input
                v-model="form.description"
                type="text"
                class="input"
                placeholder="What did you spend on?"
              />
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
              <label class="label">Date</label>
              <div class="relative">
                <input v-model="form.date" type="date" class="input" />
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

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

            <div>
              <label class="label">Note (Optional)</label>
              <textarea
                v-model="form.note"
                class="input"
                rows="2"
                placeholder="e.g. paid with GCash"
              ></textarea>
            </div>
          </form>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <button @click="closeModal" class="btn btn-secondary">
              Cancel
            </button>
            <button
              @click="handleSubmit"
              :disabled="submitting"
              class="btn btn-primary"
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
                editingId ? "Update Expense" : "Add Expense"
              }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted } from "vue";
import { toast } from "../components/Toast.vue";
import { confirm } from "../components/ConfirmModal.vue";
import dayjs from "dayjs";
import axios from "axios";
import type { Expense, ExpenseInput } from "../types";
import PageHeader from "../components/PageHeader.vue";
import EmptyState from "../components/EmptyState.vue";
import { PlusIcon, WalletIcon } from "../components/icons";

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

export default defineComponent({
  name: "ExpensesView",
  components: { PageHeader, EmptyState },
  setup() {
    const loading = ref(false);
    const submitting = ref(false);
    const modalVisible = ref(false);
    const editingId = ref<number | null>(null);
    const expenses = ref<Expense[]>([]);
    const categories = ref(CATEGORIES);
    const searchTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

    const filters = reactive({
      search: "",
      category: "",
      month: "",
    });

    const form = reactive<ExpenseInput>({
      description: "",
      amount: 0,
      category: "",
      date: "",
      accountId: null,
      note: "",
    });

    const accounts = ref<{ id: number; name: string }[]>([]);

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

    const categoryOptions = computed(() =>
      categories.value.map((c) => ({ value: c, label: c })),
    );

    const formatNumber = (num: number): string => {
      return num.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    const formatDate = (date: string): string => {
      return dayjs(date).format("MMMM DD, YYYY hh:mm A");
    };

    const getCategoryColor = (category: string): string => {
      const colors: Record<string, string> = {
        Food: "#10b981",
        Transportation: "#0ea5e9",
        Housing: "#f59e0b",
        Utilities: "#8b5cf6",
        Healthcare: "#ec4899",
        Entertainment: "#06b6d4",
        Shopping: "#ef4444",
        Education: "#84cc16",
        Personal: "#14b8a6",
        Other: "#64748b",
      };
      return colors[category] || "#64748b";
    };

    const fetchExpenses = async () => {
      loading.value = true;
      try {
        const token = localStorage.getItem("token");
        const params: Record<string, string> = {};
        if (filters.month) params.month = filters.month;
        if (filters.category) params.category = filters.category;

        const response = await axios.get<Expense[]>(`${API_URL}/expenses`, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });
        expenses.value = response.data;
      } catch (error) {
        toast.error("Failed to fetch expenses");
      } finally {
        loading.value = false;
      }
    };

    const debouncedSearch = () => {
      if (searchTimeout.value) clearTimeout(searchTimeout.value);
      searchTimeout.value = setTimeout(() => {
        fetchExpenses();
      }, 300);
    };

    const showModal = () => {
      editingId.value = null;
      Object.assign(form, {
        description: "",
        amount: 0,
        category: "",
        date: "",
        accountId: null,
        note: "",
      });
      modalVisible.value = true;
    };

    const editExpense = (expense: Expense) => {
      editingId.value = expense.id;
      Object.assign(form, {
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        accountId: expense.accountId ?? null,
        note: expense.note || "",
      });
      modalVisible.value = true;
    };

    const closeModal = () => {
      modalVisible.value = false;
      editingId.value = null;
    };

    const handleSubmit = async () => {
      if (!form.description || !form.amount || !form.category || !form.date) {
        toast.error("Please fill all required fields");
        return;
      }

      submitting.value = true;
      try {
        const token = localStorage.getItem("token");

        if (editingId.value) {
          await axios.put(`${API_URL}/expenses/${editingId.value}`, form, {
            headers: { Authorization: `Bearer ${token}` },
          });
          toast.success("Expense updated successfully");
        } else {
          await axios.post(`${API_URL}/expenses`, form, {
            headers: { Authorization: `Bearer ${token}` },
          });
          toast.success("Expense added successfully");
        }

        closeModal();
        await fetchExpenses();
      } catch (error) {
        toast.error("Failed to save expense");
      } finally {
        submitting.value = false;
      }
    };

    const confirmDelete = async (expense: Expense) => {
      const ok = await confirm({
        title: "Delete Expense",
        content: `Are you sure you want to delete "${expense.description}"?`,
        type: "danger",
        confirmText: "Delete",
        cancelText: "Cancel",
      });

      if (ok) {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`${API_URL}/expenses/${expense.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          toast.success("Expense deleted successfully");
          await fetchExpenses();
        } catch (error) {
          toast.error("Failed to delete expense");
        }
      }
    };

    onMounted(() => {
      fetchExpenses();
      fetchAccounts();
    });

    return {
      loading,
      submitting,
      modalVisible,
      editingId,
      expenses,
      categories,
      accounts,
      filters,
      form,
      categoryOptions,
      formatNumber,
      formatDate,
      getCategoryColor,
      fetchExpenses,
      debouncedSearch,
      showModal,
      editExpense,
      closeModal,
      handleSubmit,
      confirmDelete,
      PlusIcon,
      WalletIcon,
    };
  },
});
</script>
