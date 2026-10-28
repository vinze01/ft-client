<template>
  <div class="animate-fade-in">
    <PageHeader title="Accounts" subtitle="Manage your financial accounts">
      <template #actions>
        <button @click="showTransferModal = true" class="btn btn-secondary">
          <component :is="TransferIcon" class="w-4 h-4" />
          Transfer
        </button>
        <button @click="showAddModal = true" class="btn btn-primary">
          <component :is="PlusIcon" class="w-4 h-4" />
          Add Account
        </button>
      </template>
    </PageHeader>

    <div v-if="summary" class="card p-5 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="card-title">Total Balance</p>
          <p class="text-2xl font-semibold financial-amount mt-0.5" style="color: var(--text-primary)">
            {{ formatCurrency(summary.totalBalance) }}
          </p>
        </div>
        <div class="text-right">
          <p class="card-title">{{ accounts.length }} accounts</p>
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
            {{ account.icon || account.name.charAt(0).toUpperCase() }}
          </div>
          <div class="flex gap-1">
            <button @click="editAccount(account)" class="p-1.5 rounded-lg hover:bg-[var(--accent-50)] hover:text-[var(--accent-color)]" style="color: var(--text-muted)" title="Edit account" aria-label="Edit account">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a3.5 3.5 0 11-4.95 4.95l-4.95 4.95a3.5 3.5 0 014.95 4.95l5.657 5.657a3.5 3.5 0 01-4.95 4.95l-5.657-5.657a3.5 3.5 0 00-4.95 0"></path>
              </svg>
            </button>
            <button @click="deleteAccount(account.id)" class="p-1.5 rounded-lg hover:bg-[var(--expense-soft)] hover:text-[var(--expense)]" style="color: var(--text-muted)" title="Delete account" aria-label="Delete account">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1H6a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
        <h3 class="font-semibold mb-1" style="color: var(--text-primary)">{{ account.name }}</h3>
        <p class="text-sm mb-3 capitalize" style="color: var(--text-secondary)">{{ account.type.replace('_', ' ') }}</p>
        <p class="text-xl font-semibold financial-amount" :style="{ color: account.balance >= 0 ? 'var(--income)' : 'var(--expense)' }">
          {{ formatCurrency(account.balance) }}
        </p>
        <p v-if="account.isDefault" class="text-xs font-medium mt-2" style="color: var(--accent-color)">Default</p>
      </div>
    </div>

    <EmptyState
      v-if="accounts.length === 0"
      :icon="CreditCardIcon"
      title="No accounts yet"
      description="Add your first account to start tracking your finances."
      action-label="Add Account"
      @action="showAddModal = true"
    />

    <div v-if="showAddModal || showTransferModal" class="modal-overlay" @click.self="closeModals">
      <div class="modal-content animate-scale-in" role="dialog" aria-modal="true">
        <div class="modal-header">
          <h3 class="section-title">
            {{ showEditModal ? 'Edit' : showTransferModal ? 'Transfer' : 'Add' }} Account
          </h3>
          <button @click="closeModals" class="p-1.5 rounded-lg hover:bg-[var(--surface-elevated)]" style="color: var(--text-muted)" aria-label="Close">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="modal-body">
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

          <div v-if="!showTransferModal" class="grid grid-cols-2 gap-3">
            <div>
              <label class="label">Color</label>
              <div class="flex items-center gap-2">
                <input v-model="form.color" type="color" class="w-10 h-10 rounded-lg cursor-pointer bg-transparent" />
                <input v-model="form.color" type="text" class="input" placeholder="#059669" pattern="^#[0-9A-Fa-f]{6}$" />
              </div>
            </div>
            <div>
              <label class="label">Icon (Emoji)</label>
              <input v-model="form.icon" type="text" maxlength="4" class="input" placeholder="🏦" />
            </div>
          </div>

          <div v-if="showEditModal && !showTransferModal" class="flex items-center gap-2">
            <input v-model="form.isDefault" type="checkbox" id="isDefault" class="w-4 h-4" />
            <label for="isDefault" class="text-sm text-ink-secondary">Set as default account</label>
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
            <label class="label">Fee (Optional)</label>
            <input v-model.number="form.fee" type="number" step="0.01" min="0" class="input" placeholder="0.00" />
          </div>

          <div v-if="showTransferModal">
            <label class="label">Note (Optional)</label>
            <input v-model="form.note" type="text" class="input" placeholder="Transfer note" />
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" @click="closeModals" class="btn btn-secondary flex-1">Cancel</button>
            <button type="submit" class="btn btn-primary flex-1">{{ showTransferModal ? 'Transfer' : (showEditModal ? 'Update' : 'Create') }}</button>
          </div>
        </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from 'vue';
import { useAccountStore } from '../stores/accountStore';
import { useThemeStore } from '../stores/themeStore';
import { toast } from '../components/Toast.vue';
import PageHeader from '../components/PageHeader.vue';
import EmptyState from '../components/EmptyState.vue';
import { PlusIcon, CreditCardIcon, TransferIcon } from '../components/icons';

export default defineComponent({
  name: 'AccountsView',
  components: { PageHeader, EmptyState },
  setup() {
    const accountStore = useAccountStore();
    const themeStore = useThemeStore();

    const form = reactive({
      id: null as number | null,
      name: '',
      type: 'bank' as string,
      balance: 0,
      color: '',
      icon: '',
      isDefault: false,
      fromAccountId: null as number | null,
      toAccountId: null as number | null,
      amount: 0,
      fee: 0,
      note: ''
    });

    const showAddModal = ref(false);
    const showEditModal = ref(false);
    const showTransferModal = ref(false);

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
    };

    const editAccount = (account: any) => {
      form.id = account.id;
      form.name = account.name;
      form.type = account.type;
      form.balance = account.balance;
      form.color = account.color || '';
      form.icon = account.icon || '';
      form.isDefault = account.isDefault;
      showEditModal.value = true;
    };

    const deleteAccount = async (id: number) => {
      if (confirm('Are you sure you want to delete this account?')) {
        await accountStore.deleteAccount(id);
      }
    };

    const handleSubmit = async () => {
      try {
        if (showEditModal.value && form.id) {
          await accountStore.updateAccount(form.id, {
            name: form.name,
            type: form.type,
            balance: form.balance,
            color: form.color || undefined,
            icon: form.icon || undefined,
            isDefault: form.isDefault
          });
          toast.success('Account updated');
        } else if (showTransferModal.value) {
          await accountStore.transfer({
            fromAccountId: form.fromAccountId!,
            toAccountId: form.toAccountId!,
            amount: form.amount,
            fee: form.fee,
            note: form.note
          });
          toast.success('Transfer completed');
        } else {
          await accountStore.createAccount({
            name: form.name,
            type: form.type,
            balance: form.balance,
            color: form.color || undefined,
            icon: form.icon || undefined
          });
          toast.success('Account created');
        }
        closeModals();
      } catch (e: any) {
        toast.error(e.response?.data?.error || 'Failed to save account');
      }
    };

    const closeModals = () => {
      showAddModal.value = false;
      showEditModal.value = false;
      showTransferModal.value = false;
      form.id = null;
      form.name = '';
      form.type = 'bank';
      form.balance = 0;
      form.color = '';
      form.icon = '';
      form.isDefault = false;
      form.fromAccountId = null;
      form.toAccountId = null;
      form.amount = 0;
      form.fee = 0;
      form.note = '';
    };

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
      closeModals,
      PlusIcon,
      CreditCardIcon,
      TransferIcon
    };
  }
});
</script>