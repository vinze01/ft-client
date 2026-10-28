<template>
  <div class="animate-fade-in">
    <PageHeader title="Bills & Subscriptions" subtitle="Track your recurring payments">
      <template #actions>
        <button @click="showAddModal = true" class="btn btn-primary">
          <component :is="PlusIcon" class="w-4 h-4" />
          Add Bill
        </button>
      </template>
    </PageHeader>

    <div v-if="dueSoon.length > 0" class="card p-4 mb-6" style="border-left: 3px solid var(--warning)">
      <h3 class="font-semibold mb-2" style="color: var(--warning)">Due Soon</h3>
      <div class="space-y-2">
        <div v-for="bill in dueSoon" :key="bill.id" class="flex items-center justify-between">
          <span style="color: var(--text-primary)">{{ bill.name }}</span>
          <span class="font-semibold financial-amount">{{ formatCurrency(bill.amount) }}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div
        v-for="bill in bills"
        :key="bill.id"
        class="card p-4"
        :class="{ 'opacity-60': bill.isPaid }"
      >
        <div class="flex items-start justify-between mb-3">
          <div>
            <h3 class="font-semibold" style="color: var(--text-primary)">{{ bill.name }}</h3>
            <p class="text-sm" style="color: var(--text-secondary)">
              Due: {{ formatDate(bill.nextDueDate) }}
            </p>
          </div>
          <span
            class="badge"
            :class="bill.isSubscription ? 'badge-warning' : 'badge-neutral'"
          >
            {{ bill.isSubscription ? 'Subscription' : 'Bill' }}
          </span>
        </div>

        <p class="text-xl font-semibold financial-amount mb-3" style="color: var(--text-primary)">
          {{ formatCurrency(bill.amount) }}
        </p>

        <div class="flex gap-2">
          <button
            v-if="!bill.isPaid"
            @click="markPaid(bill.id)"
            class="btn btn-primary flex-1 text-sm"
          >
            Mark Paid
          </button>
          <button
            v-else
            @click="markUnpaid(bill.id)"
            class="btn btn-secondary flex-1 text-sm"
          >
            Undo
          </button>
          <button @click="editBill(bill)" class="btn btn-ghost">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a3.5 3.5 0 11-4.95 4.95l-4.95 4.95a3.5 3.5 0 014.95 4.95l5.657 5.657a3.5 3.5 0 01-4.95 4.95l-5.657-5.657a3.5 3.5 0 00-4.95 0"></path>
            </svg>
          </button>
          <button @click="deleteBill(bill.id)" class="btn btn-ghost" style="color: var(--expense)" title="Delete bill" aria-label="Delete bill">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1H6a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <EmptyState
      v-if="bills.length === 0"
      :icon="ReceiptIcon"
      title="No bills yet"
      description="Add your bills and subscriptions to track due dates."
      action-label="Add Bill"
      @action="showAddModal = true"
    />

    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal-content animate-scale-in" role="dialog" aria-modal="true">
        <div class="modal-header">
          <h3 class="section-title">{{ editMode ? 'Edit' : 'Add' }} Bill</h3>
          <button @click="closeModal" class="p-1.5 rounded-lg hover:bg-[var(--surface-elevated)]" style="color: var(--text-muted)" aria-label="Close">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="modal-body">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="label">Bill Name</label>
            <input v-model="form.name" type="text" class="input" placeholder="Netflix" required />
          </div>

          <div>
            <label class="label">Amount</label>
            <input v-model.number="form.amount" type="number" step="0.01" class="input" placeholder="9.99" required />
          </div>

          <div>
            <label class="label">Due Day</label>
            <input v-model.number="form.dueDay" type="number" min="1" max="31" class="input" required />
          </div>

          <div>
            <label class="label">Frequency</label>
            <select v-model="form.frequency" class="input">
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="one_time">One Time</option>
            </select>
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
            <label class="label">Remind Me (Days Before Due)</label>
            <input
              v-model.number="form.reminderDays"
              type="number"
              min="0"
              max="30"
              class="input"
            />
          </div>

          <div>
            <label class="label">Notes (Optional)</label>
            <textarea
              v-model="form.notes"
              class="input"
              rows="2"
              placeholder="e.g. auto-debited from bank"
            ></textarea>
          </div>

          <div class="flex items-center gap-2">
            <input v-model="form.isSubscription" type="checkbox" id="isSubscription" class="w-4 h-4" />
            <label for="isSubscription" class="text-sm" style="color: var(--text-secondary)">Is Subscription</label>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" @click="closeModal" class="btn btn-secondary flex-1">Cancel</button>
            <button type="submit" class="btn btn-primary flex-1">{{ editMode ? 'Update' : 'Create' }}</button>
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
import { useBillStore, type Bill } from '../stores/billStore';
import PageHeader from '../components/PageHeader.vue';
import EmptyState from '../components/EmptyState.vue';
import { PlusIcon, ReceiptIcon } from '../components/icons';

const API_URL = 'http://localhost:3001/api';

export default defineComponent({
  name: 'BillsView',
  components: { PageHeader, EmptyState },
  setup() {
    const billStore = useBillStore();
    const showAddModal = ref(false);
    const editMode = ref(false);
    const accounts = ref<{ id: number; name: string }[]>([]);

    const form = reactive({
      id: null as number | null,
      name: '',
      amount: 0,
      dueDay: 1,
      frequency: 'monthly' as string,
      isSubscription: false,
      accountId: null as number | null,
      reminderDays: 3,
      notes: ''
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

    const editBill = (bill: Bill) => {
      form.id = bill.id;
      form.name = bill.name;
      form.amount = bill.amount;
      form.dueDay = bill.dueDay;
      form.frequency = bill.frequency;
      form.isSubscription = bill.isSubscription;
      form.accountId = bill.accountId ?? null;
      form.reminderDays = bill.reminderDays ?? 3;
      form.notes = bill.notes || '';
      editMode.value = true;
      showAddModal.value = true;
    };

    const deleteBill = async (id: number) => {
      if (confirm('Delete this bill?')) {
        await billStore.deleteBill(id);
      }
    };

    const markPaid = async (id: number) => {
      await billStore.markPaid(id);
    };

    const markUnpaid = async (id: number) => {
      await billStore.markUnpaid(id);
    };

    const handleSubmit = async () => {
      if (editMode.value && form.id) {
        await billStore.updateBill(form.id, form);
      } else {
        await billStore.createBill(form);
      }
      closeModal();
    };

    const closeModal = () => {
      showAddModal.value = false;
      editMode.value = false;
      form.id = null;
      form.name = '';
      form.amount = 0;
      form.dueDay = 1;
      form.frequency = 'monthly';
      form.isSubscription = false;
      form.accountId = null;
      form.reminderDays = 3;
      form.notes = '';
    };

    onMounted(async () => {
      await billStore.fetchBills();
      await billStore.fetchDueSoon();
      fetchAccounts();
    });

    return {
      bills: billStore.bills,
      dueSoon: billStore.dueSoon,
      accounts,
      showAddModal,
      editMode,
      form,
      formatCurrency,
      formatDate,
      editBill,
      deleteBill,
      markPaid,
      markUnpaid,
      handleSubmit,
      closeModal,
      PlusIcon,
      ReceiptIcon
    };
  }
});
</script>