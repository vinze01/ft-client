<template>
  <div class="animate-fade-in">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-1">
          Accounts
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          Manage your financial accounts
        </p>
      </div>
      <button @click="showAddModal = true" class="btn btn-primary">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Add Account
      </button>
    </div>

    <div v-if="summary" class="card p-4 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Total Balance</p>
          <p class="text-2xl font-bold text-gray-800 dark:text-white">
            {{ formatCurrency(summary.totalBalance) }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ accounts.length }} accounts</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div
        v-for="account in accounts"
        :key="account.id"
        class="card p-4 card-hover"
      >
        <div class="flex items-start justify-between mb-3">
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold"
            :style="{ backgroundColor: account.color || themeStore.accentColor }"
          >
            {{ account.name.charAt(0).toUpperCase() }}
          </div>
          <div class="flex gap-1">
            <button @click="editAccount(account)" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a3.5 3.5 0 11-4.95 4.95l-4.95 4.95a3.5 3.5 0 014.95 4.95l5.657 5.657a3.5 3.5 0 01-4.95 4.95l-5.657-5.657a3.5 3.5 0 00-4.95 0"></path>
              </svg>
            </button>
            <button @click="deleteAccount(account.id)" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1H6a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
        <h3 class="font-semibold text-gray-800 dark:text-white mb-1">{{ account.name }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-3 capitalize">{{ account.type.replace('_', ' ') }}</p>
        <p class="text-xl font-bold" :class="account.balance >= 0 ? 'text-green-600' : 'text-red-600'">
          {{ formatCurrency(account.balance) }}
        </p>
        <p v-if="account.isDefault" class="text-xs text-brand-500 mt-2">Default</p>
      </div>
    </div>

    <div v-if="accounts.length === 0" class="empty-state">
      <div class="empty-state-icon">
        <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
        </svg>
      </div>
      <h3 class="empty-state-title">No accounts yet</h3>
      <p class="empty-state-description">Add your first account to start tracking your finances</p>
      <button @click="showAddModal = true" class="btn btn-primary mt-4">
        Add Account
      </button>
    </div>

    <div v-if="showAddModal || showTransferModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closeModals">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md animate-fade-in">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">
            {{ showEditModal ? 'Edit' : showTransferModal ? 'Transfer' : 'Add' }} Account
          </h3>
          <button @click="closeModals" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div v-if="!showTransferModal">
            <label class="label">Account Name</label>
            <input v-model="form.name" type="text" class="input" placeholder="Main Bank" required />
          </div>

          <div v-if="!showTransferModal">
            <label class="label">Type</label>
            <select v-model="form.type" class="input">
              <option value="bank">Bank Account</option>
              <option value="cash">Cash</option>
              <option value="e_wallet">E-Wallet</option>
              <option value="credit_card">Credit Card</option>
              <option value="investment">Investment</option>
            </select>
          </div>

          <div v-if="!showTransferModal">
            <label class="label">Initial Balance</label>
            <input v-model.number="form.balance" type="number" step="0.01" class="input" placeholder="0.00" />
          </div>

          <div v-if="showTransferModal">
            <label class="label">From Account</label>
            <select v-model="form.fromAccountId" class="input" required>
              <option v-for="acc in accounts" :key="acc.id" :value="acc.id">{{ acc.name }}</option>
            </select>
          </div>

          <div v-if="showTransferModal">
            <label class="label">To Account</label>
            <select v-model="form.toAccountId" class="input" required>
              <option v-for="acc in accounts" :key="acc.id" :value="acc.id">{{ acc.name }}</option>
            </select>
          </div>

          <div v-if="showTransferModal">
            <label class="label">Amount</label>
            <input v-model.number="form.amount" type="number" step="0.01" class="input" placeholder="0.00" required />
          </div>

          <div v-if="showTransferModal">
            <label class="label">Note (Optional)</label>
            <input v-model="form.note" type="text" class="input" placeholder="Transfer note" />
          </div>

          <div class="flex gap-3">
            <button type="button" @click="closeModals" class="btn btn-secondary flex-1">Cancel</button>
            <button type="submit" class="btn btn-primary flex-1">{{ showTransferModal ? 'Transfer' : (showEditModal ? 'Update' : 'Create') }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from 'vue';
import { useAccountStore } from '../stores/accountStore';
import { useThemeStore } from '../stores/themeStore';

export default defineComponent({
  name: 'AccountsView',
  setup() {
    const accountStore = useAccountStore();
    const themeStore = useThemeStore();

    const form = reactive({
      id: null as number | null,
      name: '',
      type: 'bank' as string,
      balance: 0,
      fromAccountId: null as number | null,
      toAccountId: null as number | null,
      amount: 0,
      note: ''
    });

    const showAddModal = false;
    const showEditModal = false;
    const showTransferModal = false;

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
    };

    const editAccount = (account: any) => {
      form.id = account.id;
      form.name = account.name;
      form.type = account.type;
      form.balance = account.balance;
    };

    const deleteAccount = async (id: number) => {
      if (confirm('Are you sure you want to delete this account?')) {
        await accountStore.deleteAccount(id);
      }
    };

    const handleSubmit = async () => {
      if (showEditModal && form.id) {
        await accountStore.updateAccount(form.id, form);
      } else if (showTransferModal) {
        await accountStore.transfer({
          fromAccountId: form.fromAccountId!,
          toAccountId: form.toAccountId!,
          amount: form.amount,
          note: form.note
        });
      } else {
        await accountStore.createAccount(form);
      }
    };

    const closeModals = () => {};

    onMounted(async () => {
      await accountStore.fetchAccounts();
      await accountStore.fetchSummary();
    });

    return {
      accounts: accountStore.accounts,
      summary: accountStore.summary,
      form,
      showAddModal,
      showEditModal,
      showTransferModal,
      themeStore,
      formatCurrency,
      editAccount,
      deleteAccount,
      handleSubmit,
      closeModals
    };
  }
});
</script>